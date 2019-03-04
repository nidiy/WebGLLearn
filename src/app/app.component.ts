import {Component, OnInit} from '@angular/core';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';
  canvas: HTMLCanvasElement;
  Point_vert: string = 'void main(){\n' +
    '  gl_Position=vec4(0.0,0.0,0.0,1.0);\n' +
    '  gl_PointSize=30.0;\n' +
    '}\n';
  Point_frag: string = 'void main(){\n' +
    '  gl_FragColor=vec4(1.0,0.0,0.0,1.0);\n' +
    '}';
  ngOnInit() {
    this.canvas = document.getElementById('webgl') as HTMLCanvasElement;
    const gl = getWebGLContext(this.canvas);
    initShaders(gl, this.Point_vert, this.Point_frag);
    gl.clearColor(0.0, 0.0, 0.0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.POINTS, 0, 1);
  }
}
