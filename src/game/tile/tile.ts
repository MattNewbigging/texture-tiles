import * as THREE from "three";

export abstract class Tile extends THREE.Mesh {
  abstract readonly tileX: number;
  abstract readonly tileY: number;
}
