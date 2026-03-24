import { ShareableData } from "@/types/saved-analysis";

export function copyToClipboard(text: string): Promise<void> {
  return navigator.clipboard.writeText(text);
}

export function openInCursor(prompt: string): void {
  // Copy prompt to clipboard
  copyToClipboard(prompt);

  // Try to open Cursor protocol
  try {
    window.location.href = "cursor://";
  } catch (error) {
    console.log("Cursor protocol not available");
  }
}

export function openInBolt(prompt: string): void {
  // Encode prompt for URL
  const encodedPrompt = encodeURIComponent(prompt);
  
  // Generate bolt.new URL with prefilled prompt
  const boltUrl = `https://bolt.new?prompt=${encodedPrompt}`;
  
  // Open in new tab
  window.open(boltUrl, "_blank");
}

export function downloadMarkdown(
  filename: string,
  content: string,
  images?: { name: string; dataUrl: string }[]
): void {
  let markdown = content;

  // Embed images as base64 if provided
  if (images && images.length > 0) {
    markdown += "\n\n## Attached Images\n\n";
    images.forEach((img) => {
      markdown += `### ${img.name}\n\n`;
      markdown += `![${img.name}](${img.dataUrl})\n\n`;
    });
  }

  const blob = new Blob([markdown], { type: "text/markdown" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${filename}.md`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function generateShareableLink(data: ShareableData): string {
  // Compress and encode data
  const jsonString = JSON.stringify(data);
  const encoded = btoa(encodeURIComponent(jsonString));
  
  // Generate URL with encoded data
  const baseUrl = window.location.origin;
  return `${baseUrl}/shared/${encoded}`;
}

export function decodeShareableLink(encoded: string): ShareableData | null {
  try {
    const decoded = decodeURIComponent(atob(encoded));
    return JSON.parse(decoded);
  } catch (error) {
    console.error("Failed to decode shareable link:", error);
    return null;
  }
}

export async function imageToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
