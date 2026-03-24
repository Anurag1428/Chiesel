export interface ThreeDConfig {
  material: {
    transmission: number;
    roughness: number;
    metalness: number;
    clearcoat: number;
  };
  geometry: {
    type: "sphere" | "box" | "torus" | "cylinder" | "cone";
    segments: number;
  };
  lighting: {
    ambientIntensity: number;
    directionalPosition: { x: number; y: number; z: number };
    pointLightColor: string;
  };
  camera: {
    fov: number;
    position: { x: number; y: number; z: number };
    lookAt: { x: number; y: number; z: number };
  };
  animation: {
    autoRotateSpeed: number;
    enableDamping: boolean;
    dampingFactor: number;
  };
}

export const defaultThreeDConfig: ThreeDConfig = {
  material: {
    transmission: 0,
    roughness: 0.5,
    metalness: 0,
    clearcoat: 0,
  },
  geometry: {
    type: "sphere",
    segments: 32,
  },
  lighting: {
    ambientIntensity: 0.5,
    directionalPosition: { x: 5, y: 5, z: 5 },
    pointLightColor: "#ffffff",
  },
  camera: {
    fov: 75,
    position: { x: 0, y: 0, z: 5 },
    lookAt: { x: 0, y: 0, z: 0 },
  },
  animation: {
    autoRotateSpeed: 1,
    enableDamping: true,
    dampingFactor: 0.05,
  },
};
