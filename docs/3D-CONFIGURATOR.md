# 3D Configurator Documentation

## Overview

The 3D Configurator is an advanced panel that appears when the AI detects potential 3D elements in the design. It provides a game-engine-style interface for fine-tuning Three.js parameters.

## When It Appears

The configurator automatically appears in the analysis results when:
- `analysisData.has3D === true`
- The design contains WebGL, Three.js, or 3D visual elements

## Interface Design

### Visual Style
- **Technical but Approachable**: Inspired by Unity/Unreal Engine inspectors
- **Color Scheme**: Purple/blue gradient header with dark theme
- **Tabbed Navigation**: 5 sections with icons
- **Real-time Feedback**: Values update as you adjust sliders

### Header
- Icon badge with lightning bolt
- Title: "3D Scene Configurator"
- Subtitle: "Fine-tune Three.js parameters"

## Configuration Sections

### 1. Material Properties

Controls the physical appearance of 3D objects using PBR (Physically Based Rendering).

**Transmission** (0-1)
- Controls glass-like transparency
- 0 = Completely opaque
- 1 = Fully transparent
- Use for: Glass, water, transparent materials

**Roughness** (0-1)
- Surface finish quality
- 0 = Smooth, mirror-like reflections
- 1 = Rough, matte finish
- Use for: Controlling glossiness

**Metalness** (0-1)
- Metallic appearance
- 0 = Dielectric (plastic, wood, stone)
- 1 = Metallic (gold, silver, copper)
- Use for: Metal vs non-metal materials

**Clearcoat** (0-1)
- Additional clear coating layer
- Creates car paint effect
- 0 = No clearcoat
- 1 = Full clearcoat layer
- Use for: Automotive finishes, lacquered surfaces

### 2. Geometry Settings

**Type** (Dropdown)
- Sphere: Round object
- Box: Cube/rectangular prism
- Torus: Donut shape
- Cylinder: Tube shape
- Cone: Pointed shape

**Segments** (8-128)
- Mesh detail level
- 8-32: Low detail (better performance)
- 32-64: Medium detail (balanced)
- 64-128: High detail (smooth but expensive)
- Higher values = smoother curves but more polygons

### 3. Lighting Configuration

**Ambient Intensity** (0-2)
- Global ambient light brightness
- 0 = No ambient light (only direct lighting)
- 0.5 = Moderate ambient light
- 2 = Very bright ambient light
- Use for: Overall scene brightness

**Directional Position** (X/Y/Z)
- Position of the main directional light
- Simulates sun/moon lighting
- Default: (5, 5, 5)
- Use for: Main light source direction

**Point Light Color** (Hex Color)
- Color of the point light source
- Color picker + text input
- Default: #ffffff (white)
- Use for: Accent lighting, colored effects

### 4. Camera Controls

**Field of View** (20-100°)
- Camera viewing angle
- 20-40°: Telephoto (zoomed in)
- 50-75°: Normal (human eye)
- 80-100°: Wide angle (fisheye effect)
- Default: 75°

**Camera Position** (X/Y/Z)
- Camera location in 3D space
- Default: (0, 0, 5)
- Adjust to change viewing angle

**Look-At Target** (X/Y/Z)
- Point the camera focuses on
- Default: (0, 0, 0) - origin
- Use for: Directing camera attention

### 5. Animation Settings

**Auto-Rotate Speed** (0-5)
- Automatic rotation speed
- 0 = No rotation
- 1 = Slow rotation
- 5 = Fast rotation
- Use for: Showcase animations

**Enable Damping** (Toggle)
- Smooth camera movement with inertia
- ON = Smooth, natural movement
- OFF = Instant, direct control
- Recommended: ON for better UX

**Damping Factor** (0.01-0.2)
- Only visible when damping is enabled
- Controls inertia strength
- 0.01 = Very smooth, lots of inertia
- 0.2 = Quick response, less inertia
- Default: 0.05

## Generated Code

The configurator generates two code formats:

### 1. Vanilla Three.js

```javascript
// Material
const material = new THREE.MeshPhysicalMaterial({
  transmission: 0.5,
  roughness: 0.3,
  metalness: 0.8,
  clearcoat: 0.5,
});

// Geometry
const geometry = new THREE.SphereGeometry(1, 32, 32);

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 5, 5);

// Camera
const camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
camera.position.set(0, 0, 5);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.autoRotate = true;
controls.autoRotateSpeed = 1;
```

### 2. React Three Fiber

```tsx
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

export function Scene3D() {
  return (
    <Canvas camera={{ fov: 75, position: [0, 0, 5] }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} />
      
      <mesh>
        <sphereGeometry args={[1, 32, 32]} />
        <meshPhysicalMaterial
          transmission={0.5}
          roughness={0.3}
          metalness={0.8}
          clearcoat={0.5}
        />
      </mesh>
      
      <OrbitControls
        enableDamping
        dampingFactor={0.05}
        autoRotate
        autoRotateSpeed={1}
      />
    </Canvas>
  );
}
```

## Real-Time Updates

When any value changes:
1. Configuration state updates immediately
2. `onConfigChange` callback fires
3. Prompt regenerates with new values
4. Monaco Editor updates with new code
5. User sees changes instantly

## Integration

### In New Analysis Page

```tsx
{mockAnalysisData.has3D && (
  <div className="mt-8">
    <h3 className="text-xl font-semibold mb-4">
      3D Scene Configuration
    </h3>
    <ThreeDConfigurator
      onConfigChange={handleThreeDConfigChange}
      initialConfig={threeDConfig}
    />
  </div>
)}
```

### Prompt Generation

```typescript
const prompt = generateImplementationPrompt({
  projectName,
  analysisData,
  componentTree,
  threeDConfig: analysisData.has3D ? threeDConfig : undefined,
});
```

## Best Practices

### Material Settings
- **Glass**: High transmission (0.8-1.0), low roughness (0.1-0.3)
- **Metal**: High metalness (0.8-1.0), variable roughness
- **Plastic**: Low metalness (0-0.2), medium roughness (0.4-0.6)
- **Car Paint**: Medium clearcoat (0.5-0.8), low roughness

### Performance
- Keep segments low (32-64) for real-time applications
- Use higher segments (64-128) for static renders
- Balance quality vs performance based on use case

### Lighting
- Start with ambient intensity around 0.5
- Use directional light for main shadows
- Add point lights for accents and highlights

### Camera
- FOV 50-75° for most applications
- Position camera at (0, 0, 5) for front view
- Adjust look-at to focus on specific objects

### Animation
- Enable damping for better user experience
- Use auto-rotate for product showcases
- Keep rotation speed moderate (1-2) for comfort

## Technical Details

### State Management
- Uses React `useState` for configuration
- Debounced updates for performance
- Immutable state updates

### Components Used
- shadcn/ui Slider
- shadcn/ui Select
- shadcn/ui Input
- shadcn/ui Button
- shadcn/ui Label

### Styling
- Tailwind CSS utilities
- Custom gradient header
- Responsive grid layouts
- Smooth transitions

## Future Enhancements

- [ ] Live 3D preview with actual Three.js render
- [ ] Preset configurations (glass, metal, plastic)
- [ ] Import/export configuration JSON
- [ ] Texture upload and configuration
- [ ] Environment map settings
- [ ] Shadow configuration
- [ ] Post-processing effects
- [ ] Animation timeline editor
