import { z } from "zod";

export const treeQuerySchema = z.object({
    includeLocked: z.enum(["true", "false"]).optional(),
});

export type TreeQuery = z.infer<typeof treeQuerySchema>;