declare function getWebGLContext(canvas: HTMLCanvasElement, opt_debug?: any): any | null;

declare function initShaders(gl: WebGLRenderingContext, vshader: string, fshader: string): boolean;
declare function requestAnimFrame(callFun:Function):void
/**
 * 4x4的矩阵
 */
declare class Matrix4 {
  elements: Float32Array;

  constructor(opt_src?: Float32Array | Array<number>)

  setIdentity(): this

  set(src: Matrix4): this

  concat(other: Matrix4): this

  multiply(other: Matrix4): this

  multiplyVector3(pos): Vector3

  multiplyVector4(pos): Vector4

  transpose(): this

  setInverseOf(other: Matrix4): this

  invert(): this

  setOrtho(left: number, right: number, bottom: number, top: number, near: number, far: number): this

  ortho(left: number, right: number, bottom: number, top: number, near: number, far: number): this

  setFrustum(left: number, right: number, bottom: number, top: number, near: number, far: number): this

  frustum(left: number, right: number, bottom: number, top: number, near: number, far: number): this

  setPerspective(fovy: number, aspect: number, near: number, far: number): this

  perspective(fovy: number, aspect: number, near: number, far: number): this

  setScale(x: number, y: number, z: number): this

  scale(x: number, y: number, z: number): this

  setTranslate(x: number, y: number, z: number): this

  translate(x: number, y: number, z: number): this

  setRotate(angle: number, x: number, y: number, z: number): this

  rotate(angle: number, x: number, y: number, z: number): this

  setLookAt(eyeX: number, eyeY: number, eyeZ: number, centerX: number, centerY: number, centerZ: number, upX: number, upY: number, upZ: number): this

  lookAt(eyeX: number, eyeY: number, eyeZ: number, centerX: number, centerY: number, centerZ: number, upX: number, upY: number, upZ: number): this

  dropShadow(plane: Array<number>, light: Array<number>): this

  dropShadowDirectionally(normX: number, normY: number, normZ: number, planeX: number, planeY: number, planeZ: number, lightX: number, lightY: number, lightZ: number): this
}

/**
 * 3D向量
 */
declare class Vector3 {
  elements: Float32Array;

  constructor(opt_src?: Float32Array | Array<number>)

  normalize(): this

}

/**
 * 4D向量
 */
declare class Vector4 {
  elements: Float32Array;

  constructor(opt_src?: Float32Array | Array<number>)
}
