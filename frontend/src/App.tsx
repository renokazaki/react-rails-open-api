import { useState } from "react";
import { useTasks } from "./hooks/useTasks";
import { TaskCard } from "./components/TaskCard";
import { TaskForm } from "./components/TaskForm";
import { Modal } from "./components/Modal";
import type { Task, TaskStatus } from "./types";
import "./App.css";

const STATUS_FILTERS: { value: TaskStatus | undefined; label: string }[] = [
  { value: undefined, label: "すべて" },
  { value: "pending", label: "未着手" },
  { value: "in_progress", label: "進行中" },
  { value: "completed", label: "完了" },
];

function App() {
  const [statusFilter, setStatusFilter] = useState<TaskStatus | undefined>(undefined);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editTarget, setEditTarget] = useState<Task | null>(null);

  const { tasks, loading, error, createTask, updateTask, deleteTask } = useTasks(statusFilter);

  const handleCreate = async (title: string, description: string, status: TaskStatus) => {
    const ok = await createTask({ task: { title, description: description || undefined, status } });
    if (ok) setShowCreateModal(false);
    return ok;
  };

  const handleUpdate = async (title: string, description: string, status: TaskStatus) => {
    if (!editTarget) return false;
    const ok = await updateTask(editTarget.id, { task: { title, status } });
    if (ok) setEditTarget(null);
    return ok;
  };

  const handleDelete = async (id: number) => {
    await deleteTask(id);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>タスク管理</h1>
        <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>
          + 新しいタスク
        </button>
      </header>

      <div className="filter-bar">
        {STATUS_FILTERS.map((f) => (
          <button
            key={f.label}
            className={`filter-btn ${statusFilter === f.value ? "active" : ""}`}
            onClick={() => setStatusFilter(f.value)}
          >
            {f.label}
          </button>
        ))}
      </div>

      <main className="task-list-container">
        {loading && <p className="state-message">読み込み中…</p>}
        {error && <p className="state-message state-error">{error}</p>}
        {!loading && !error && tasks.length === 0 && (
          <p className="state-message">タスクがありません</p>
        )}
        <div className="task-grid">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={setEditTarget}
              onDelete={handleDelete}
            />
          ))}
        </div>
      </main>

      {showCreateModal && (
        <Modal title="新しいタスクを作成" onClose={() => setShowCreateModal(false)}>
          <TaskForm onSubmit={handleCreate} onCancel={() => setShowCreateModal(false)} />
        </Modal>
      )}

      {editTarget && (
        <Modal title="タスクを編集" onClose={() => setEditTarget(null)}>
          <TaskForm onSubmit={handleUpdate} onCancel={() => setEditTarget(null)} initial={editTarget} />
        </Modal>
      )}
    </div>
  );
}

export default App;
