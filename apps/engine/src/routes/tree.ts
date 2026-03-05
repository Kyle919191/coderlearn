import { Router, Request, Response, NextFunction } from "express";
import { CourseTree } from "../types/course";
import { treeQuerySchema } from "../schemas/treeSchemas";
import { ZodError } from "zod";
import { AppError } from "../errors/AppError";
import { validateOrThrow } from "../utils/validate";

const router = Router();

const mockTree: CourseTree = {
  projectId: "proj_001",
  projectRequest: "Build a production-ready todo app with auth, db, and deployment",
  templateId: "todo-pro",
  createdAt: new Date().toISOString(),
  modules: [
    {
      id: "mod_1",
      order: 1,
      title: "Setup",
      description: "Scaffold the repo, run dev servers, configure environment",
      submodules: [
        {
          id: "sub_1_1",
          moduleId: "mod_1",
          order: 1,
          title: "Repo Scaffold",
          description: "Set up monorepo folder structure",
          status: "available",
          dependsOn: [],
          hasQuiz: true,
          hasSideQuest: false,
        },
        {
          id: "sub_1_2",
          moduleId: "mod_1",
          order: 2,
          title: "Dev Servers",
          description: "Run frontend and backend dev servers",
          status: "locked",
          dependsOn: ["sub_1_1"],
          hasQuiz: true,
          hasSideQuest: false,
        },
        {
          id: "sub_1_3",
          moduleId: "mod_1",
          order: 3,
          title: "Environment Variables",
          description: "Configure dotenv and .env.example",
          status: "locked",
          dependsOn: ["sub_1_2"],
          hasQuiz: false,
          hasSideQuest: false,
        },
      ],
    },
    {
      id: "mod_2",
      order: 2,
      title: "Backend Basics",
      description: "Express routes, validation, service layer, tests",
      submodules: [
        {
          id: "sub_2_1",
          moduleId: "mod_2",
          order: 1,
          title: "Routes and Controllers",
          description: "Express routing and controller pattern",
          status: "locked",
          dependsOn: ["sub_1_3"],
          hasQuiz: true,
          hasSideQuest: false,
        },
        {
          id: "sub_2_2",
          moduleId: "mod_2",
          order: 2,
          title: "Validation and Error Handling",
          description: "Zod validation and centralized error handling",
          status: "locked",
          dependsOn: ["sub_2_1"],
          hasQuiz: true,
          hasSideQuest: false,
        },
        {
          id: "sub_2_3",
          moduleId: "mod_2",
          order: 3,
          title: "Service Layer Pattern",
          description: "Separate business logic from route handlers",
          status: "locked",
          dependsOn: ["sub_2_2"],
          hasQuiz: true,
          hasSideQuest: true,
        },
        {
          id: "sub_2_4",
          moduleId: "mod_2",
          order: 4,
          title: "API Tests",
          description: "Vitest and supertest for API endpoints",
          status: "locked",
          dependsOn: ["sub_2_3"],
          hasQuiz: false,
          hasSideQuest: false,
        },
      ],
    },
    {
      id: "mod_3",
      order: 3,
      title: "Database",
      description: "Schema design, migrations, CRUD, ORM vs SQL side quest",
      submodules: [
        {
          id: "sub_3_1",
          moduleId: "mod_3",
          order: 1,
          title: "Schema Design and Migrations",
          description: "Design the DB schema and run Prisma migrations",
          status: "locked",
          dependsOn: ["sub_2_4"],
          hasQuiz: true,
          hasSideQuest: false,
        },
        {
          id: "sub_3_2",
          moduleId: "mod_3",
          order: 2,
          title: "CRUD Persistence",
          description: "Implement create, read, update, delete in the DB layer",
          status: "locked",
          dependsOn: ["sub_3_1"],
          hasQuiz: false,
          hasSideQuest: false,
        },
        {
          id: "sub_3_3",
          moduleId: "mod_3",
          order: 3,
          title: "Side Quest: ORM vs Raw SQL",
          description: "Measure query count and latency differences",
          status: "locked",
          dependsOn: ["sub_3_2"],
          hasQuiz: false,
          hasSideQuest: true,
        },
      ],
    },
  ],
};

router.get("/", (req: Request, res: Response, next: NextFunction): void => {
    try {
        const query = validateOrThrow(treeQuerySchema, req.query, "Invalid query parameters"); //req.query is includeLocked
        // parse the query to try to fit to the schema(object), and access with query.includeLocked
        const includeLocked = query.includeLocked === "true";

        if (includeLocked) {
            res.status(200).json(mockTree);
            return;
        }

        const filteredTree: CourseTree = {
            ...mockTree, // keeping previous entries in mockTree the same
            modules: mockTree.modules.map((module) => ({
                ...module,
                submodules: module.submodules.filter((submodule) => submodule.status !== "locked"),
            })),
        };

        res.status(200).json(filteredTree);
    } catch (error: unknown) {
        next(error); // passed down to the error handler middleware
    }
});

export default router;