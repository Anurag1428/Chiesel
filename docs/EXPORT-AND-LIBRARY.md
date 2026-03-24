# Export & Prompt Library Documentation

## Overview

The Export and Prompt Library features allow users to save, share, and reuse their design analyses. This includes multiple export formats, shareable links, and a comprehensive library system.

## Export Modal

### Features

The Export Modal provides 5 different ways to export or share your analysis:

#### 1. Copy Prompt
- **Action**: Copies the implementation prompt to clipboard
- **Use Case**: Quick copy for pasting into any tool
- **Feedback**: Shows "Copied!" confirmation
- **Shortcut**: Direct clipboard access

#### 2. Open in Cursor
- **Action**: Copies prompt and attempts to launch Cursor IDE
- **Protocol**: Uses `cursor://` URL scheme
- **Fallback**: If protocol not available, just copies prompt
- **Use Case**: Direct integration with Cursor IDE

**How it works:**
```typescript
// Copy prompt
await navigator.clipboard.writeText(prompt);

// Try to open Cursor
window.location.href = "cursor://";
```

#### 3. Open in Bolt
- **Action**: Generates bolt.new URL with prefilled prompt
- **Encoding**: URL-encodes the prompt
- **Opens**: New browser tab
- **Use Case**: Quick prototyping with Bolt

**Generated URL format:**
```
https://bolt.new?prompt=<encoded-prompt>
```

#### 4. Download Project Brief
- **Format**: Markdown (.md)
- **Includes**: Full prompt + embedded images
- **Images**: Base64-encoded data URLs
- **Filename**: `{project-name}-brief.md`

**Markdown structure:**
```markdown
# Implementation Prompt
[Full prompt content]

## Attached Images

### image1.png
![image1.png](data:image/png;base64,...)

### image2.jpg
![image2.jpg](data:image/jpeg;base64,...)
```

#### 5. Shareable Link
- **Action**: Generates unique URL with encoded data
- **Encoding**: Base64-encoded JSON
- **No Server**: All data in URL
- **Persistent**: Works offline

**Link format:**
```
https://yoursite.com/shared/<base64-encoded-data>
```

### Usage

```tsx
import { ExportModal } from "@/components/export-modal";

<ExportModal
  open={isOpen}
  onOpenChange={setIsOpen}
  prompt={generatedPrompt}
  projectName="My Project"
  shareableData={{
    projectName: "My Project",
    analysisData: data,
    componentTree: tree,
    threeDConfig: config,
    timestamp: Date.now(),
  }}
  images={uploadedFiles}
/>
```

## Prompt Library

### Overview

The Prompt Library is a grid-based view of all saved analyses, allowing users to browse, search, and reuse past work.

### Features

#### Grid View
- **Layout**: Responsive grid (1/2/3 columns)
- **Cards**: Thumbnail, name, date, tags
- **Actions**: Reuse and Delete buttons
- **Hover**: Scale effect on thumbnails

#### Search
- **By Name**: Project name search
- **By Tags**: Tech stack filtering
- **Real-time**: Instant filtering
- **Case-insensitive**: Flexible matching

#### Storage
- **Method**: LocalStorage
- **Key**: `designtocode_analyses`
- **Format**: JSON array
- **Limit**: Browser storage limits (~5-10MB)

### Data Structure

```typescript
interface SavedAnalysis {
  id: string;                    // Unique identifier
  projectName: string;           // Display name
  createdAt: Date;              // Creation timestamp
  thumbnail: string;            // Image URL or data URL
  analysisData: AnalysisData;   // Full analysis results
  componentTree: ComponentNode[]; // Component hierarchy
  threeDConfig?: ThreeDConfig;  // Optional 3D settings
  prompt: string;               // Generated prompt
  techTags: string[];           // Technology tags
}
```

### Operations

#### Save Analysis
```typescript
import { saveAnalysis } from "@/lib/storage";

const analysis: SavedAnalysis = {
  id: `analysis-${Date.now()}`,
  projectName: "My Project",
  createdAt: new Date(),
  thumbnail: imageUrl,
  analysisData: data,
  componentTree: tree,
  threeDConfig: config,
  prompt: generatedPrompt,
  techTags: ["Next.js", "Three.js", "Tailwind CSS"],
};

saveAnalysis(analysis);
```

#### Load Analyses
```typescript
import { getAnalyses } from "@/lib/storage";

const analyses = getAnalyses();
// Returns array of SavedAnalysis objects
```

#### Delete Analysis
```typescript
import { deleteAnalysis } from "@/lib/storage";

deleteAnalysis(analysisId);
```

#### Clear All
```typescript
import { clearAllAnalyses } from "@/lib/storage";

clearAllAnalyses();
```

### Reuse Functionality

When a user clicks "Reuse" on an analysis:

1. **Store in Session**: Analysis saved to sessionStorage
2. **Navigate**: Redirect to `/new-analysis?reuse=true`
3. **Load Data**: New Analysis page checks for reuse flag
4. **Pre-fill**: All fields populated with saved data
5. **Edit**: User can modify and re-analyze

**Implementation:**
```typescript
// In Prompt Library
const handleReuse = (analysis: SavedAnalysis) => {
  sessionStorage.setItem("reuseAnalysis", JSON.stringify(analysis));
  router.push("/new-analysis?reuse=true");
};

// In New Analysis page
useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  if (params.get("reuse") === "true") {
    const stored = sessionStorage.getItem("reuseAnalysis");
    if (stored) {
      const analysis = JSON.parse(stored);
      // Pre-fill form with analysis data
      setProjectName(analysis.projectName);
      setComponentNodes(analysis.componentTree);
      // ... etc
    }
  }
}, []);
```

## Shareable Links

### How It Works

Shareable links encode all analysis data in the URL itself, requiring no server storage.

#### Encoding Process

1. **Create Data Object**:
```typescript
const shareableData: ShareableData = {
  projectName: "My Project",
  analysisData: data,
  componentTree: tree,
  threeDConfig: config,
  timestamp: Date.now(),
};
```

2. **Serialize to JSON**:
```typescript
const jsonString = JSON.stringify(shareableData);
```

3. **Encode**:
```typescript
const encoded = btoa(encodeURIComponent(jsonString));
```

4. **Generate URL**:
```typescript
const url = `${window.location.origin}/shared/${encoded}`;
```

#### Decoding Process

1. **Extract from URL**: Get encoded parameter
2. **Decode**: `decodeURIComponent(atob(encoded))`
3. **Parse JSON**: `JSON.parse(decoded)`
4. **Render**: Display analysis data

### Shared Analysis Page

Located at `/shared/[id]`, this page:
- Decodes the URL parameter
- Displays full analysis
- Shows component tree
- Includes 3D configuration
- Provides export options

**Features:**
- Read-only view
- No editing
- Share and download buttons
- Full analysis display
- Error handling for invalid links

## Best Practices

### Storage Management

**LocalStorage Limits:**
- Typical limit: 5-10MB
- Monitor usage
- Implement cleanup
- Warn users when near limit

**Optimization:**
- Compress thumbnails
- Limit stored analyses
- Remove old entries
- Use efficient encoding

### Shareable Links

**URL Length:**
- Keep data minimal
- Compress if needed
- Test in different browsers
- Consider URL length limits (~2000 chars)

**Security:**
- Data is public (in URL)
- Don't include sensitive info
- Validate on decode
- Handle errors gracefully

### User Experience

**Feedback:**
- Show loading states
- Confirm actions
- Display errors clearly
- Provide undo options

**Performance:**
- Lazy load thumbnails
- Paginate large libraries
- Debounce search
- Cache results

## Integration Examples

### Save After Analysis

```tsx
// In New Analysis page
const handleSaveAnalysis = () => {
  const analysis: SavedAnalysis = {
    id: `analysis-${Date.now()}`,
    projectName,
    createdAt: new Date(),
    thumbnail: URL.createObjectURL(files[0]),
    analysisData: mockAnalysisData,
    componentTree: componentNodes,
    threeDConfig: threeDConfig,
    prompt: generatedPrompt,
    techTags: extractTechTags(),
  };

  saveAnalysis(analysis);
  setSaved(true);
};
```

### Export with Images

```tsx
// Convert files to data URLs
const imageData = await Promise.all(
  files.map(async (file) => ({
    name: file.name,
    dataUrl: await imageToDataUrl(file),
  }))
);

// Download with embedded images
downloadMarkdown(
  `${projectName}-brief`,
  prompt,
  imageData
);
```

### Search Implementation

```tsx
const filterAnalyses = () => {
  const query = searchQuery.toLowerCase();
  const filtered = analyses.filter(
    (analysis) =>
      analysis.projectName.toLowerCase().includes(query) ||
      analysis.techTags.some((tag) => 
        tag.toLowerCase().includes(query)
      )
  );
  setFilteredAnalyses(filtered);
};
```

## Troubleshooting

### LocalStorage Full

**Symptoms:**
- Save fails silently
- QuotaExceededError

**Solutions:**
- Clear old analyses
- Reduce thumbnail size
- Implement pagination
- Use IndexedDB for large data

### Shareable Link Too Long

**Symptoms:**
- URL truncated
- 414 URI Too Long error

**Solutions:**
- Compress data
- Remove unnecessary fields
- Use shorter encoding
- Implement server-side storage

### Images Not Embedding

**Symptoms:**
- Broken image links in markdown
- Large file sizes

**Solutions:**
- Verify base64 encoding
- Check image format support
- Compress images
- Limit image count

### Reuse Not Working

**Symptoms:**
- Data not pre-filled
- SessionStorage empty

**Solutions:**
- Check browser settings
- Verify navigation flow
- Test sessionStorage access
- Handle edge cases

## Future Enhancements

### Cloud Sync
- [ ] User accounts
- [ ] Cloud storage
- [ ] Cross-device sync
- [ ] Collaboration features

### Advanced Search
- [ ] Filter by date range
- [ ] Sort options
- [ ] Tag management
- [ ] Favorites/starred

### Export Formats
- [ ] PDF export
- [ ] Figma plugin
- [ ] VS Code extension
- [ ] API endpoints

### Library Features
- [ ] Folders/categories
- [ ] Bulk operations
- [ ] Import/export library
- [ ] Version history

## API Reference

### Storage Functions

```typescript
// Save analysis
saveAnalysis(analysis: SavedAnalysis): void

// Get all analyses
getAnalyses(): SavedAnalysis[]

// Get by ID
getAnalysisById(id: string): SavedAnalysis | null

// Delete analysis
deleteAnalysis(id: string): void

// Clear all
clearAllAnalyses(): void
```

### Export Functions

```typescript
// Copy to clipboard
copyToClipboard(text: string): Promise<void>

// Open in Cursor
openInCursor(prompt: string): void

// Open in Bolt
openInBolt(prompt: string): void

// Download markdown
downloadMarkdown(
  filename: string,
  content: string,
  images?: { name: string; dataUrl: string }[]
): void

// Generate shareable link
generateShareableLink(data: ShareableData): string

// Decode shareable link
decodeShareableLink(encoded: string): ShareableData | null

// Image to data URL
imageToDataUrl(file: File): Promise<string>
```

## Security Considerations

### Data Privacy
- All data stored locally
- No server transmission
- User controls deletion
- Clear data on logout

### URL Encoding
- Data visible in URL
- No encryption
- Public by default
- Validate on decode

### XSS Prevention
- Sanitize user input
- Escape HTML
- Validate JSON
- Handle errors safely
