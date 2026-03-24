import { SavedAnalysis } from "@/types/saved-analysis";

const STORAGE_KEY = "designtocode_analyses";

export function saveAnalysis(analysis: SavedAnalysis): void {
  try {
    const existing = getAnalyses();
    existing.unshift(analysis);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
  } catch (error) {
    console.error("Failed to save analysis:", error);
  }
}

export function getAnalyses(): SavedAnalysis[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    
    const analyses = JSON.parse(data);
    // Convert date strings back to Date objects
    return analyses.map((a: any) => ({
      ...a,
      createdAt: new Date(a.createdAt),
    }));
  } catch (error) {
    console.error("Failed to load analyses:", error);
    return [];
  }
}

export function getAnalysisById(id: string): SavedAnalysis | null {
  const analyses = getAnalyses();
  return analyses.find((a) => a.id === id) || null;
}

export function deleteAnalysis(id: string): void {
  try {
    const existing = getAnalyses();
    const filtered = existing.filter((a) => a.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error("Failed to delete analysis:", error);
  }
}

export function clearAllAnalyses(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Failed to clear analyses:", error);
  }
}
