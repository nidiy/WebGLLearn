import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './Matrix.component.html',
  styleUrls: ['./Matrix.component.css']
})
export class MatrixComponent implements OnInit {
  title = 'app';
  canvas: HTMLCanvasElement;
  gl: WebGLRenderingContext;
  count: number = 0;
  VSHADER_SOURCE: string =
    'attribute vec4 a_Position;\n' +
    'uniform mat4 u_xformMatrix;\n' +
    'void main(){\n' +
    '  gl_Position=u_xformMatrix*a_Position;\n' +
    '}\n';

  FSHADER_SOURCE: string =
    'precision mediump float;\n' +
    'uniform vec4 u_FragColor;\n' +
    'void main(){\n' +
    'gl_FragColor=u_FragColor;\n' +
    '}\n';
  public ANGLE = 30.0;
  public startNow: number = 0;

  initVertexBuffers(gl: WebGLRenderingContext): number {
    const vertices = new Float32Array([
      0.0, 0.5, -0.5, -0.5, 0.5, -0.5
    ]);
    const n = vertices.length / 2;
    const vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
      console.log('Failed to create the buffer object');
      return -1;
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    const a_Position = gl.getAttribLocation(gl['program'], 'a_Position');
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Position);
    return n;

  }

  ngOnInit() {
    this.canvas = document.getElementById('webgl') as HTMLCanvasElement;
    this.gl = getWebGLContext(this.canvas);
    initShaders(this.gl, this.VSHADER_SOURCE, this.FSHADER_SOURCE);
    this.count = this.initVertexBuffers(this.gl);
    const u_FragColor = this.gl.getUniformLocation(this.gl['program'], 'u_FragColor');
    this.setAngle(this.ANGLE);
    this.gl.uniform4f(u_FragColor, 1.0, 0.0, 0.0, 1.0);
    this.render();
    this.canvas.addEventListener('click', (event) => {
      this.ANGLE += 5;
      this.setAngle(this.ANGLE, [0.0, 0.0, 0.0], [0.5, 0.5, 1.0]);
      this.render();
    })
    this.startNow = Date.now();
    this.tick();
    //console.log("Now:", Date.now());

  }

  public tick(): void {
    this.ANGLE += 5;
    this.setAngle(this.ANGLE, [0.0, 0.0, 0.0], [0.5, 0.5, 1.0]);
    this.render();
    //console.log(`当前运行了${(Date.now()-this.startNow) / 1000.0}秒`);
    requestAnimFrame(this.tick.bind(this))
  }

  public setAngle(value: number = 10, translates: Array<number> = [0.0, 0.0, 0.0], scales: Array<number> = [0.5, 0.5, 0.5]): void {
    const radian = Math.PI * value / 180.0;
    const cosB = Math.cos(radian);
    const sinB = Math.sin(radian);
    let Tx: number = translates[0], Ty: number = translates[1], Tz: number = translates[2];
    let scaleX: number = scales[0], scaleY: number = scales[1], scaleZ: number = scales[2];
    const xformMatrix = new Float32Array([
      cosB * scaleX, sinB, 0.0, 0.0,
      -sinB, cosB * scaleY, 0.0, 0.0,
      0.0, 0.0, 1.0 * scaleZ, 0.0,
      Tx, Ty, Tz, 1.0
    ])

    const matrix4: Matrix4 = new Matrix4();
    matrix4.setRotate(value % 360, 0, 0, 1);
    matrix4.translate(0.5, 0.0, 0);
    matrix4.scale(0.5, 0.5, 0.5);
    //matrix4.setTranslate(0.5,0.0,0);
    //matrix4.rotate(value % 360, 0, 0, 1);
    const u_xformMatrix = this.gl.getUniformLocation(this.gl['program'], 'u_xformMatrix');
    this.gl.uniformMatrix4fv(u_xformMatrix, false, matrix4.elements);
  }

  public render(): void {
    this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    this.gl.drawArrays(this.gl.TRIANGLES, 0, this.count);
  }
}
