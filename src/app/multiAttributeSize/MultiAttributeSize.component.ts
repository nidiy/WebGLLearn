import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './MultiAttributeSize.component.html',
  styleUrls: ['./MultiAttributeSize.component.css']
})
export class MultiAttributeSizeComponent implements OnInit {
  title = 'app';
  canvas: HTMLCanvasElement;
  gl: any;
  count: number = 0;
  VSHADER_SOURCE: string =
    'attribute float a_PointSize;\n' +
    'attribute vec4 a_Position;\n' +
    'void main(){\n' +
    '  gl_Position=a_Position;\n' +
    '  gl_PointSize=10.0;\n' +
    '}\n';

  FSHADER_SOURCE: string =
    'precision mediump float;\n' +
    'uniform vec4 u_FragColor;\n' +
    'void main(){\n' +
    '   gl_FragColor=u_FragColor;\n' +
    '}\n';
  public ANGLE = -50.0;

  initVertexBuffers(gl: WebGLRenderingContext): number {
    const vertices = new Float32Array([
      0.0, 0.5, 10.0,
      -0.5, -0.5, 20.0,
      0.5, -0.5, 30.0
    ]);
    const n = vertices.length / 3;
    const FSIZE: number = vertices.BYTES_PER_ELEMENT;
    const vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
      return -1;
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const a_Position = this.gl.getAttribLocation(this.gl['program'], 'a_Position');
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 3, 0);
    gl.enableVertexAttribArray(a_Position);
    const a_PointSize = this.gl.getAttribLocation(this.gl['program'], "a_PointSize");
    if(a_PointSize<0)
    {
      console.log("没有获取到a_PointSize",a_PointSize);
    }else
    {
      console.log("获取到了a_PointSize",a_PointSize);
    }
    gl.vertexAttribPointer(a_PointSize, 1, gl.FLOAT, false, FSIZE * 3, 2);
    gl.enableVertexAttribArray(a_PointSize);
    return n;
  }

  ngOnInit() {
    this.canvas = document.getElementById('webgl') as HTMLCanvasElement;
    this.gl = getWebGLContext(this.canvas);
    initShaders(this.gl, this.VSHADER_SOURCE, this.FSHADER_SOURCE);

    this.count = this.initVertexBuffers(this.gl);
    const u_FragColor = this.gl.getUniformLocation(this.gl.program, 'u_FragColor');
    this.gl.uniform4f(u_FragColor, 0.5, 0.5, 0.0, 1.0);
    this.render();
  }

  public render(): void {
    this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    this.gl.drawArrays(this.gl.POINTS, 0, this.count);
  }
}
