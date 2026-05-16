import { useState, useCallback } from 'react';

export function useProgress() {
  const [progress, setProgress] = useState<Record<string, boolean>>(
    () => typeof window === 'undefined'
      ? {}
      : JSON.parse(localStorage.getItem("ph_progress") ?? "{}")
  );

  const markComplete = useCallback((id: string) => {
    setProgress(prev => {
      const updated = { ...prev, [id]: true };
      localStorage.setItem("ph_progress", JSON.stringify(updated));
      return updated;
    });
  }, []);

  const isComplete = useCallback((id: string): boolean => !!progress[id], [progress]);

  const completedCount = useCallback(
    (ids: string[]): number => ids.filter(id => progress[id]).length,
    [progress]
  );

  return { markComplete, isComplete, completedCount };
}
