import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as THREE from 'three';

@Component({
  selector: 'app-cube',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cube.component.html',
  styleUrls: ['./cube.component.scss']
})
export class CubeComponent implements AfterViewInit {

  @ViewChild('canvas')
  private canvasRef!: ElementRef;

  /**
   * cube properties
   */
  // rotation speed of cube on x-asis
  @Input() public rotationSpeedX: number = 0.02;
  // rotaiton speed of cube on y-asis
  @Input() public rotationSpeedY: number = 0.01;
  // size of the cube
  @Input() public size: number = 200;
  // cube texture
  @Input() public texture: string = '/assets/texture.jpg';

  /**
   * stage properties
   */
  // camera position on the z-asis
  @Input() public cameraZ: number = 300;
  // field of view of the camera
  @Input() public fieldOfView: number = 1;
  // Near and far clipping planes are imaginary planes located at two particular distances from the camera along the camera’s sight line.
  // Only objects between a camera’s two clipping planes are rendered in that camera’s view.
  @Input('nearClipping') public nearClippingPlane: number = 1;
  @Input('farClipping') public farClippingPlane: number = 1000;

  // the camera gives a 3d view where things in the distance appear smaller than things up close.
  // The Perspective Camera defines a frustum.
  private camera!: THREE.PerspectiveCamera;
  private get canvas(): HTMLCanvasElement {
    return this.canvasRef.nativeElement;
  }
  private loader = new THREE.TextureLoader();
  // a geometry is a rendered shape that we’re building
  // e.g. PlaneGeometry, BoxGeometry, CylinderGeometry, etc.
  private geometory = new THREE.BoxGeometry(1, 1, 1);
  // a material describes the appearance of an object
  // there are different options for materials, the main difference between most of them is how they react to light
  // e.g. MeshBasicMaterial (don't react to light), MeshLambertMaterial, MeshPhongMaterial
  private material = new THREE.MeshBasicMaterial({ map: this.loader.load(this.texture) });
  private outlineMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });

  private cube: THREE.Mesh = new THREE.Mesh(this.geometory, this.material);
  private outline: THREE.LineSegments = new THREE.LineSegments(new THREE.EdgesGeometry(this.geometory), this.outlineMaterial);

  private renderer!: THREE.WebGLRenderer;

  private scene!: THREE. Scene;

  ngAfterViewInit(): void {
    this.createScene();
    this.startRenderingLoop();
  }

  /**
   * Create the scene
   * 
   * @private
   * @memberof CubeComponent
   */
  private createScene(): void {
    // scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x000000);
    this.scene.add(this.cube);
    this.scene.add(this.outline);

    // camera
    const aspectRatio = this.getAspectRatio();
    this.camera = new THREE.PerspectiveCamera(
      this.fieldOfView,
      aspectRatio,
      this.nearClippingPlane,
      this.farClippingPlane
    );
    this.camera.position.z = this.cameraZ;
  }

  private getAspectRatio(): number {
    return this.canvas.clientWidth / this.canvas.clientHeight;
  }

  /**
   * Animate the cube
   * 
   * @private
   * @memberof CubeComponent
   */
  private animateCube(): void {
    this.outline.rotation.x = this.cube.rotation.x += this.rotationSpeedX;
    this.outline.rotation.y = this.cube.rotation.y += this.rotationSpeedY;
  }

  /**
   * Start the rendering loop
   * 
   * @private
   * @memberof CubeComponent
   */
  private startRenderingLoop(): void {
    // renderer
    // use canvas element in template
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas });
    this.renderer.setPixelRatio(devicePixelRatio);
    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);

    let component: CubeComponent = this;
    (function render() {
      requestAnimationFrame(render);
      component.animateCube();
      component.renderer.render(component.scene, component.camera);
    })();
  }
}
