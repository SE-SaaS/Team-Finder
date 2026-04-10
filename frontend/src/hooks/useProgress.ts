import { useState } from 'react';

/**
 * Hook for managing learning progress
 * Tracks completed nodes/courses in localStorage
 */
export function useProgress() {
  const [progress, setProgress] = useState<Record<string, boolean>>(
    () => JSON.parse(localStorage.getItem("ph_progress") ?? "{}")
  );

  const markComplete = (id: string) => {
    const updated = { ...progress, [id]: true };
    setProgress(updated);
    localStorage.setItem("ph_progress", JSON.stringify(updated));
  };

  const isComplete = (id: string): boolean => !!progress[id];

  const completedCount = (ids: string[]): number =>
    ids.filter(id => progress[id]).length;

  return { markComplete, isComplete, completedCount };
}
