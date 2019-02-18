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
    'void main(){\n' +
    '  gl_Position=a_Position;\n' +
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
    const gl = getWebGLContext(this.canvas);
    initShaders(gl, this.VSHADER_SOURCE, this.FSHADER_SOURCE);
    const n = this.initVertexBuffers(gl);
    const a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    const a_PointSize = gl.getAttribLocation(gl.program, 'a_PointSize');
    const u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
    const g_points = [];
    const g_colors = [];
    gl.vertexAttrib1f(a_PointSize, 10.0);
    gl.uniform4f(u_FragColor, 1.0, 0.0, 0.0, 1.0);
    gl.clearColor(0.0, 0.0, 0.0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.POINTS, 0, n);

  }
}
