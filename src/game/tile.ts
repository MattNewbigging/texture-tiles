import * as THREE from "three";
import tileVS from "./shaders/tile.vs";
import tileFS from "./shaders/tile.fs";
import { MaterialAsset } from "./asset-manager";

export abstract class Tile extends THREE.Mesh {
  constructor(textureA: THREE.Texture, textureB: THREE.Texture) {
    const geometry = new THREE.PlaneGeometry().rotateX(-Math.PI * 0.5);
    const material = new TileMaterial(textureA, textureB);

    super(geometry, material);
  }
}

export class TileMaterial extends THREE.ShaderMaterial {
  readonly tDiffuseA: THREE.IUniform<THREE.Texture | null>;
  readonly tDiffuseB: THREE.IUniform<THREE.Texture | null>;

  constructor(textureA: THREE.Texture, textureB: THREE.Texture) {
    const tDiffuseA = { value: textureA };
    const tDiffuseB = { value: textureB };

    super({
      glslVersion: THREE.GLSL3,
      vertexShader: tileVS,
      fragmentShader: tileFS,
      uniforms: {
        tDiffuseA,
        tDiffuseB,
      },
    });

    this.tDiffuseA = tDiffuseA;
    this.tDiffuseB = tDiffuseB;
  }
}
