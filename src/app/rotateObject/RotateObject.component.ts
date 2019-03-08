import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './RotateObject.component.html'
})
/**
 * 灯光实例
 */
export class RotateObjectComponent implements OnInit {
  title = 'RotateObjectComponent';
  canvas: HTMLCanvasElement;
  gl: WebGLRenderingContext;
  count = 0;
  VSHADER_SOURCE = `
    attribute vec4 a_Position;
    //物体表面色
    attribute vec4 a_Color;
    //表面法向量
    attribute vec4 a_Normal;
    uniform mat4 u_NormalMatrix;
    uniform mat4 u_mvpMatrix;
    //光线颜色
    uniform vec3 u_LightColor;
    uniform vec3 u_AmbientLight;
    //归一化的世界坐标（灯光向量）
    uniform vec3 u_LightDirection;
    varying vec4 v_Color;
    void main(){
      gl_Position=u_mvpMatrix*a_Position;
      //对向量进行归一化
      vec3 normal=normalize(vec3(u_NormalMatrix*a_Normal));
      //计算光线方向和法向量的点积(dot点积函数)
      float nDotl=max(dot(u_LightDirection,normal),0.0);
      //计算漫反射的颜色
      vec3 diffuse=u_LightColor*a_Color.rgb*nDotl;
      vec3 ambient=u_AmbientLight*a_Color.rgb;
      v_Color=vec4(diffuse+ambient,a_Color.a);
    }`;
  FSHADER_SOURCE = `
  precision mediump float;
    varying vec4 v_Color;
    void main(){
      gl_FragColor=v_Color;
   }`;
  public ANGLE = 0.0;
  public eyeX = 0.0;
  public eyeY = 0.0;
  public eyeZ = 0.5;

  initVertexBuffers(gl: WebGLRenderingContext): number {
    // 顶点坐标&Color 信息
    const vertices = new Float32Array([
      // 前
      1.0, 1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, 1.0, 1.0, -1.0, 1.0,
      // 右
      1.0, 1.0, 1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, 1.0, 1.0, -1.0,
      // 顶
      1.0, 1.0, 1.0, 1.0, 1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, 1.0,
      // 底
      1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, 1.0, 1.0, -1.0, 1.0,
      // 后
      1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0,
      // 左
      -1.0, -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, -1.0
    ]);
    // 顶点索引
    const indexs = new Uint8Array([
      0, 1, 2, 0, 2, 3,
      4, 5, 6, 4, 6, 7,
      8, 9, 10, 8, 10, 11,
      12, 13, 14, 12, 14, 16,
      16, 17, 18, 16, 18, 19,
      20, 21, 22, 20, 22, 23
    ]);
    const colors = new Float32Array(
      [
        1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0,
        1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0,
        1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0,
        1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0,
        1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0,
        1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0,
      ]
    );
    const normals = new Float32Array([
      // 前
      0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0,
      // 右
      1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0,
      // 顶
      0, 1.0, 0.0, 0, 1.0, 0.0, 0, 1.0, 0.0, 0, 1.0, 0.0,
      // 底
      0, -1.0, -0.0, 0, -1.0, -0.0, 0, -1.0, -0.0, 0, -1.0, -0.0,
      // 后
      0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0,
      // 左
      -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0
    ]);
    const n = indexs.length;
    this.initArrayBuffer(gl, vertices, 3, gl.FLOAT, 'a_Position');
    this.initArrayBuffer(gl, colors, 3, gl.FLOAT, 'a_Color');
    this.initArrayBuffer(gl, normals, 3, gl.FLOAT, 'a_Normal');
    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indexs, gl.STATIC_DRAW);
    console.log('height:', this.getTriangleHeight(18, 100));
    return n;

  }

  /**
   * 根据等腰三角形的顶角&底长获取高度
   * @param {number} angle  顶角度
   * @param {number} length  底长度
   * @returns {number}
   */
  public getTriangleHeight(angle: number, length: number): number {
    return (length / 2) / Math.tan((Math.PI * (angle / 2)) / 180);
  }

  ngOnInit() {
    this.canvas = document.getElementById('webgl') as HTMLCanvasElement;
    this.gl = getWebGLContext(this.canvas);
    initShaders(this.gl, this.VSHADER_SOURCE, this.FSHADER_SOURCE);
    this.count = this.initVertexBuffers(this.gl);
    this.calculationTransformation();
    const u_LightColor = this.gl.getUniformLocation(this.gl['program'], 'u_LightColor');
    const u_AmbientLight = this.gl.getUniformLocation(this.gl['program'], 'u_AmbientLight');
    const u_LightDirection = this.gl.getUniformLocation(this.gl['program'], 'u_LightDirection');
    this.gl.uniform3f(u_LightColor, 1.0, 1.0, 1.0);
    this.gl.uniform3f(u_AmbientLight, 0.2, 0.2, 0.2);
    const lightDirection: Vector3 = new Vector3([0.5, 3.0, 4.0]);
    lightDirection.normalize();
    this.gl.uniform3fv(u_LightDirection, lightDirection.elements);
    this.render();
  }

  public initArrayBuffer(gl: WebGLRenderingContext, data: any, num: number, type: number, attribute: string): boolean {
    const vertexBuffer = gl.createBuffer();
    const a_attribute = gl.getAttribLocation(gl['program'], attribute);
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
    gl.vertexAttribPointer(a_attribute, num, type, false, 0, 0);
    gl.enableVertexAttribArray(a_attribute);
    return true;
  }

  public render(): void {
    this.gl.clearColor(0.0, 0.0, 0.0, 1);
    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    this.gl.drawElements(this.gl.TRIANGLES, this.count, this.gl.UNSIGNED_BYTE, 0);
  }
  protected addMouseEvent():void
  {

  }
  protected calculationTransformation() {
    const u_mvpMatrix = this.gl.getUniformLocation(this.gl['program'], 'u_mvpMatrix');
    const u_NormalMatrix = this.gl.getUniformLocation(this.gl['program'], 'u_NormalMatrix');

    const viewMatrix: Matrix4 = new Matrix4();
    viewMatrix.setLookAt(this.eyeX, this.eyeY, this.eyeZ, 0.0, 0.0, -100.0, 0, 1, 0);

    const modelMatrix: Matrix4 = new Matrix4();
    modelMatrix.setTranslate(0.0, 0.0, 0.0);

    const projMatrix = new Matrix4();
    projMatrix.setPerspective(30, this.canvas.width / this.canvas.height, 1, 100);
    projMatrix.lookAt(3, 3, 7, 0, 0, 0, 0, 1, 0);

    const mvpMatrix = new Matrix4();
    mvpMatrix.set(projMatrix).multiply(viewMatrix).multiply(modelMatrix);

    const normalMatrix: Matrix4 = new Matrix4();
    normalMatrix.setInverseOf(modelMatrix);
    normalMatrix.transpose();
    this.gl.uniformMatrix4fv(u_mvpMatrix, false, mvpMatrix.elements);
    this.gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);
    document.onkeydown = (ev: KeyboardEvent) => {
      if (ev.keyCode === 39) {
        this.ANGLE += 1.0;
      } else if (ev.keyCode === 37) {
        this.ANGLE -= 1.0;
      } else {
        return;
      }
      modelMatrix.setRotate(this.ANGLE % 360, 0, 1, 0);
      mvpMatrix.set(projMatrix).multiply(viewMatrix).multiply(modelMatrix);
      this.gl.uniformMatrix4fv(u_mvpMatrix, false, mvpMatrix.elements);
      normalMatrix.setInverseOf(modelMatrix);
      normalMatrix.transpose();
      this.gl.uniformMatrix4fv(u_mvpMatrix, false, mvpMatrix.elements);
      this.gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);
      this.render();
    };
  }
}
