import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './MultiPoint.component.html',
  styleUrls: ['./MultiPoint.component.css']
})
export class MultiPointComponent implements OnInit {
  title = 'app';
  canvas: HTMLCanvasElement;
  gl: WebGLRenderingContext;
  count: number = 0;
  VSHADER_SOURCE: string =
    'attribute vec4 a_Position;\n' +
    'attribute float a_PointSize;\n' +
    'uniform vec4 u_Translation;\n' +
    'uniform float u_CosB,u_SinB;\n' +
    'void main(){\n' +
    '  gl_Position.x=a_Position.x*u_CosB-a_Position.y*u_SinB;\n' +
    '  gl_Position.y=a_Position.x*u_SinB+a_Position.y*u_CosB;\n' +
    '  gl_Position.z=a_Position.z;\n' +
    '  gl_Position.w=1.0;\n' +
    '  gl_PointSize=a_PointSize;\n' +
    '}\n';

  FSHADER_SOURCE: string =
    'precision mediump float;\n' +
    'uniform vec4 u_FragColor;\n' +
    'void main(){\n' +
    'gl_FragColor=u_FragColor;\n' +
    '}\n';
  public ANGLE = -50.0;

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
    const a_PointSize = this.gl.getAttribLocation(this.gl['program'], 'a_PointSize');
    const u_FragColor = this.gl.getUniformLocation(this.gl['program'], 'u_FragColor');
    const u_Translation = this.gl.getUniformLocation(this.gl['program'], 'u_Translation');
    console.log("a_PointSize",a_PointSize)
    this.setAngle(this.ANGLE);
    this.gl.vertexAttrib1f(a_PointSize, 10.0);
    this.gl.uniform4f(u_FragColor, 1.0, 0.0, 0.0, 1.0);
    this.gl.uniform4f(u_Translation, 0.5, -0.5, 0.0, 0.0);
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
    this.gl.drawArrays(this.gl.TRIANGLES, 0, this.count);
  }
}
