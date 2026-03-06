import {Router, Request, Response, NextFunction} from "express";
import {StateService, defaultStateFilePath} from "../services/stateService";
import {AppError} from "../errors/AppError";
import {submoduleIdParamSchema} from "../schemas/submoduleSchemas";
import {updateSubmoduleStatusBodySchema} from "../schemas/stateSchemas";
import {validateOrThrow} from "../utils/validate";

const router = Router();
const stateService = new StateService(defaultStateFilePath);

router.get("/", async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const state = await stateService.ensureInitialized("proj_001", "todo-pro");
        res.status(200).json(state);
    } catch (error: unknown) {
        next(error);
    }
});

// updates submodule status, returns updated submodule progress
router.post("/submodule/:id/status", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const params = validateOrThrow(submoduleIdParamSchema, req.params, "Invalid submodule id");
        const body = validateOrThrow(updateSubmoduleStatusBodySchema, req.body, "Invalid request body");

        await stateService.ensureInitialized("proj_001", "todo-pro");

        const nextState = await stateService.updateState((current) => {
            // current comes from state service, reading the state file
            const now = new Date().toISOString();
            const existing = current.submodules[params.id]; //of type submoduleprogress

            const updateSubmodule = existing ? {
                ...existing,
                status: body.status,
                updatedAt: now,
            }
            : {
                submoduleId: params.id,
              status: body.status,
              quizPassed: false,
              checksPassed: false,
              hintUsageCount: 0,
              prepGenerated: false,
              testsGenerated: false,
              reflectionSubmitted: false,
              updatedAt: now,
            };

            return {
                ...current,
                submodules: {
                    ...current.submodules,
                    [params.id]: updateSubmodule,
                },
            };
        });

        const updated = nextState.submodules[params.id];
        if (!updated) {
            throw new AppError(500, "INTERNAL_ERROR", "Failed to update submodule status");
        }

        res.status(200).json(updated);
    } catch (error: unknown) {
        next(error);
    }
}
);

export default router;