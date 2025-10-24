import * as THREE from "three";
import { AssetManager, TextureFiles } from "../asset-manager";
import pathTileVS from "./shaders/path-tile.vs";
import pathTileFS from "./shaders/path-tile.fs";

export class PathTile extends THREE.Mesh {
  constructor(assetManager: AssetManager) {
    const textureA = assetManager.textures.get(TextureFiles.Grass1Diffuse)!;
    const textureB = assetManager.textures.get(
      TextureFiles.DirtCrackedPebblesDiffuse,
    )!;

    const divisions = 4;
    const vertices = divisions + 1;
    const geometry = new THREE.PlaneGeometry(
      1,
      1,
      divisions,
      divisions,
    ).rotateX(-Math.PI * 0.5);

    const pathVertexArray = new Uint8Array(vertices ** 2).fill(255);

    // All Edges:
    // for (let y = 0; y < vertices; y++) {
    //   for (let x = 0; x < vertices; x++) {
    //     if (x === 0 || y === 0 || x === vertices - 1 || y === vertices - 1) {
    //       const stride = y * vertices + x;

    //       pathVertexArray[stride] = 255;
    //     }
    //   }
    // }

    for (let i = 0; i < vertices ** 2; i += vertices) {
      pathVertexArray[i] = 0;
    }

    for (let i = 4; i < vertices ** 2; i += vertices) {
      pathVertexArray[i] = 0;
    }

    const pathAttrib = new THREE.Uint8BufferAttribute(pathVertexArray, 1, true);
    geometry.setAttribute("pathAttribute", pathAttrib);

    const material = new PathTileMaterial(textureA, textureB);

    super(geometry, material);
  }
}

class PathTileMaterial extends THREE.ShaderMaterial {
  readonly tDiffuseA: THREE.IUniform<THREE.Texture | null>;
  readonly tDiffuseB: THREE.IUniform<THREE.Texture | null>;

  constructor(textureA: THREE.Texture, textureB: THREE.Texture) {
    const tDiffuseA = { value: textureA };
    const tDiffuseB = { value: textureB };

    super({
      glslVersion: THREE.GLSL3,
      vertexShader: pathTileVS,
      fragmentShader: pathTileFS,
      uniforms: {
        tDiffuseA,
        tDiffuseB,
      },
      //wireframe: true,
    });

    this.tDiffuseA = tDiffuseA;
    this.tDiffuseB = tDiffuseB;
  }
}
