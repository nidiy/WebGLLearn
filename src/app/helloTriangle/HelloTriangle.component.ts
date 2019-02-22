import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './helloTriangle.component.html',
  styleUrls: ['./helloTriangle.component.css']
})
/**
 * 模拟光栅化处理过来
 */
export class HelloTriangleComponent implements OnInit {
  title = 'app';
  canvas: HTMLCanvasElement;
  VSHADER_SOURCE: string =
    'attribute vec4 a_Position;\n' +
    'void main(){\n' +
    '  gl_Position=a_Position;\n' +
    '  gl_PointSize=10.0;\n' +
    '}\n';
  FSHADER_SOURCE: string =
    'precision mediump float;\n' +
    'uniform float u_Width;\n' +
    'uniform float u_Height;\n' +
    'void main(){\n' +
    'gl_FragColor=vec4(gl_FragCoord.x/u_Width,0.0,gl_FragCoord.y/u_Height,1.0);\n' +
    '}\n';

  ngOnInit() {
    this.canvas = document.getElementById('webgl') as HTMLCanvasElement;
    const gl: WebGLRenderingContext = getWebGLContext(this.canvas);
    console.log("gl", gl)
    initShaders(gl, this.VSHADER_SOURCE, this.FSHADER_SOURCE);
    const n = this.initVertexBuffers(gl)
    const u_Width = gl.getUniformLocation(gl['program'], 'u_Width');
    const u_Height = gl.getUniformLocation(gl['program'], 'u_Height');
    gl.uniform1f(u_Width, gl.drawingBufferWidth);
    gl.uniform1f(u_Height, gl.drawingBufferHeight);
    gl.clearColor(0.0, 0.0, 0.0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, n);
  }

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
    return n;

  }
}
