import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './LookAtTriangles.component.html',
  styleUrls: ['./LookAtTriangles.component.css']
})
export class LookAtTrianglesComponent implements OnInit {
  title = 'LookAtTrianglesComponent';
  canvas: HTMLCanvasElement;
  gl: WebGLRenderingContext;
  count = 0;
  VSHADER_SOURCE: string =
    'attribute vec4 a_Position;\n' +
    'attribute vec4 a_Color;\n' +
    'uniform mat4 u_mvpMatrix;\n' +
    'varying vec4 v_Color;\n' +
    'void main(){\n' +
    '  gl_Position=u_mvpMatrix*a_Position;\n' +
    '  v_Color=a_Color;\n' +
    '}\n';

  FSHADER_SOURCE: string =
    'precision mediump float;\n' +
    'varying vec4 v_Color;\n' +
    'void main(){\n' +
    '  gl_FragColor=v_Color;\n' +
    '}\n';
  public ANGLE = -50.0;
  public eyeX = 0.25;
  public eyeY = 0.25;
  public eyeZ = 0.25;

  initVertexBuffers(gl: WebGLRenderingContext): number {
    const vertices = new Float32Array([
      // x   y    z
      0.0, 0.5, -0.4, 0.4, 1.0, 0.4,
      -0.5, -0.5, -0.4, 0.4, 1.0, 0.4,
      0.5, -0.5, -0.4, 1.0, 0.4, 0.4,

      0.5, 0.4, -0.2, 1.0, 0.4, 0.4,
      -0.5, 0.4, -0.2, 1.0, 1.0, 0.4,
      0.0, -0.6, -0.2, 1.0, 0.4, 0.4,

      0.0, 0.5, 0.0, 0.4, 0.4, 1.0,
      -0.5, -0.5, 0.0, 0.4, 1.0, 0.4,
      0.5, -0.5, 0.0, 1.0, 0.4, 0.4
    ]);
    const n = vertices.length / 6;
    const FSIZE: number = vertices.BYTES_PER_ELEMENT;
    const vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
      console.log('Failed to create the buffer object');
      return -1;
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    const a_Position = gl.getAttribLocation(gl['program'], 'a_Position');
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE * 6, 0);
    gl.enableVertexAttribArray(a_Position);
    const a_Color = this.gl.getAttribLocation(this.gl['program'], 'a_Color');
    gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 6, FSIZE * 3);
    gl.enableVertexAttribArray(a_Color);
    return n;

  }

  ngOnInit() {
    this.canvas = document.getElementById('webgl') as HTMLCanvasElement;
    this.gl = getWebGLContext(this.canvas);
    initShaders(this.gl, this.VSHADER_SOURCE, this.FSHADER_SOURCE);
    this.count = this.initVertexBuffers(this.gl);
    const u_mvpMatrix = this.gl.getUniformLocation(this.gl['program'], 'u_mvpMatrix');

    const viewMatrix: Matrix4 = new Matrix4();
    viewMatrix.setLookAt(this.eyeX, this.eyeY, this.eyeZ, 0.0, 0.0, 0.0, 0, 1, 0)

    const modelMatrix: Matrix4 = new Matrix4();
    modelMatrix.setRotate(0, 0, 0, 1);

    const projMatrix = new Matrix4();
    projMatrix.setOrtho(-1, 1, -1, 1, 0.0, 3.0)

    const mvpMatrix = new Matrix4();
    mvpMatrix.set(projMatrix).multiply(viewMatrix).multiply(modelMatrix)
    this.gl.uniformMatrix4fv(u_mvpMatrix, false, mvpMatrix.elements);
    document.onwheel = (e: WheelEvent) => {
      //this.eyeZ += (10 / e.deltaY);
      //viewMatrix.setLookAt(this.eyeX, this.eyeY, this.eyeZ, 0.0, 0.0, 0.0, 0, 1, 0);
      //mvMatrix = viewMatrix.multiply(modelMatrix);
      //this.draw(u_mvMatrix, mvMatrix);
    };
    document.onkeydown = (ev: KeyboardEvent) => {
      if (ev.keyCode === 39) {
        this.eyeX += 0.1;
      } else if (ev.keyCode === 37) {
        this.eyeX -= 0.1;
      } else if (ev.keyCode === 38) {
        this.eyeY += 0.1;
      } else if (ev.keyCode === 40) {
        this.eyeY -= 0.1;
      } else {
        return;
      }
      mvpMatrix.invert();
      viewMatrix.setLookAt(this.eyeX, this.eyeY, this.eyeZ, 0.0, 0.0, 0.0, 0, 1, 0);
      mvpMatrix.set(projMatrix).multiply(viewMatrix).multiply(modelMatrix)
      this.draw(u_mvpMatrix, mvpMatrix);
    };
    this.render();
  }

  public draw(u_mvpMatrix: WebGLUniformLocation, mvpMatrix: Matrix4): void {
    this.gl.uniformMatrix4fv(u_mvpMatrix, false, mvpMatrix.elements);
    this.render();
  }

  public render(): void {
    this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    this.gl.drawArrays(this.gl.TRIANGLES, 0, this.count);
  }
}
