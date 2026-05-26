import { useState, useEffect, useCallback } from "react";
import { api } from "../api/client";
import type { Task, TaskStatus, CreateTaskBody, UpdateTaskBody } from "../types";

export function useTasks(statusFilter?: TaskStatus) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error: err } = await api.GET("/api/v1/tasks", {
      params: { query: statusFilter ? { status: statusFilter } : undefined },
    });
    if (err) {
      setError("タスクの取得に失敗しました");
    } else {
      setTasks(data ?? []);
    }
    setLoading(false);
  }, [statusFilter]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const createTask = async (body: CreateTaskBody): Promise<boolean> => {
    const { error: err } = await api.POST("/api/v1/tasks", { body });
    if (err) return false;
    await fetchTasks();
    return true;
  };

  const updateTask = async (id: number, body: UpdateTaskBody): Promise<boolean> => {
    const { error: err } = await api.PATCH("/api/v1/tasks/{id}", {
      params: { path: { id } },
      body,
    });
    if (err) return false;
    await fetchTasks();
    return true;
  };

  const deleteTask = async (id: number): Promise<boolean> => {
    const { error: err } = await api.DELETE("/api/v1/tasks/{id}", {
      params: { path: { id } },
    });
    if (err) return false;
    await fetchTasks();
    return true;
  };

  return { tasks, loading, error, fetchTasks, createTask, updateTask, deleteTask };
}
