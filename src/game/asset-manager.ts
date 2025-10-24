import * as THREE from "three";

export enum MaterialAsset {
  Grass1,
  GrassFlowers,
  GrassLeaves,
  DirtCrackedPebbles,
}

export enum TextureFiles {
  Grass1Diffuse = "grass-1/Grass_Texture_01.png",
  Grass1Normal = "grass-1/Ground_Normals_01.png",
  GrassFlowersDiffuse = "grass-flowers/Grass_Flowers_Texture_01.png",
  GrassFlowersNormal = "grass-flowers/Ground_Flowers_Normals_01.png",
  GrassLeavesDiffuse = "grass-leaves/Grass_Leaves_Texture_01.png",
  GrassLeavesNormal = "grass-leaves/Ground_Leaves_Normals_01.png",
  DirtCrackedPebblesDiffuse = "dirt-cracked-pebbles/Dirt_Cracked_Pebbles_Texture_01.png",
  DirtCrackedPebblesNormal = "dirt-cracked-pebbles/Dirt_Cracked_Pebbles_Normals_01.png",
}

export class AssetManager {
  materials = new Map<MaterialAsset, THREE.MeshStandardMaterial>();

  textures = new Map<TextureFiles, THREE.Texture>();

  private loadingManager = new THREE.LoadingManager();
  private textureLoader = new THREE.TextureLoader(this.loadingManager);

  load(): Promise<void> {
    this.loadTextures();

    return new Promise((resolve) => {
      this.loadingManager.onLoad = () => {
        // Create the materials that need multiple loaded files
        this.createMaterials();

        resolve();
      };
    });
  }

  private loadTextures() {
    Object.values(TextureFiles).forEach((tf) => this.loadTexture(tf));
  }

  private loadTexture(filename: TextureFiles) {
    const path = `${getPathPrefix()}/textures/${filename}`;
    const url = getUrl(path);

    this.textureLoader.load(url, (texture: THREE.Texture) => {
      this.textures.set(filename, texture);
    });
  }

  private createMaterials() {
    this.createMaterial(
      MaterialAsset.Grass1,
      TextureFiles.Grass1Diffuse,
      TextureFiles.Grass1Normal,
    );

    this.createMaterial(
      MaterialAsset.GrassFlowers,
      TextureFiles.GrassFlowersDiffuse,
      TextureFiles.GrassFlowersNormal,
    );

    this.createMaterial(
      MaterialAsset.GrassLeaves,
      TextureFiles.GrassLeavesDiffuse,
      TextureFiles.GrassLeavesNormal,
    );

    this.createMaterial(
      MaterialAsset.DirtCrackedPebbles,
      TextureFiles.DirtCrackedPebblesDiffuse,
      TextureFiles.DirtCrackedPebblesNormal,
    );
  }

  private createMaterial(
    materialAsset: MaterialAsset,
    diffuse: TextureFiles,
    normal: TextureFiles,
  ) {
    const diffuseMap = this.textures.get(diffuse)!;
    const normalMap = this.textures.get(normal)!;

    const material = new THREE.MeshStandardMaterial({
      map: diffuseMap,
      normalMap: normalMap,
    });

    this.materials.set(materialAsset, material);
  }
}

function getPathPrefix() {
  // Using template strings to create url paths breaks on github pages
  // We need to manually add the required /repo/ prefix to the path if not on localhost
  return location.hostname === "localhost" ? "" : "/texture-tiles";
}

function getUrl(path: string) {
  return new URL(path, import.meta.url).href;
}
