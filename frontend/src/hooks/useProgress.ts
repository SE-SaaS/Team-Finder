import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

const LS_KEY = 'ph_progress';

function loadFromStorage(): Record<string, boolean> {
  if (typeof window === 'undefined') return {};
  try {
    return JSON.parse(localStorage.getItem(LS_KEY) ?? '{}');
  } catch {
    return {};
  }
}

export function useProgress() {
  const [progress, setProgress] = useState<Record<string, boolean>>(loadFromStorage);

  // On mount: merge Supabase records into local state
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return;
      supabase
        .from('learning_progress')
        .select('item_id')
        .eq('user_id', user.id)
        .then(({ data }) => {
          if (!data?.length) return;
          const remote: Record<string, boolean> = {};
          data.forEach(row => { remote[row.item_id] = true; });
          setProgress(prev => {
            const merged = { ...prev, ...remote };
            localStorage.setItem(LS_KEY, JSON.stringify(merged));
            return merged;
          });
        });
    });
  }, []);

  const markComplete = async (id: string, type: 'node' | 'course' = 'node') => {
    const updated = { ...progress, [id]: true };
    setProgress(updated);
    localStorage.setItem(LS_KEY, JSON.stringify(updated));

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from('learning_progress').upsert(
      { user_id: user.id, item_id: id, item_type: type },
      { onConflict: 'user_id,item_id' }
    );
  };

  const isComplete = useCallback((id: string): boolean => !!progress[id], [progress]);

  const completedCount = useCallback(
    (ids: string[]): number => ids.filter(id => progress[id]).length,
    [progress]
  );

  return { markComplete, isComplete, completedCount };
}
