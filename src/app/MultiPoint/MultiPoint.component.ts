import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './MultiPoint.component.html',
  styleUrls: ['./MultiPoint.component.css']
})
export class MultiPointComponent implements OnInit {
  title = 'app';
  canvas: HTMLCanvasElement;
  VSHADER_SOURCE: string =
    'attribute vec4 a_Position;\n' +
    'attribute float a_PointSize;\n' +
    'uniform vec4 u_Translation;\n'+
    'uniform float u_CosB,u_SinB;\n'+
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

  initVertexBuffers(gl: WebGLRenderingContext): number {
    const vertices = new Float32Array([
      0.0, 0.5, -0.5,-0.5, 0.5, -0.5
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
  public ANGLE=-30.0;
  ngOnInit() {
    this.canvas = document.getElementById('webgl') as HTMLCanvasElement;
    const gl = getWebGLContext(this.canvas);
    initShaders(gl, this.VSHADER_SOURCE, this.FSHADER_SOURCE);
    var radian=Math.PI*this.ANGLE/180.0;
    var cosB=Math.cos(radian)
    var sinB=Math.sin(radian)
    const n = this.initVertexBuffers(gl);
    const a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    const a_PointSize = gl.getAttribLocation(gl.program, 'a_PointSize');
    const u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
    const u_Translation = gl.getUniformLocation(gl.program, 'u_Translation');

    const u_CosB = gl.getUniformLocation(gl.program, 'u_CosB');
    gl.uniform1f(u_CosB, cosB);
    const u_SinB = gl.getUniformLocation(gl.program, 'u_SinB');
    gl.uniform1f(u_SinB, sinB);

    const g_points = [];
    const g_colors = [];
    gl.vertexAttrib1f(a_PointSize, 10.0);
    gl.uniform4f(u_FragColor, 1.0, 0.0, 0.0, 1.0);
    gl.uniform4f(u_Translation, 0.5, -0.5, 0.0, 0.0);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, n);
  }
}
