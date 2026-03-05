import { Router, Request, Response, NextFunction } from "express";
import { join } from "path";
import { ContentLoader, ContentNotFoundError } from "../services/contentLoader";


const TEMPLATES_BASE = join(__dirname, "../../../../packages/course-templates/todo-pro/course");

const loader = new ContentLoader(TEMPLATES_BASE);
const router = Router();

router.get("/:id/meta", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const meta = await loader.loadMeta(req.params.id);
        res.status(200).json(meta);
    } catch (error: unknown) {
        if (error instanceof ContentNotFoundError) {
            res.status(404).json({ error: { message: error.message } });
            return;
        }
        next(error);
    }
});

export default router;