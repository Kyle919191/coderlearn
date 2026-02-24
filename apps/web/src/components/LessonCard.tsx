interface LessonCardProps {
    day: number;
  title: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  concepts: string[];
  isCompleted: boolean;
  onClick: () => void;
}

const difficultyStyles: Record<"beginner" | "intermediate" | "advanced", string> = {
    beginner: "bg-green-100 text-green-800",
    intermediate: "bg-yellow-100 text-yellow-800",
    advanced: "bg-red-100 text-red-800",
  };

