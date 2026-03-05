import { readFile } from "fs/promises";
import { join } from "path";
import type {
  SubmoduleMeta,
  LectureSpec,
  CodingPrepJson,
  CodingTodoJson,
  CodingVerifyJson,
  ReflectionSpec,
} from "@learnmode/core";

export class ContentNotFoundError extends Error {
    constructor(submoduleId: string, filePath: string) {
        super(`Content not found: ${filePath} for submodule "${submoduleId}"`);
        this.name = "ContentNotFoundError";
      }
}

function isNodeError(err: unknown): err is NodeJS.ErrnoException {
    return err instanceof Error && "code" in err;
}

async function readJson<T>(filePath: string, submoduleId: string): Promise<T> {
    try {
        const raw = await readFile(filePath, "utf-8");
        return JSON.parse(raw) as T;
    } catch (error: unknown) {
        if (isNodeError(error) && error.code === "ENOENT") {
            throw new ContentNotFoundError(submoduleId, filePath);
        }
        throw error;
    }
}

export class ContentLoader {
    constructor(private readonly basePath: string) {}

    private submodulePath(submoduleId: string): string {
        return join(this.basePath, "submodules", submoduleId);
    }

    async loadMeta(submoduleId: string): Promise<SubmoduleMeta> {
        return readJson<SubmoduleMeta>(join(this.submodulePath(submoduleId), "meta.json"), submoduleId);
    }

    async loadLectureSpec(submoduleId: string): Promise<LectureSpec> {
        return readJson<LectureSpec>(join(this.submodulePath(submoduleId), "lecture", "spec.json"), submoduleId);
    }

  async loadPrepJson(submoduleId: string): Promise<CodingPrepJson> {
    return readJson<CodingPrepJson>(join(this.submodulePath(submoduleId), "coding", "prep.json"), submoduleId);
  }

  async loadTodoJson(submoduleId: string): Promise<CodingTodoJson> {
    return readJson<CodingTodoJson>(join(this.submodulePath(submoduleId), "coding", "todo.json"), submoduleId);
    }

    async loadVerifyJson(submoduleId: string): Promise<CodingVerifyJson> {
        return readJson<CodingVerifyJson>(
          join(this.submodulePath(submoduleId), "coding", "verify.json"),
          submoduleId
        );
      }
    
      async loadReflectionSpec(submoduleId: string): Promise<ReflectionSpec> {
        return readJson<ReflectionSpec>(
          join(this.submodulePath(submoduleId), "reflection", "spec.json"),
          submoduleId
        );
      }
    
}