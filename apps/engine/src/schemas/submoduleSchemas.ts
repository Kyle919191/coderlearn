import { z } from "zod";

export const submoduleIdParamSchema = z.object({
    id: z.string().min(1, "submodule id is required).")
});

export type SubmoduleIdParams = z.infer<typeof submoduleIdParamSchema>;