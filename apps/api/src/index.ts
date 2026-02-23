import {User, Lesson, LearningTrack } from "./types/lesson";
import { isValidEmail, parseScore, isUser } from "./utils/validate";
import { formatLesson, first, difficultyRank } from "./utils/format";

const appName: string = "AI Coding Learner";
const version: number = 2;
const port: number = 3000;

const sampleUser: User = {
    id: "user_001",
    email: "kyle@example.com",
    name: "Kyle",
    createdAt: new Date(),
};

const sampleTrack: LearningTrack = {
    id: "track_ts",
    language: "typescript",
    title: "TypeScript Fundamentals",
    totalDays: 30,
};

const sampleLessons: Lesson[] = [
    {
        id: "lesson_001",
        trackId: "track_ts",
        day: 1,
        title: "Architecture and Monorepo Setup",
        difficulty: "beginner",
        concepts: ["monorepo", "typescript", "npm workspaces"],
        isCompleted: true,
        completedAt: new Date(),
      },
      {
        id: "lesson_002",
        trackId: "track_ts",
        day: 2,
        title: "TypeScript Fundamentals",
        difficulty: "beginner",
        concepts: ["interfaces", "generics", "modules", "async/await"],
        isCompleted: false,
      },
];

async function fetchUserById(id: string): Promise<User | null> { //async always returns a promise of some type
    await new Promise<void>((resolve) => setTimeout(resolve, 50)); // basically a sleep(50)
    //awaits a resolvable promise through a function(resolve): wait(50)
    if (id === sampleUser.id) { 
        return sampleUser;
    }
    return null;
};

async function main(): Promise<void> { // an inner await make the function(1) async, and outer function(2) must await for function(1)'s result, so function(2) has to be async too
    console.log(`${appName} v${version} is starting up...`);

    const user = await fetchUserById("user_001");
    if (user !== null) {
        console.log("Loaded user:", user.name);
        console.log("Email valid:", isValidEmail(user.email));
    }

    console.log("Track:", sampleTrack.title);

    const firstLesson = first(sampleLessons);
    if (firstLesson !== undefined) {
        console.log("First lesson:", formatLesson(firstLesson));
        console.log("Difficulty rank:", difficultyRank(firstLesson.difficulty));
    }

    console.log("\nAll lessons:");
    sampleLessons.forEach((lesson) => { //for each is equivalent to for, inside foreach must be a function
        console.log(" ", formatLesson(lesson));
  });

    console.log("\nScore parse tests:");
    console.log("  parseScore(85):", parseScore(85));
    console.log("  parseScore('bad'):", parseScore("bad"));
    console.log("  parseScore(150):", parseScore(150));

    const unknownData: unknown = { id: "x", email: "a@b.com", name: "Test" };
    console.log("isUser check:", isUser(unknownData));
    console.log(`\nListening on port ${port}`);
}

main();