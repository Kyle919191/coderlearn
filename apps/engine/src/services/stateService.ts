import {mkdir, readFile, writeFile} from "fs/promises";
import {dirname, join} from "path";
import type { LearnModeState } from "@learnmode/core";
import {learnModeStateSchema} from "../schemas/stateSchemas";
import {AppError } from "../errors/AppError";

// use learnmodestate for return types, use learnmodestateschema when parsing/validating
export class StateService {
    constructor(private readonly stateFilePath: string) {}

    async ensureInitialized(projectId: string, templateId: string): Promise<LearnModeState> {
        try {
            const existing = await this.readState();
            return existing;
        } catch (error: unknown) {
            if (
                error instanceof AppError && error.code === "CONTENT_NOT_FOUND"
            ) {
                const now = new Date().toISOString();

                const initialState: LearnModeState = {
                    version: 1,
                    projectId,
                    templateId,
                    createdAt: now,
                    updatedAt: now,
                    submodules: {},
                };

                await this.writeState(initialState);
                return initialState;
            }
            throw error;
        }
    }

    async readState(): Promise<LearnModeState> {
        let raw: string;

        try {
            raw = await readFile(this.stateFilePath, "utf-8");
        } catch (error: unknown) {
            if (isNodeError(error) && error.code === "ENOENT") {
                throw new AppError(404, "CONTENT_NOT_FOUND", "State file not found");
            }
            throw error;
        }

        let parsed: unknown;
        try {
            parsed = JSON.parse(raw);
        } catch {
            throw new AppError(400, "INTERNAL_ERROR", "invalid JSON");
        }

        const result = learnModeStateSchema.safeParse(parsed);
        if (!result.success) {
            throw new AppError(400, "INTERNAL_ERROR", "failed schema validation", result.error.issues);
        }
        return result.data; // the type is essentially equivalent to learnmodestate
    }

    async writeState(state: LearnModeState): Promise<void> {
        const validated = learnModeStateSchema.parse(state);

        await mkdir(dirname(this.stateFilePath), {recursive: true});
        await writeFile(this.stateFilePath, JSON.stringify(validated, null, 2), "utf-8");
    }

    async updateState(updater: (current: LearnModeState) => LearnModeState): Promise<LearnModeState> {
        const current = await this.readState();
        const next = updater(current);
        next.updatedAt = new Date().toISOString();
        await this.writeState(next);
        return next;
    }

}

function isNodeError(error: unknown):error is NodeJS.ErrnoException {
    return error instanceof Error && "code" in error;
}

export const defaultStateFilePath = join(
    __dirname,
    "../../../../.learnmode/state.json"
  );