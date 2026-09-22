import * as THREE from 'three';

/**
 * Raises texture sampling quality on a loaded model.
 *
 * Anisotropic filtering is the cheapest sharpness win available here: without
 * it, any surface seen at a glancing angle — the suit's shoulders, the desk,
 * the laptop deck — is sampled with a heavy mip bias and goes muddy. The GPU
 * does this in fixed-function hardware, so the cost is negligible next to how
 * much blur it removes.
 *
 * Capped at 8 rather than the device maximum: past 8 the difference is not
 * visible at this scale, and some mobile GPUs report 16 while paying for it.
 */
const MAX_ANISOTROPY = 8;

const TEXTURE_SLOTS = [
  'map',
  'normalMap',
  'roughnessMap',
  'metalnessMap',
  'emissiveMap',
  'aoMap',
] as const;

export function applyTextureQuality(object: THREE.Object3D, capabilityMax: number) {
  const anisotropy = Math.min(MAX_ANISOTROPY, Math.max(1, capabilityMax));

  object.traverse((child) => {
    if (!(child instanceof THREE.Mesh)) return;
    const materials = Array.isArray(child.material) ? child.material : [child.material];

    for (const material of materials) {
      const std = material as THREE.MeshStandardMaterial;
      for (const slot of TEXTURE_SLOTS) {
        const texture = std[slot] as THREE.Texture | null | undefined;
        if (!texture || texture.anisotropy === anisotropy) continue;
        texture.anisotropy = anisotropy;
        texture.needsUpdate = true;
      }
    }
  });
}
