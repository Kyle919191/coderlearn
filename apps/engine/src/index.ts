import "dotenv/config";
import { createApp } from "./app";

const PORT = process.env.PORT ?? 3000;


const app = createApp();

app.listen(Number(PORT), () => {
    console.log(`LearnMode EngineServer is running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV ?? "development"}`);
});