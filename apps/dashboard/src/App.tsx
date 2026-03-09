import { Link, Navigate, Route, Routes, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchCourseTree, type CourseTreeResponse, type SubmoduleStatus } from "./lib/api";

function AppLayout() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <header className="border-b border-slate-200 bg-white px-5 py-3">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between">
          <h1 className="m-0 text-lg font-semibold">LearnMode</h1>
          <nav className="flex items-center gap-3 text-sm">
            <Link className="text-slate-700 hover:text-slate-900" to="/">
              Start
            </Link>
            <Link className="text-slate-700 hover:text-slate-900" to="/tree">
              Tree
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl px-5 py-6">
        <Routes>
          <Route path="/" element={<ProjectStartPage />} />
          <Route path="/tree" element={<TreePage />} />
          <Route path="/submodule/:id" element={<SubmodulePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

function ProjectStartPage() {
  return (
    <section className="space-y-2">
      <h2 className="text-xl font-semibold">Project Start</h2>
      <p className="text-slate-700">Start a new LearnMode journey from a project request.</p>
      <p className="text-slate-600">(Day 7 placeholder: form UI comes next.)</p>
    </section>
  );
}

// flow: first run without useEffect, just based on initial state values(so run if (isloading) branch)
// runs useEffect, runs branches based on results of the states, check all branches through if statements
// in the success case, all three branches result in false and do not return anything, allowing the final blob to return
// “guard clauses first, success UI last"
function TreePage() {
  // state info: decide what to render based on these
  const [tree, setTree] = useState<CourseTreeResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // function inside TreePage function, because fetching data is a side effect, we use useEffect
  // runs after the component mounts, then re-render components
  useEffect(() => {
    // useEffect structure: useEffect(() => {
    // setup code to run
    // return cleanup function
    // }, []);

    let isCancelled =false;

    async function loadTree() {
      try {
        setIsLoading(true);
        setErrorMessage(null);
        const data = await fetchCourseTree(true);
        if (!isCancelled) {
          setTree(data);
        }
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "An unknown error occurred";
        if (!isCancelled) {
          setErrorMessage(message);
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
    }
  }

    loadTree();

    // React runs it when component unmounts, like when user leaves /tree before fetch finishes.
    // we return this function, but not directly calling it yet.
    return () => {
      isCancelled = true;
    };
  }, []);

  if (isLoading) {
    return (
      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Skill Tree</h2>
        <p className="text-slate-600">Loading tree from engine...</p>
      </section>
    );
  }

  if (errorMessage) {
    return (
      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Skill Tree</h2>
        <p className="text-red-600">Failed to load tree: {errorMessage}</p>
      </section>
    );
  }

  if (!tree) {
    return (
      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Skill Tree</h2>
        <p className="text-slate-600">No tree data available.</p>
      </section>
    );
  }

  return (
    <section className="space-y-4">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold">Skill Tree</h2>
        <p className="text-slate-600">Project request: {tree.projectRequest}</p>
      </div>

      <div className="space-y-4">
        {tree.modules.map((module) => (
          <article key={module.id} className="rounded-lg border border-slate-200 bg-white p-4">
            <h3 className="text-lg font-semibold">{module.order}. {module.title}</h3>
            <p className="mt-1 text-slate-600">{module.description}</p>

            <ul className="mt-3 space-y-2">
              {module.submodules.map((submodule) => (
                <li
                  key={submodule.id}
                  className="flex items-center justify-between rounded-md border border-slate-200 px-3 py-2"
                >
                  <div>
                    <p className="font-medium">{submodule.order}. {submodule.title}</p>
                    <p className="text-sm text-slate-600">{submodule.description}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <StatusBadge status={submodule.status} /> 
                    <Link
                      className="text-sm text-blue-700 hover:text-blue-900"
                      to={`/submodule/${submodule.id}`}
                    >
                      Open
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
  
function StatusBadge({ status }: { status: SubmoduleStatus }) {
  const classes =
    status === "completed"
      ? "bg-green-100 text-green-800"
      : status === "in_progress"
      ? "bg-amber-100 text-amber-800"
      : status === "available"
      ? "bg-blue-100 text-blue-800"
      : "bg-slate-200 text-slate-700";

  return (
    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${classes}`}>
      {status}
    </span>
  );
}


function SubmodulePage() {
  const { id } = useParams<{ id: string }>();

  return (
    <section className="space-y-2">
      <h2 className="text-xl font-semibold">Submodule</h2>
      <p className="text-slate-700">
        Current submodule id: <code className="rounded bg-slate-200 px-1 py-0.5">{id}</code>
      </p>
      <p className="text-slate-600">(Day 9+ will render lecture/coding/reflection tabs.)</p>
    </section>
  );
}

export default function App() {
  return <AppLayout />;
}