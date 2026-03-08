import { Link, Navigate, Route, Routes, useParams } from "react-router-dom";

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

function TreePage() {
  return (
    <section className="space-y-2">
      <h2 className="text-xl font-semibold">Skill Tree</h2>
      <p className="text-slate-700">Tree visualization placeholder.</p>
      <p className="text-slate-600">(Day 8 will fetch and render /api/tree.)</p>
    </section>
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