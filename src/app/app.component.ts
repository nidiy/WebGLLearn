import {Component, OnInit} from '@angular/core';

import Point_vert from './shaders/Point_vert.glsl';
import Point_frag from './shaders/Point_frag.glsl';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';
  canvas: HTMLCanvasElement;
  ngOnInit() {
    console.log("shadow_vert", Point_vert, Point_frag);
    this.canvas = document.getElementById('webgl') as HTMLCanvasElement;
    const gl = getWebGLContext(this.canvas);
    initShaders(gl, Point_vert, Point_frag)
    gl.clearColor(0.0, 0.0, 0.0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.POINTS, 0, 1);
  }
}
