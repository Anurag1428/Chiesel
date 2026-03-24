"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  ExternalLink,
  Download,
  Share2,
  Check,
  Copy,
  Zap,
} from "lucide-react";
import {
  openInCursor,
  openInBolt,
  downloadMarkdown,
  generateShareableLink,
  copyToClipboard,
} from "@/lib/export-utils";
import { ShareableData } from "@/types/saved-analysis";

interface ExportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  prompt: string;
  projectName: string;
  shareableData: ShareableData;
  images?: File[];
}

export function ExportModal({
  open,
  onOpenChange,
  prompt,
  projectName,
  shareableData,
  images = [],
}: ExportModalProps) {
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [shareableLink, setShareableLink] = useState<string>("");

  const handleCopyPrompt = async () => {
    await copyToClipboard(prompt);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  const handleOpenInCursor = () => {
    openInCursor(prompt);
  };

  const handleOpenInBolt = () => {
    openInBolt(prompt);
  };

  const handleDownloadBrief = async () => {
    // Convert images to data URLs if provided
    const imageData = await Promise.all(
      images.map(async (file) => ({
        name: file.name,
        dataUrl: await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        }),
      }))
    );

    downloadMarkdown(
      `${projectName.toLowerCase().replace(/\s+/g, "-")}-brief`,
      prompt,
      imageData
    );
  };

  const handleGenerateLink = () => {
    const link = generateShareableLink(shareableData);
    setShareableLink(link);
  };

  const handleCopyLink = async () => {
    await copyToClipboard(shareableLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">Export Analysis</DialogTitle>
          <DialogDescription>
            Choose how you want to export or share your analysis
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Copy Prompt */}
          <div className="bg-card border border-border rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Copy className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">Copy Prompt</h3>
                <p className="text-sm text-muted-foreground">
                  Copy the implementation prompt to clipboard
                </p>
              </div>
              <Button onClick={handleCopyPrompt} variant="outline">
                {copiedPrompt ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Open in Cursor */}
          <div className="bg-card border border-border rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-600/10 flex items-center justify-center">
                <Zap className="w-5 h-5 text-blue-500" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">Open in Cursor</h3>
                <p className="text-sm text-muted-foreground">
                  Copy prompt and launch Cursor IDE
                </p>
              </div>
              <Button onClick={handleOpenInCursor} variant="outline">
                <ExternalLink className="w-4 h-4 mr-2" />
                Open
              </Button>
            </div>
          </div>

          {/* Open in Bolt */}
          <div className="bg-card border border-border rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-600/10 flex items-center justify-center">
                <Zap className="w-5 h-5 text-purple-500" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">Open in Bolt</h3>
                <p className="text-sm text-muted-foreground">
                  Generate bolt.new URL with prefilled prompt
                </p>
              </div>
              <Button onClick={handleOpenInBolt} variant="outline">
                <ExternalLink className="w-4 h-4 mr-2" />
                Open
              </Button>
            </div>
          </div>

          {/* Download Project Brief */}
          <div className="bg-card border border-border rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-600/10 flex items-center justify-center">
                <Download className="w-5 h-5 text-green-500" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">Download Project Brief</h3>
                <p className="text-sm text-muted-foreground">
                  Markdown file with embedded images
                </p>
              </div>
              <Button onClick={handleDownloadBrief} variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>
          </div>

          {/* Shareable Link */}
          <div className="bg-card border border-border rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-orange-600/10 flex items-center justify-center">
                <Share2 className="w-5 h-5 text-orange-500" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">Shareable Link</h3>
                <p className="text-sm text-muted-foreground">
                  Generate unique URL with encoded analysis
                </p>
              </div>
              {!shareableLink ? (
                <Button onClick={handleGenerateLink} variant="outline">
                  <Share2 className="w-4 h-4 mr-2" />
                  Generate
                </Button>
              ) : (
                <Button onClick={handleCopyLink} variant="outline">
                  {copiedLink ? (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-2" />
                      Copy Link
                    </>
                  )}
                </Button>
              )}
            </div>
            {shareableLink && (
              <div className="bg-muted rounded p-3">
                <p className="text-xs font-mono break-all text-muted-foreground">
                  {shareableLink}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
