import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {HelloPoint2Component} from "./HelloPoint2/HelloPoint2.component";
import {MultiPointComponent} from "./MultiPoint/MultiPoint.component";
import {MatrixComponent} from "./RotatedTriangleMatrix/Matrix.component";
import {MultiPointSizeComponent} from "./multiPointSize/MultiPointSize.component";
import {HelloTriangleComponent} from "./helloTriangle/HelloTriangle.component";
import {TextureQuadComponent} from "./textureQuad/TextureQuad.component";
import {MultiTextureComponent} from "./multiTexture/MultiTexture.component";
import {LookAtTrianglesComponent} from "./lookAtTriangles/LookAtTriangles.component";
import {LightedCubeComponent} from './lightedCube/LightedCube.component';
import {RotateObjectComponent} from './rotateObject/RotateObject.component';

@NgModule({
  declarations: [
    RotateObjectComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [RotateObjectComponent]
})
export class AppModule {
}
