import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { RenderPipeline } from "./render-pipeline";
import { AssetManager, MaterialAsset } from "./asset-manager";

export class GameState {
  private renderPipeline: RenderPipeline;
  private clock = new THREE.Clock();

  private scene = new THREE.Scene();
  private camera = new THREE.PerspectiveCamera();
  private controls: OrbitControls;

  constructor(private assetManager: AssetManager) {
    // Scene setup
    this.setupCamera();
    this.renderPipeline = new RenderPipeline(this.scene, this.camera);
    this.setupLights();

    this.controls = new OrbitControls(this.camera, this.renderPipeline.canvas);
    this.controls.enableDamping = true;
    this.controls.target.set(0, 1, 0);

    this.scene.background = new THREE.Color("#1680AF");

    // Object setup
    const gridSize = 4;
    for (let x = 0; x < gridSize; x++) {
      for (let z = 0; z < gridSize; z++) {
        const tile = this.createTile(MaterialAsset.GrassFlowers);
        tile.position.set(x, 0, z);
        this.scene.add(tile);
      }
    }

    // Start game
    this.update();
  }

  private setupCamera() {
    this.camera.fov = 75;
    this.camera.far = 500;
    this.camera.position.set(0, 1.5, 3);
  }

  private setupLights() {
    const ambientLight = new THREE.AmbientLight(undefined, 1);
    this.scene.add(ambientLight);

    const directLight = new THREE.DirectionalLight(undefined, Math.PI);
    directLight.position.copy(new THREE.Vector3(0.75, 1, 0.75).normalize());
    this.scene.add(directLight);
  }

  private createTile(materialAsset: MaterialAsset) {
    const tile = new THREE.Mesh(
      new THREE.PlaneGeometry(1, 1, 32, 32),
      new THREE.MeshStandardMaterial()
    );
    tile.rotateX(-Math.PI / 2);

    const material = this.assetManager.materials.get(materialAsset)!;
    tile.material = material;

    return tile;
  }

  private update = () => {
    requestAnimationFrame(this.update);

    const dt = this.clock.getDelta();

    this.controls.update();

    this.renderPipeline.render(dt);
  };
}
