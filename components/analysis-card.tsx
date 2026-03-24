"use client";

import { SavedAnalysis } from "@/types/saved-analysis";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Trash2, RotateCcw } from "lucide-react";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";

interface AnalysisCardProps {
  analysis: SavedAnalysis;
  onReuse: (analysis: SavedAnalysis) => void;
  onDelete: (id: string) => void;
}

export function AnalysisCard({
  analysis,
  onReuse,
  onDelete,
}: AnalysisCardProps) {
  const formattedDate = formatDistanceToNow(analysis.createdAt, {
    addSuffix: true,
  });

  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-shadow">
      {/* Thumbnail */}
      <div className="relative aspect-video bg-muted overflow-hidden">
        <Image
          src={analysis.thumbnail}
          alt={analysis.projectName}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      <CardContent className="p-4 space-y-3">
        {/* Project Name */}
        <h3 className="font-semibold text-lg line-clamp-1">
          {analysis.projectName}
        </h3>

        {/* Date */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="w-4 h-4" />
          <span>{formattedDate}</span>
        </div>

        {/* Tech Tags */}
        <div className="flex flex-wrap gap-2">
          {analysis.techTags.slice(0, 4).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
          {analysis.techTags.length > 4 && (
            <Badge variant="outline" className="text-xs">
              +{analysis.techTags.length - 4}
            </Badge>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex gap-2">
        <Button
          onClick={() => onReuse(analysis)}
          className="flex-1"
          size="sm"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Reuse
        </Button>
        <Button
          onClick={() => onDelete(analysis.id)}
          variant="outline"
          size="sm"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
