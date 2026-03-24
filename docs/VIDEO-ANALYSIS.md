# Video Analysis Documentation

## Overview

The Video Analysis feature allows users to upload video files, extract frames at key moments, and analyze motion/animation patterns. It uses FFmpeg.wasm for client-side video processing, ensuring privacy and speed.

## Architecture

### Client-Side Processing
All video processing happens in the browser using FFmpeg.wasm:
- No server upload required
- Privacy-friendly (video never leaves the user's device)
- Fast processing with WebAssembly
- Cross-platform compatibility

### Components

1. **VideoFrameExtractor** - Handles FFmpeg.wasm integration and frame extraction
2. **VideoFilmstrip** - Displays extracted frames in a timeline
3. **MotionDetectionView** - Analyzes and displays motion between frames
4. **video-processor.ts** - Core video processing logic

## Features

### 1. Frame Extraction

**Process:**
1. User uploads video file (MP4)
2. FFmpeg.wasm loads (first time only)
3. Video duration is calculated
4. 5 frames are extracted at evenly spaced intervals
5. Frames are converted to PNG images
6. Progress is reported to the UI

**Technical Details:**
```typescript
// Extract frame at specific timestamp
await ffmpeg.exec([
  "-i", "input.mp4",
  "-ss", timestamp.toString(),
  "-vframes", "1",
  "-q:v", "2",
  "output.png"
]);
```

**Frame Spacing:**
- If video is 10 seconds long
- Frames extracted at: 1.67s, 3.33s, 5.00s, 6.67s, 8.33s
- Formula: `interval = duration / (frameCount + 1)`

### 2. Filmstrip Timeline

**Visual Design:**
- Film sprocket holes on sides (authentic film look)
- 48x32 frame thumbnails
- Timestamp display (MM:SS.MS format)
- Active frame highlighting with ring
- Hover effects with play icon overlay

**Interaction:**
- Click any frame to select it
- Selected frame shows "ACTIVE" badge
- Timeline bar shows progress
- Smooth transitions and animations

**Features:**
- Horizontal scroll for many frames
- Responsive design
- Keyboard navigation (future)
- Frame preview on hover (future)

### 3. Motion Detection

**Current Implementation (MVP):**
Motion detection is currently simulated with mock data. The UI is fully functional and ready for CV analysis integration.

**Simulated Detections:**
- Position changes (X/Y coordinates)
- Scale transformations (size changes)
- Opacity transitions (fade effects)
- Rotation detection (angle changes)

**Future CV Integration:**
Will use computer vision algorithms to:
- Optical flow analysis
- Feature point tracking
- Edge detection
- Color histogram comparison
- Object detection and tracking

### 4. Visual Diff

**How It Works:**
- Displays previous and current frame side-by-side
- Applies blend mode overlay to highlight differences
- Toggle on/off for comparison
- Color-coded intensity

**Use Cases:**
- Identify moving elements
- Detect subtle changes
- Verify animation smoothness
- Find frame-to-frame differences

### 5. Animation Parameters

**Duration Input:**
- Range: 0-10 seconds
- Step: 0.1 seconds
- Default: 0.8 seconds
- User can adjust based on visual analysis

**Easing Selection:**
- Spring: Bouncy, natural motion
- Bounce: Exaggerated spring effect
- Linear: Constant speed
- Ease In: Slow start, fast end
- Ease Out: Fast start, slow end
- Ease In-Out: Slow start and end

**Motion Intensity:**
- Low: Subtle movements
- Medium: Moderate motion
- High: Dramatic changes

**Generated CSS:**
```css
animation: motion 0.8s spring;
```

## Usage Flow

### Basic Workflow

1. **Upload Video**
   - Navigate to Video Analysis page
   - Drag & drop or click to upload MP4 file
   - Wait for FFmpeg.wasm to load (first time)

2. **Frame Extraction**
   - Automatic extraction begins
   - Progress bar shows completion
   - 5 frames extracted evenly

3. **Frame Selection**
   - Filmstrip displays all frames
   - Click any frame to analyze
   - View timestamp and position

4. **Motion Analysis**
   - View detected changes
   - Compare with previous frame
   - Toggle visual diff overlay

5. **Parameter Adjustment**
   - Adjust animation duration
   - Select easing function
   - Set motion intensity
   - View generated CSS

6. **Export/Use**
   - Parameters included in prompt generation
   - CSS code ready to copy
   - Integration with main analysis flow

## Technical Implementation

### FFmpeg.wasm Setup

```typescript
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";

// Load FFmpeg (singleton pattern)
const ffmpeg = new FFmpeg();
await ffmpeg.load({
  coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
  wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, "application/wasm"),
});
```

### Frame Extraction

```typescript
// Write video to virtual filesystem
await ffmpeg.writeFile("input.mp4", await fetchFile(videoFile));

// Extract frame at timestamp
await ffmpeg.exec([
  "-i", "input.mp4",
  "-ss", timestamp.toString(),
  "-vframes", "1",
  "-q:v", "2",
  "frame.png"
]);

// Read extracted frame
const data = await ffmpeg.readFile("frame.png");
const blob = new Blob([data], { type: "image/png" });
const imageUrl = URL.createObjectURL(blob);
```

### Video Duration

```typescript
function getVideoDuration(videoFile: File): Promise<number> {
  return new Promise((resolve) => {
    const video = document.createElement("video");
    video.preload = "metadata";
    video.onloadedmetadata = () => {
      resolve(video.duration);
    };
    video.src = URL.createObjectURL(videoFile);
  });
}
```

## Data Structures

### VideoFrame

```typescript
interface VideoFrame {
  id: string;           // Unique identifier
  timestamp: number;    // Time in video (seconds)
  imageUrl: string;     // Blob URL for image
  selected: boolean;    // Currently selected
}
```

### MotionAnalysis

```typescript
interface MotionAnalysis {
  duration: number;     // Animation duration (seconds)
  easing: string;       // Easing function name
  intensity: string;    // low/medium/high
  detectedChanges: string[]; // List of detected changes
}
```

## Performance Considerations

### Memory Management
- Clean up blob URLs when done: `URL.revokeObjectURL(url)`
- Delete FFmpeg virtual files after use
- Limit frame count to prevent memory issues
- Use efficient image formats (PNG with compression)

### Loading Time
- FFmpeg.wasm loads once (cached)
- Initial load: ~2-3 seconds
- Subsequent uses: instant
- Frame extraction: ~1-2 seconds per frame

### Optimization Tips
- Extract fewer frames for long videos
- Use lower quality settings for preview
- Implement lazy loading for frames
- Cache extracted frames in IndexedDB

## Future Enhancements

### Computer Vision Integration
- [ ] Real optical flow analysis
- [ ] Feature point tracking (SIFT/SURF)
- [ ] Object detection with TensorFlow.js
- [ ] Motion vector calculation
- [ ] Automatic easing detection

### Advanced Features
- [ ] Frame-by-frame scrubbing
- [ ] Custom frame selection
- [ ] Multiple video comparison
- [ ] Animation timeline editor
- [ ] Export as GIF/WebM
- [ ] Slow motion analysis
- [ ] Frame interpolation

### UI Improvements
- [ ] Keyboard shortcuts
- [ ] Frame preview on hover
- [ ] Zoom controls
- [ ] Annotation tools
- [ ] Side-by-side comparison mode
- [ ] Onion skinning effect

### Integration
- [ ] Add to main analysis workflow
- [ ] Include in prompt generation
- [ ] Export animation code snippets
- [ ] GSAP/Framer Motion code generation
- [ ] CSS animation keyframes

## Troubleshooting

### FFmpeg.wasm Not Loading
- Check internet connection (CDN required)
- Verify browser supports WebAssembly
- Clear browser cache
- Try different browser

### Frame Extraction Fails
- Ensure video format is supported (MP4 recommended)
- Check video file isn't corrupted
- Verify file size isn't too large (>100MB may be slow)
- Try re-encoding video with standard codec

### Performance Issues
- Reduce frame count
- Use shorter video clips
- Close other browser tabs
- Increase browser memory limit

### Visual Diff Not Working
- Ensure frames are sequential
- Check if frames are identical
- Verify blend mode support in browser
- Try toggling diff on/off

## Browser Compatibility

### Supported Browsers
- Chrome 90+ ✅
- Firefox 88+ ✅
- Safari 15+ ✅
- Edge 90+ ✅

### Requirements
- WebAssembly support
- SharedArrayBuffer (for threading)
- Modern JavaScript (ES2020+)
- Canvas API
- Blob/File API

## Best Practices

### Video Preparation
- Use MP4 format (H.264 codec)
- Keep videos under 50MB for best performance
- Use 1080p or lower resolution
- Trim to relevant sections only

### Frame Analysis
- Extract 5-10 frames for most videos
- Focus on key animation moments
- Compare consecutive frames for motion
- Adjust parameters based on visual inspection

### Parameter Selection
- Start with default values
- Adjust duration based on frame spacing
- Choose easing that matches motion style
- Set intensity based on movement amount

## Code Examples

### Basic Usage

```tsx
import { VideoFrameExtractor } from "@/components/video-frame-extractor";
import { VideoFilmstrip } from "@/components/video-filmstrip";
import { MotionDetectionView } from "@/components/motion-detection-view";

function VideoAnalysis() {
  const [frames, setFrames] = useState<VideoFrame[]>([]);
  const [selectedId, setSelectedId] = useState("");

  return (
    <>
      <VideoFrameExtractor
        videoFile={videoFile}
        onFramesExtracted={setFrames}
      />
      
      <VideoFilmstrip
        frames={frames}
        selectedFrameId={selectedId}
        onFrameSelect={setSelectedId}
      />
      
      <MotionDetectionView
        frames={frames}
        selectedFrame={frames.find(f => f.id === selectedId)}
        motionAnalysis={analysis}
        onAnalysisUpdate={setAnalysis}
      />
    </>
  );
}
```

### Custom Frame Extraction

```typescript
import { extractFrames } from "@/lib/video-processor";

// Extract 10 frames with progress callback
const frames = await extractFrames(
  videoFile,
  10,
  (progress) => console.log(`${progress}% complete`)
);
```

## Resources

- [FFmpeg.wasm Documentation](https://ffmpegwasm.netlify.app/)
- [WebAssembly Guide](https://webassembly.org/)
- [Video Processing Best Practices](https://web.dev/fast/)
- [Computer Vision with TensorFlow.js](https://www.tensorflow.org/js)
