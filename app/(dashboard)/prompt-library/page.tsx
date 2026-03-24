"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { SavedAnalysis } from "@/types/saved-analysis";
import { getAnalyses, deleteAnalysis, clearAllAnalyses } from "@/lib/storage";
import { AnalysisCard } from "@/components/analysis-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Trash2, FolderOpen } from "lucide-react";

export default function PromptLibraryPage() {
  const router = useRouter();
  const [analyses, setAnalyses] = useState<SavedAnalysis[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredAnalyses, setFilteredAnalyses] = useState<SavedAnalysis[]>([]);

  useEffect(() => {
    loadAnalyses();
  }, []);

  useEffect(() => {
    filterAnalyses();
  }, [searchQuery, analyses]);

  const loadAnalyses = () => {
    const saved = getAnalyses();
    setAnalyses(saved);
  };

  const filterAnalyses = () => {
    if (!searchQuery.trim()) {
      setFilteredAnalyses(analyses);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = analyses.filter(
      (analysis) =>
        analysis.projectName.toLowerCase().includes(query) ||
        analysis.techTags.some((tag) => tag.toLowerCase().includes(query))
    );
    setFilteredAnalyses(filtered);
  };

  const handleReuse = (analysis: SavedAnalysis) => {
    // Store the analysis to reuse in sessionStorage
    sessionStorage.setItem("reuseAnalysis", JSON.stringify(analysis));
    // Navigate to new analysis page
    router.push("/new-analysis?reuse=true");
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this analysis?")) {
      deleteAnalysis(id);
      loadAnalyses();
    }
  };

  const handleClearAll = () => {
    if (
      confirm(
        "Are you sure you want to delete all saved analyses? This cannot be undone."
      )
    ) {
      clearAllAnalyses();
      loadAnalyses();
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-2">
          Prompt Library
        </h2>
        <p className="text-muted-foreground">
          Browse and manage your saved implementation prompts
        </p>
      </div>

      {/* Search and Actions */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by project name or tech tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        {analyses.length > 0 && (
          <Button variant="outline" onClick={handleClearAll}>
            <Trash2 className="w-4 h-4 mr-2" />
            Clear All
          </Button>
        )}
      </div>

      {/* Grid View */}
      {filteredAnalyses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAnalyses.map((analysis) => (
            <AnalysisCard
              key={analysis.id}
              analysis={analysis}
              onReuse={handleReuse}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : analyses.length > 0 ? (
        <div className="text-center py-16">
          <Search className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">No results found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search query
          </p>
        </div>
      ) : (
        <div className="text-center py-16">
          <FolderOpen className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">No saved analyses yet</h3>
          <p className="text-muted-foreground mb-6">
            Complete an analysis to save it to your library
          </p>
          <Button onClick={() => router.push("/new-analysis")}>
            Create New Analysis
          </Button>
        </div>
      )}
    </div>
  );
}
