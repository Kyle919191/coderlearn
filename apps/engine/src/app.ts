import express, { Express } from "express";
import cors from "cors";
import { requestId } from "./middleware/requestId";
import { errorHandler } from "./middleware/errorHandler";
import healthRoutes from "./routes/health";
import treeRoutes from "./routes/tree";
import submoduleRoutes from "./routes/submodule";

export function createApp(): Express { // order matters here !!!
    const app = express();

    app.use(cors());
    app.use(express.json()); // read request as JSON into req.body
    app.use(requestId);

    app.use("/health", healthRoutes);
    app.use("/api/tree", treeRoutes);
    app.use("/api/submodule", submoduleRoutes);
    app.use(errorHandler); // bottom to catch route errors

    return app;
}