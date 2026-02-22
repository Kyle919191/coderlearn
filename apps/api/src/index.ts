const appName: string="AI Coding Learner";
const version: number=1;
const isRunning: boolean=true;

console.log(`${appName} v${version} is starting up...`); //ts fstring printing
console.log(`Server status: ${isRunning ? "running" : "stopped"}`);

const config: {
    name: string;
    version: number;
    environment: string;
} = {
    name: appName,
    version,
    environment: process.env.NODE_ENV ?? "development"
};

const port: number=3000;
console.log("Loaded config:", config); //no backtick you want to print an OBJECT not primitive and have the terminal show its full structure
console.log(`Listening on port ${port}`);