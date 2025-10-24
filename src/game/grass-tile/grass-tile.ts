import * as THREE from "three";
import tileVS from "./shaders/tile.vs";
import tileFS from "./shaders/tile.fs";
import { AssetManager, TextureFiles } from "../asset-manager";
import { Tile } from "../tile/tile";

export class GrassTile extends Tile {
  readonly tileX: number;
  readonly tileY: number;

  constructor(x: number, y: number, assetManager: AssetManager) {
    const textureA = assetManager.textures.get(TextureFiles.Grass1Diffuse)!;
    const textureB = assetManager.textures.get(
      TextureFiles.GrassLeavesDiffuse,
    )!;

    const geometry = new THREE.PlaneGeometry().rotateX(-Math.PI * 0.5);
    const material = new GrassTileMaterial(textureA, textureB);

    super(geometry, material);

    this.tileX = x;
    this.tileY = y;
  }
}

class GrassTileMaterial extends THREE.ShaderMaterial {
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
