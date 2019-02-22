import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './MultiPointSize.component.html',
  styleUrls: ['./MultiPointSize.component.css']
})
export class MultiPointSizeComponent implements OnInit {
  title = 'app';
  canvas: HTMLCanvasElement;
  gl: WebGLRenderingContext;
  count: number = 0;
  VSHADER_SOURCE: string =
    'attribute vec4 a_Position;\n' +
    'attribute vec4 a_Color;\n' +
    'attribute float a_PointSize;\n' +
    'varying vec4 v_Color;\n' +
    'void main(){\n' +
    '  gl_Position=a_Position;\n' +
    '  gl_PointSize=a_PointSize;\n' +
    '  v_Color=a_Color;\n' +
    '}\n';

  FSHADER_SOURCE: string =
    'precision mediump float;\n' +
    'uniform vec4 u_FragColor;\n' +
    'varying vec4 v_Color;\n' +
    'void main(){\n' +
    '  gl_FragColor=v_Color;\n' +
    '}\n';
  public ANGLE = -50.0;

  initVertexBuffers(gl: WebGLRenderingContext): number {
    const vertices = new Float32Array([
      0.0, 0.5, 30.0, 1.0, 0.0, 0.0,
      -0.5, -0.5, 20.0, 0.0, 1.0, 0.0,
      0.5, -0.5, 30.0, 0.0, 0.0, 1.0
    ]);
    const sizes = new Float32Array([
      10.0, 20.0, 30.0
    ]);
    const n = vertices.length / 6;
    const FSIZE: number = vertices.BYTES_PER_ELEMENT;
    const vertexBuffer = gl.createBuffer();
    //const sizesBuffer = gl.createBuffer();
    if (!vertexBuffer) {
      console.log('Failed to create the buffer object');
      return -1;
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    const a_Position = gl.getAttribLocation(gl['program'], 'a_Position');
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 6, 0);
    gl.enableVertexAttribArray(a_Position);
    // gl.bindBuffer(gl.ARRAY_BUFFER, sizesBuffer);
    // gl.bufferData(gl.ARRAY_BUFFER, sizes, gl.STATIC_DRAW);
    const a_PointSize = this.gl.getAttribLocation(this.gl['program'], 'a_PointSize');
    gl.vertexAttribPointer(a_PointSize, 1, gl.FLOAT, false, FSIZE * 6, FSIZE * 2);
    gl.enableVertexAttribArray(a_PointSize);
    const a_Color = this.gl.getAttribLocation(this.gl['program'], 'a_Color');
    gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 6, FSIZE * 3);
    gl.enableVertexAttribArray(a_Color);
    //this.gl.vertexAttrib1f(a_PointSize, 20.0);
    return n;

  }

  ngOnInit() {
    this.canvas = document.getElementById('webgl') as HTMLCanvasElement;
    this.gl = getWebGLContext(this.canvas);
    initShaders(this.gl, this.VSHADER_SOURCE, this.FSHADER_SOURCE);
    this.count = this.initVertexBuffers(this.gl);
    console.log("count", this.count);
    const u_FragColor = this.gl.getUniformLocation(this.gl['program'], 'u_FragColor');
    this.setAngle(this.ANGLE);
    this.gl.uniform4f(u_FragColor, 1.0, 0.0, 0.0, 1.0);
    this.render();
    this.canvas.addEventListener('click', (event) => {
      this.ANGLE += 5;
      this.setAngle(this.ANGLE);
      this.render();
    })
  }

  public setAngle(value: number = 10): void {
    const radian = Math.PI * value / 180.0;
    const cosB = Math.cos(radian);
    const sinB = Math.sin(radian);
    const u_CosB = this.gl.getUniformLocation(this.gl['program'], 'u_CosB');
    this.gl.uniform1f(u_CosB, cosB);
    const u_SinB = this.gl.getUniformLocation(this.gl['program'], 'u_SinB');
    this.gl.uniform1f(u_SinB, sinB);
  }

  public render(): void {
    this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    this.gl.drawArrays(this.gl.POINTS, 0, this.count);
  }
}
