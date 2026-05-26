import { useState } from "react";
import type { Task, TaskStatus } from "../types";

type Props = {
  onSubmit: (title: string, description: string, status: TaskStatus) => Promise<boolean>;
  onCancel?: () => void;
  initial?: Task;
};

const STATUS_OPTIONS: { value: TaskStatus; label: string }[] = [
  { value: "pending", label: "未着手" },
  { value: "in_progress", label: "進行中" },
  { value: "completed", label: "完了" },
];

export function TaskForm({ onSubmit, onCancel, initial }: Props) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [status, setStatus] = useState<TaskStatus>((initial?.status as TaskStatus) ?? "pending");
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrors(["タイトルは必須です"]);
      return;
    }
    setSubmitting(true);
    setErrors([]);
    const ok = await onSubmit(title.trim(), description.trim(), status);
    setSubmitting(false);
    if (!ok) {
      setErrors(["保存に失敗しました。もう一度お試しください。"]);
    }
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      {errors.length > 0 && (
        <ul className="form-errors">
          {errors.map((e) => <li key={e}>{e}</li>)}
        </ul>
      )}
      <div className="form-field">
        <label htmlFor="title">タイトル <span className="required">*</span></label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="タスクのタイトル"
          required
        />
      </div>
      <div className="form-field">
        <label htmlFor="description">説明</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="タスクの詳細（任意）"
          rows={3}
        />
      </div>
      <div className="form-field">
        <label htmlFor="status">ステータス</label>
        <select
          id="status"
          value={status}
          onChange={(e) => setStatus(e.target.value as TaskStatus)}
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>
      <div className="form-actions">
        {onCancel && (
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            キャンセル
          </button>
        )}
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? "保存中…" : initial ? "更新" : "作成"}
        </button>
      </div>
    </form>
  );
}
