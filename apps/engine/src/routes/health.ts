import { Router, Request, Response } from "express";

const router = Router();

router.get("/", (req: Request, res: Response): void => { //register a health check function for get
    res.status(200).json({
        status: "ok",
        service: "learnmode-engine",
        timestamp: new Date().toISOString(),
        uptime: Math.floor(process.uptime()),
    });
});

export default router; 