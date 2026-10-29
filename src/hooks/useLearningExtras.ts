import { useCallback, useEffect, useState } from 'react';

/** Additive local progress store; legacy student data and keys are untouched. */
const KEY = 'ciliklab_extras_progress_v1';
export interface ExtrasProgress {
  completed: string[];
  scores: Record<string, number>;
  comicPages: Record<string, number>;
  events?: ArcadeEvent[];
  customMazes?: SavedMaze[];
}
export type ArcadeEvent = {kind:'attempt'|'hint'|'win'|'star'|'code_error'|'create'; level:string; time:number};
export type SavedMaze = {id:string;name:string;map:string[];createdAt:number};
const initial: ExtrasProgress = { completed: [], scores: {}, comicPages: {} };
function readProgress(): ExtrasProgress {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY) || '{}');
    return {
      completed: Array.isArray(saved.completed) ? saved.completed.filter((s: unknown): s is string => typeof s === 'string') : [],
      scores: saved.scores && typeof saved.scores === 'object' ? saved.scores : {},
      comicPages: saved.comicPages && typeof saved.comicPages === 'object' ? saved.comicPages : {},
      events: Array.isArray(saved.events) ? saved.events.slice(-800).filter((e: ArcadeEvent) => e && typeof e.level === 'string' && typeof e.kind === 'string') : [],
      customMazes: Array.isArray(saved.customMazes) ? saved.customMazes.filter((m: SavedMaze) => m && Array.isArray(m.map)) : [],
    };
  } catch { return {...initial}; }
}
export function useLearningExtras() {
  const [progress, setProgress] = useState<ExtrasProgress>(readProgress);
  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(progress)); } catch { /* unavailable storage */ }
    window.dispatchEvent(new Event('ciliklab-extras-progress'));
  }, [progress]);
  // Keeps the arcade hub and a currently mounted game in sync without changing
  // the original AppContext or its localStorage keys.
  useEffect(() => {
    const sync = () => {
      const updated = readProgress();
      setProgress(previous => JSON.stringify(previous) === JSON.stringify(updated) ? previous : updated);
    };
    window.addEventListener('ciliklab-extras-progress', sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener('ciliklab-extras-progress', sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  const award = useCallback((key: string, score: number) => {
    setProgress(old => {
      if (old.completed.includes(key)) return old;
      return { ...old, completed: [...old.completed, key], scores: { ...old.scores, [key]: score } };
    });
  }, []);
  // Per-level best-score storage. Replays can improve a score without
  // repeatedly awarding the same completion points.
  const recordBest = useCallback((key: string, score: number) => {
    const safeScore = Number.isFinite(score) ? Math.max(0, Math.round(score)) : 0;
    setProgress(old => {
      const previous = Number(old.scores[key]) || 0;
      if (old.completed.includes(key) && safeScore <= previous) return old;
      return {
        ...old,
        completed: old.completed.includes(key) ? old.completed : [...old.completed, key],
        scores: {...old.scores, [key]: Math.max(previous, safeScore)}
      };
    });
  }, []);
  const saveComicPage = useCallback((id: string, page: number) => {
    setProgress(old => old.comicPages[id] === page ? old : { ...old, comicPages: {...old.comicPages, [id]: page} });
  }, []);
  const logEvent = useCallback((kind:ArcadeEvent['kind'], level:string) => {
    setProgress(old => ({...old,events:[...(old.events || []),{kind,level,time:Date.now()}].slice(-800)}));
  }, []);
  const saveMaze = useCallback((maze:SavedMaze) => setProgress(old => ({...old,customMazes:[...(old.customMazes || []).filter(x => x.id !== maze.id),maze].slice(-40)})),[]);
  const deleteMaze = useCallback((id:string) => setProgress(old => ({...old,customMazes:(old.customMazes || []).filter(x=>x.id!==id)})),[]);
  const total = Object.values(progress.scores).reduce((a, b) => a + (Number(b) || 0), 0);
  return { progress, award, recordBest, saveComicPage, total, logEvent, saveMaze, deleteMaze };
}
export const readLearningExtras = readProgress;
