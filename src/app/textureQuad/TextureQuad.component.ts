import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './TextureQuad.component.html',
  styleUrls: ['./TextureQuad.component.css']
})
export class TextureQuadComponent implements OnInit {
  title = 'app';
  canvas: HTMLCanvasElement;
  gl: WebGLRenderingContext;
  count: number = 0;
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
    'uniform sampler2D u_Sampler;\n' +
    'varying vec2 v_TexCoord;\n' +
    'void main(){\n' +
    '  gl_FragColor=texture2D(u_Sampler,v_TexCoord);\n' +
    '}\n';
  public ANGLE = -50.0;

  initVertexBuffers(gl: WebGLRenderingContext): number {
    const vertices = new Float32Array([
      // x   y     u    v
      -0.5, 0.5, -0.3, 1.7,
      -0.5, -0.5, -0.3, -0.2,
       0.5, 0.5, 1.7, 1.4,
       0.5, -0.5, 1.7, -0.2
    ]);
    console.log("vertices",vertices)
    const n = vertices.length / 4;
    const FSIZE: number = vertices.BYTES_PER_ELEMENT;
    const vertexBuffer = gl.createBuffer();
    //const sizesBuffer = gl.createBuffer();
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
    let texture = gl.createTexture();
    let u_Sampler = gl.getUniformLocation(gl['program'], 'u_Sampler');
    let image = new Image();
    image.onload = () => {
      this.loadTexture(gl, n, texture, u_Sampler, image)
    };
    image.src = 'assets/timg_512.jpg';
    return true;
  }
  public loadTexture(gl: WebGLRenderingContext, n: number, texture: WebGLTexture, u_Sampler: WebGLUniformLocation, image: HTMLImageElement): void {
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);//对纹理图像进行Y轴反转
    //开启0号纹理单元
    gl.activeTexture(gl.TEXTURE0);
    //向target绑定纹理对像
    gl.bindTexture(gl.TEXTURE_2D, texture);
    //配置纹理参数
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    //配置纹理图像
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
    //将0号纹理传递给着色器
    gl.uniform1i(u_Sampler, 0);
    this.render();
    console.log("材质加载完成=>",image);
    document.body.appendChild(image)
  }

  ngOnInit() {
    this.canvas = document.getElementById('webgl') as HTMLCanvasElement;
    this.gl = getWebGLContext(this.canvas);
    initShaders(this.gl, this.VSHADER_SOURCE, this.FSHADER_SOURCE);
    this.count = this.initVertexBuffers(this.gl);
    this.initTextures(this.gl,0);
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
