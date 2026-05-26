import type { Task } from "../types";

type Props = {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
};

const STATUS_LABEL: Record<string, string> = {
  pending: "未着手",
  in_progress: "進行中",
  completed: "完了",
};

const STATUS_CLASS: Record<string, string> = {
  pending: "status-pending",
  in_progress: "status-in-progress",
  completed: "status-completed",
};

export function TaskCard({ task, onEdit, onDelete }: Props) {
  const handleDelete = () => {
    if (confirm(`「${task.title}」を削除しますか？`)) {
      onDelete(task.id);
    }
  };

  return (
    <div className="task-card">
      <div className="task-card-header">
        <span className={`status-badge ${STATUS_CLASS[task.status] ?? ""}`}>
          {STATUS_LABEL[task.status] ?? task.status}
        </span>
        <div className="task-card-actions">
          <button className="btn-icon" onClick={() => onEdit(task)} title="編集">✏️</button>
          <button className="btn-icon btn-danger" onClick={handleDelete} title="削除">🗑️</button>
        </div>
      </div>
      <h3 className="task-title">{task.title}</h3>
      {task.description && (
        <p className="task-description">{task.description}</p>
      )}
      <p className="task-date">
        {new Date(task.created_at).toLocaleDateString("ja-JP")}
      </p>
    </div>
  );
}
