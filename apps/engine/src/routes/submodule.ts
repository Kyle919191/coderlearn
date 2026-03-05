import { Router, Request, Response, NextFunction } from "express";
import { join } from "path";
import { ZodError } from "zod";
import { ContentLoader, ContentNotFoundError } from "../services/contentLoader";
import { submoduleIdParamSchema } from "../schemas/submoduleSchemas";
import { AppError } from "../errors/AppError";
import { validateOrThrow } from "../utils/validate";

const TEMPLATES_BASE = join(__dirname, "../../../../packages/course-templates/todo-pro/course");
const loader = new ContentLoader(TEMPLATES_BASE);
const router = Router();

router.get("/:id/meta", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const params = validateOrThrow(submoduleIdParamSchema, req.params, "Invalid request parameters");
    const meta = await loader.loadMeta(params.id);
    res.status(200).json(meta);
  } catch (error: unknown) {
    if (error instanceof ContentNotFoundError) {
      return next(
        new AppError(404, "CONTENT_NOT_FOUND", error.message)
      );
    }

    next(error);
  }
});

export default router;