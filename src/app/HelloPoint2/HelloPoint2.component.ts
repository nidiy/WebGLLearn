import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './HelloPoint2.component.html',
  styleUrls: ['./HelloPoint2.component.css']
})
export class HelloPoint2Component implements OnInit {
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
  ngOnInit() {
    this.canvas = document.getElementById('webgl') as HTMLCanvasElement;
    const gl = getWebGLContext(this.canvas);
    initShaders(gl, this.VSHADER_SOURCE, this.FSHADER_SOURCE);
    const a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    const a_PointSize = gl.getAttribLocation(gl.program, 'a_PointSize');
    const u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
    console.log("&a_Position=>", a_Position)
    const g_points = [];
    const g_colors = [];
    gl.clearColor(0.0, 0.0, 0.0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    this.canvas.addEventListener('mousedown', (event) => {
      let x: number = event.clientX;
      let y: number = event.clientY;
      const rect = this.canvas.getBoundingClientRect();
      x = ((x - rect.left) - this.canvas.width / 2) / (this.canvas.width / 2);
      y = (this.canvas.height / 2 - (y - rect.top)) / (this.canvas.height / 2);
      g_points.push(x);
      g_points.push(y);
      g_points.push(5.0 + 15.0 * Math.random());
      if (x >= 0.0 && y >= 0.0) {
        g_colors.push([1.0, 0.0, 0.0, Math.random()]);
      } else if (x < 0.0 && y < 0.0) {
        g_colors.push([0.0, 1.0, 0.0, Math.random()]);
      } else {
        g_colors.push([1.0, 1.0, 1.0, Math.random()]);
      }
      gl.clearColor(0.0, 0.0, 0.0, 1);
      gl.clear(gl.COLOR_BUFFER_BIT);
      const len: number = g_points.length;
      let index: number = 0;
      for (let i = 0; i < len; i += 3) {
        const rgba = g_colors[index];
        gl.vertexAttrib1f(a_PointSize, g_points[i + 2]);
        gl.vertexAttrib4fv(a_Position, new Float32Array([g_points[i], g_points[i + 1], 0.0, 1.0]));
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
        gl.drawArrays(gl.POINTS, 0, 1);
        index++;
      }
    });

  }
}
