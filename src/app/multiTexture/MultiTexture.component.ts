import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './MultiTexture.component.html',
  styleUrls: ['./MultiTexture.component.css']
})
export class MultiTextureComponent implements OnInit {
  title = 'app';
  canvas: HTMLCanvasElement;
  gl: WebGLRenderingContext;
  count = 0;
  VSHADER_SOURCE: string =
    'attribute vec4 a_Position;\n' +
    'attribute vec2 a_TexCoord;\n' +
    'varying   vec2 v_TexCoord;\n' +
    'void main(){\n' +
    '  gl_Position=a_Position;\n' +
    '  v_TexCoord=a_TexCoord;\n' +
    '}\n';

  FSHADER_SOURCE: string =
    'precision mediump float;\n' +
    'uniform sampler2D u_Sampler0;\n' +
    'uniform sampler2D u_Sampler1;\n' +
    'varying vec2 v_TexCoord;\n' +
    'void main(){\n' +
    '  vec4 color0=texture2D(u_Sampler0,v_TexCoord);\n' +
    '  vec4 color1=texture2D(u_Sampler1,v_TexCoord);\n' +
    '  gl_FragColor=color0+color1;\n' +
    '}\n';
  public ANGLE = -50.0;
  public g_texUnit0: boolean = false;
  public g_texUnit1: boolean = false;

  initVertexBuffers(gl: WebGLRenderingContext): number {
    const vertices = new Float32Array([
      // x   y     u    v
      -0.5, 0.5, 0.0, 1.0,
      -0.5, -0.5, 0.0, 0.0,
      0.5, 0.5, 1.0, 1.0,
      0.5, -0.5, 1.0, 0.0
    ]);
    const n = vertices.length / 4;
    const FSIZE: number = vertices.BYTES_PER_ELEMENT;
    const vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
      console.log('Failed to create the buffer object');
      return -1;
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    const a_Position = gl.getAttribLocation(gl['program'], 'a_Position');
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 4, 0);
    gl.enableVertexAttribArray(a_Position);
    const a_TexCoord = this.gl.getAttribLocation(this.gl['program'], 'a_TexCoord');
    gl.vertexAttribPointer(a_TexCoord, 2, gl.FLOAT, false, FSIZE * 4, FSIZE * 2);
    gl.enableVertexAttribArray(a_TexCoord);
    return n;

  }

  initTextures(gl: WebGLRenderingContext, n: number): boolean {
    const texture0 = gl.createTexture();
    const u_Sampler0 = gl.getUniformLocation(gl['program'], 'u_Sampler0');
    const image0 = new Image();
    image0.onload = () => {
      this.g_texUnit0 = true;
      this.loadTexture(gl, n, texture0, u_Sampler0, image0, 0)
    };
    image0.src = 'assets/timg_512.jpg';
    const texture1 = gl.createTexture();
    const u_Sampler1 = gl.getUniformLocation(gl['program'], 'u_Sampler1');
    const image1 = new Image();
    image1.onload = () => {
      this.g_texUnit1 = true;
      this.loadTexture(gl, n, texture1, u_Sampler1, image1, 1)
    };
    image1.src = 'assets/circle512.jpg';
    return true;
  }

  public loadTexture(gl: WebGLRenderingContext, n: number, texture: WebGLTexture, u_Sampler: WebGLUniformLocation, image: HTMLImageElement, texUnit: number = 0): void {
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);//对纹理图像进行Y轴反转
    //开启0号纹理单元
    gl.activeTexture(gl["TEXTURE" + texUnit]);
    //向target绑定纹理对像
    gl.bindTexture(gl.TEXTURE_2D, texture);
    //配置纹理参数
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    //配置纹理图像
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
    //将0号纹理传递给着色器
    gl.uniform1i(u_Sampler, texUnit);
    if (this.g_texUnit1 && this.g_texUnit0) {
      console.log("材质加载全部完成=>");
      this.render();
    }
    document.body.appendChild(image)
  }

  ngOnInit() {
    this.canvas = document.getElementById('webgl') as HTMLCanvasElement;
    this.gl = getWebGLContext(this.canvas);
    initShaders(this.gl, this.VSHADER_SOURCE, this.FSHADER_SOURCE);
    this.count = this.initVertexBuffers(this.gl);
    this.initTextures(this.gl, 0);
    this.canvas.addEventListener('click', (event) => {
      this.render();
    })
  }

  public render(): void {
    this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, this.count);
  }
}
