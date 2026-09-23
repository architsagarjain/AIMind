import { useEffect, useMemo } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * A reflection map for the set's hard surfaces, built locally.
 *
 * Without one, metal renders almost black. A metallic surface has no diffuse
 * response, so all it can show is what it reflects, and point lights reflect
 * as pinpricks. That is why the desk legs and chair base used to vanish into
 * the floor.
 *
 * Deliberately NOT `scene.environment`: the character and the MacBook are
 * lit and graded already, and a global environment would relight both. This
 * map is handed only to the materials that need it.
 *
 * It is a tiny scene of emissive panels laid out to match the real set (city
 * window behind, cyan rim on the left, warm practical by the desk) and then
 * pre-filtered with PMREM, so reflections agree with the lights the viewer
 * actually sees. No HDR file is downloaded.
 */
export function useNightEnvironment(): THREE.Texture {
  const gl = useThree((s) => s.gl);

  const target = useMemo(() => {
    const scene = new THREE.Scene();
    const disposables: Array<{ dispose(): void }> = [];

    const room = new THREE.Mesh(
      new THREE.BoxGeometry(22, 9, 22),
      new THREE.MeshBasicMaterial({ color: '#05070f', side: THREE.BackSide }),
    );
    room.position.y = 3.5;
    scene.add(room);
    disposables.push(room.geometry, room.material);

    const panel = (
      width: number,
      height: number,
      color: string,
      intensity: number,
      position: [number, number, number],
    ) => {
      const material = new THREE.MeshBasicMaterial({
        color: new THREE.Color(color).multiplyScalar(intensity),
        side: THREE.DoubleSide,
      });
      const mesh = new THREE.Mesh(new THREE.PlaneGeometry(width, height), material);
      mesh.position.set(...position);
      mesh.lookAt(0, 1, 0);
      scene.add(mesh);
      disposables.push(mesh.geometry, material);
    };

    panel(14, 5, '#2c4677', 1.3, [1.4, 2.2, -9.5]); //  city window
    panel(0.7, 4.5, '#6ef2ff', 2.2, [-6, 2.2, -2.5]); // cyan rim
    panel(2.4, 1.2, '#ffb070', 2.6, [5, 1.4, 3.5]); //    warm practical
    panel(2.2, 2.2, '#d7e6ff', 2.4, [-3.5, 5.5, 5.5]); // key
    panel(7, 3, '#7d90b8', 0.45, [0, 8, 0]); //          ceiling bounce

    const pmrem = new THREE.PMREMGenerator(gl);
    const rt = pmrem.fromScene(scene, 0.035);
    pmrem.dispose();
    disposables.forEach((d) => d.dispose());
    return rt;
  }, [gl]);

  // The render target owns the texture's GPU memory; disposing the texture alone leaks it.
  useEffect(() => () => target.dispose(), [target]);
  return target.texture;
}
