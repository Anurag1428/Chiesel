"use client";

import { useState } from "react";
import { ThreeDConfig, defaultThreeDConfig } from "@/types/three-config";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Box, Lightbulb, Camera, Zap, RotateCw } from "lucide-react";
import { cn } from "@/lib/utils";

interface ThreeDConfiguratorProps {
  onConfigChange: (config: ThreeDConfig) => void;
  initialConfig?: ThreeDConfig;
}

export function ThreeDConfigurator({
  onConfigChange,
  initialConfig = defaultThreeDConfig,
}: ThreeDConfiguratorProps) {
  const [config, setConfig] = useState<ThreeDConfig>(initialConfig);
  const [activeSection, setActiveSection] = useState<string>("material");

  const updateConfig = (updates: Partial<ThreeDConfig>) => {
    const newConfig = { ...config, ...updates };
    setConfig(newConfig);
    onConfigChange(newConfig);
  };

  const sections = [
    { id: "material", label: "Material", icon: Box },
    { id: "geometry", label: "Geometry", icon: Box },
    { id: "lighting", label: "Lighting", icon: Lightbulb },
    { id: "camera", label: "Camera", icon: Camera },
    { id: "animation", label: "Animation", icon: RotateCw },
  ];

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600/10 to-blue-600/10 border-b border-border p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-purple-600/20 flex items-center justify-center">
            <Zap className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">3D Scene Configurator</h3>
            <p className="text-sm text-muted-foreground">
              Fine-tune Three.js parameters
            </p>
          </div>
        </div>
      </div>

      {/* Section Tabs */}
      <div className="flex border-b border-border bg-muted/30">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-3 px-4 text-sm font-medium transition-colors border-b-2",
                activeSection === section.id
                  ? "border-primary text-foreground bg-background"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{section.label}</span>
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="p-6 space-y-6 max-h-[600px] overflow-y-auto">
        {/* Material Section */}
        {activeSection === "material" && (
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Transmission</Label>
                <span className="text-xs text-muted-foreground font-mono">
                  {config.material.transmission.toFixed(2)}
                </span>
              </div>
              <Slider
                value={[config.material.transmission]}
                onValueChange={([value]) =>
                  updateConfig({
                    material: { ...config.material, transmission: value },
                  })
                }
                min={0}
                max={1}
                step={0.01}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">
                Glass-like transparency (0 = opaque, 1 = transparent)
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Roughness</Label>
                <span className="text-xs text-muted-foreground font-mono">
                  {config.material.roughness.toFixed(2)}
                </span>
              </div>
              <Slider
                value={[config.material.roughness]}
                onValueChange={([value]) =>
                  updateConfig({
                    material: { ...config.material, roughness: value },
                  })
                }
                min={0}
                max={1}
                step={0.01}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">
                Surface roughness (0 = smooth/reflective, 1 = rough/matte)
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Metalness</Label>
                <span className="text-xs text-muted-foreground font-mono">
                  {config.material.metalness.toFixed(2)}
                </span>
              </div>
              <Slider
                value={[config.material.metalness]}
                onValueChange={([value]) =>
                  updateConfig({
                    material: { ...config.material, metalness: value },
                  })
                }
                min={0}
                max={1}
                step={0.01}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">
                Metallic appearance (0 = dielectric, 1 = metallic)
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Clearcoat</Label>
                <span className="text-xs text-muted-foreground font-mono">
                  {config.material.clearcoat.toFixed(2)}
                </span>
              </div>
              <Slider
                value={[config.material.clearcoat]}
                onValueChange={([value]) =>
                  updateConfig({
                    material: { ...config.material, clearcoat: value },
                  })
                }
                min={0}
                max={1}
                step={0.01}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">
                Clear coating layer (car paint effect)
              </p>
            </div>
          </div>
        )}

        {/* Geometry Section */}
        {activeSection === "geometry" && (
          <div className="space-y-6">
            <div className="space-y-3">
              <Label className="text-sm font-medium">Geometry Type</Label>
              <Select
                value={config.geometry.type}
                onValueChange={(value: any) =>
                  updateConfig({
                    geometry: { ...config.geometry, type: value },
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sphere">Sphere</SelectItem>
                  <SelectItem value="box">Box</SelectItem>
                  <SelectItem value="torus">Torus</SelectItem>
                  <SelectItem value="cylinder">Cylinder</SelectItem>
                  <SelectItem value="cone">Cone</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Base geometry shape for the 3D object
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Segments</Label>
                <span className="text-xs text-muted-foreground font-mono">
                  {config.geometry.segments}
                </span>
              </div>
              <Slider
                value={[config.geometry.segments]}
                onValueChange={([value]) =>
                  updateConfig({
                    geometry: { ...config.geometry, segments: value },
                  })
                }
                min={8}
                max={128}
                step={4}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">
                Mesh detail level (higher = smoother but more expensive)
              </p>
            </div>
          </div>
        )}

        {/* Lighting Section */}
        {activeSection === "lighting" && (
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">
                  Ambient Intensity
                </Label>
                <span className="text-xs text-muted-foreground font-mono">
                  {config.lighting.ambientIntensity.toFixed(2)}
                </span>
              </div>
              <Slider
                value={[config.lighting.ambientIntensity]}
                onValueChange={([value]) =>
                  updateConfig({
                    lighting: { ...config.lighting, ambientIntensity: value },
                  })
                }
                min={0}
                max={2}
                step={0.1}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">
                Global ambient light brightness
              </p>
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-medium">
                Directional Light Position
              </Label>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <Label className="text-xs text-muted-foreground">X</Label>
                  <Input
                    type="number"
                    value={config.lighting.directionalPosition.x}
                    onChange={(e) =>
                      updateConfig({
                        lighting: {
                          ...config.lighting,
                          directionalPosition: {
                            ...config.lighting.directionalPosition,
                            x: parseFloat(e.target.value) || 0,
                          },
                        },
                      })
                    }
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Y</Label>
                  <Input
                    type="number"
                    value={config.lighting.directionalPosition.y}
                    onChange={(e) =>
                      updateConfig({
                        lighting: {
                          ...config.lighting,
                          directionalPosition: {
                            ...config.lighting.directionalPosition,
                            y: parseFloat(e.target.value) || 0,
                          },
                        },
                      })
                    }
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Z</Label>
                  <Input
                    type="number"
                    value={config.lighting.directionalPosition.z}
                    onChange={(e) =>
                      updateConfig({
                        lighting: {
                          ...config.lighting,
                          directionalPosition: {
                            ...config.lighting.directionalPosition,
                            z: parseFloat(e.target.value) || 0,
                          },
                        },
                      })
                    }
                    className="mt-1"
                  />
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Position of the main directional light
              </p>
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-medium">Point Light Color</Label>
              <div className="flex gap-3">
                <Input
                  type="color"
                  value={config.lighting.pointLightColor}
                  onChange={(e) =>
                    updateConfig({
                      lighting: {
                        ...config.lighting,
                        pointLightColor: e.target.value,
                      },
                    })
                  }
                  className="w-20 h-10"
                />
                <Input
                  type="text"
                  value={config.lighting.pointLightColor}
                  onChange={(e) =>
                    updateConfig({
                      lighting: {
                        ...config.lighting,
                        pointLightColor: e.target.value,
                      },
                    })
                  }
                  className="flex-1 font-mono"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Color of the point light source
              </p>
            </div>
          </div>
        )}

        {/* Camera Section */}
        {activeSection === "camera" && (
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Field of View</Label>
                <span className="text-xs text-muted-foreground font-mono">
                  {config.camera.fov}°
                </span>
              </div>
              <Slider
                value={[config.camera.fov]}
                onValueChange={([value]) =>
                  updateConfig({
                    camera: { ...config.camera, fov: value },
                  })
                }
                min={20}
                max={100}
                step={1}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">
                Camera field of view in degrees (lower = zoomed in)
              </p>
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-medium">Camera Position</Label>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <Label className="text-xs text-muted-foreground">X</Label>
                  <Input
                    type="number"
                    value={config.camera.position.x}
                    onChange={(e) =>
                      updateConfig({
                        camera: {
                          ...config.camera,
                          position: {
                            ...config.camera.position,
                            x: parseFloat(e.target.value) || 0,
                          },
                        },
                      })
                    }
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Y</Label>
                  <Input
                    type="number"
                    value={config.camera.position.y}
                    onChange={(e) =>
                      updateConfig({
                        camera: {
                          ...config.camera,
                          position: {
                            ...config.camera.position,
                            y: parseFloat(e.target.value) || 0,
                          },
                        },
                      })
                    }
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Z</Label>
                  <Input
                    type="number"
                    value={config.camera.position.z}
                    onChange={(e) =>
                      updateConfig({
                        camera: {
                          ...config.camera,
                          position: {
                            ...config.camera.position,
                            z: parseFloat(e.target.value) || 0,
                          },
                        },
                      })
                    }
                    className="mt-1"
                  />
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Camera position in 3D space
              </p>
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-medium">Look At Target</Label>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <Label className="text-xs text-muted-foreground">X</Label>
                  <Input
                    type="number"
                    value={config.camera.lookAt.x}
                    onChange={(e) =>
                      updateConfig({
                        camera: {
                          ...config.camera,
                          lookAt: {
                            ...config.camera.lookAt,
                            x: parseFloat(e.target.value) || 0,
                          },
                        },
                      })
                    }
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Y</Label>
                  <Input
                    type="number"
                    value={config.camera.lookAt.y}
                    onChange={(e) =>
                      updateConfig({
                        camera: {
                          ...config.camera,
                          lookAt: {
                            ...config.camera.lookAt,
                            y: parseFloat(e.target.value) || 0,
                          },
                        },
                      })
                    }
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Z</Label>
                  <Input
                    type="number"
                    value={config.camera.lookAt.z}
                    onChange={(e) =>
                      updateConfig({
                        camera: {
                          ...config.camera,
                          lookAt: {
                            ...config.camera.lookAt,
                            z: parseFloat(e.target.value) || 0,
                          },
                        },
                      })
                    }
                    className="mt-1"
                  />
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Point the camera is looking at
              </p>
            </div>
          </div>
        )}

        {/* Animation Section */}
        {activeSection === "animation" && (
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">
                  Auto-Rotate Speed
                </Label>
                <span className="text-xs text-muted-foreground font-mono">
                  {config.animation.autoRotateSpeed.toFixed(2)}
                </span>
              </div>
              <Slider
                value={[config.animation.autoRotateSpeed]}
                onValueChange={([value]) =>
                  updateConfig({
                    animation: { ...config.animation, autoRotateSpeed: value },
                  })
                }
                min={0}
                max={5}
                step={0.1}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">
                Rotation speed (0 = no rotation, higher = faster)
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Enable Damping</Label>
                <Button
                  variant={
                    config.animation.enableDamping ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() =>
                    updateConfig({
                      animation: {
                        ...config.animation,
                        enableDamping: !config.animation.enableDamping,
                      },
                    })
                  }
                >
                  {config.animation.enableDamping ? "ON" : "OFF"}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Smooth camera movement with inertia
              </p>
            </div>

            {config.animation.enableDamping && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">Damping Factor</Label>
                  <span className="text-xs text-muted-foreground font-mono">
                    {config.animation.dampingFactor.toFixed(3)}
                  </span>
                </div>
                <Slider
                  value={[config.animation.dampingFactor]}
                  onValueChange={([value]) =>
                    updateConfig({
                      animation: {
                        ...config.animation,
                        dampingFactor: value,
                      },
                    })
                  }
                  min={0.01}
                  max={0.2}
                  step={0.005}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  Damping strength (lower = more inertia)
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-border p-4 bg-muted/30">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Changes update the prompt in real-time</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setConfig(defaultThreeDConfig);
              onConfigChange(defaultThreeDConfig);
            }}
          >
            Reset to Defaults
          </Button>
        </div>
      </div>
    </div>
  );
}
