import { z } from "zod";

export const submoduleStatusSchema = z.enum([
  "locked",
  "available",
  "in_progress",
  "completed",
]);

export const submoduleProgressSchema = z.object({
  submoduleId: z.string().min(1),
  status: submoduleStatusSchema,
  quizPassed: z.boolean(),
  checksPassed: z.boolean(),
  hintUsageCount: z.number().int().nonnegative(),
  prepGenerated: z.boolean(),
  testsGenerated: z.boolean(),
  reflectionSubmitted: z.boolean(),
  updatedAt: z.iso.datetime(),
});

export const learnModeStateSchema = z.object({
  version: z.literal(1),
  projectId: z.string().min(1),
  templateId: z.string().min(1),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
  submodules: z.record(z.string(), submoduleProgressSchema),
});


// generally need schema checks for writing/updating
export const updateSubmoduleStatusBodySchema = z.object({status: submoduleStatusSchema});

export type SubmoduleProgressInput = z.infer<typeof submoduleProgressSchema>;
export type LearnModeStateInput = z.infer<typeof learnModeStateSchema>;
export type UpdateSubmoduleStatusBodyInput = z.infer<typeof updateSubmoduleStatusBodySchema>;