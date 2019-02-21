import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {HelloPoint2Component} from "./HelloPoint2/HelloPoint2.component";
import {MultiPointComponent} from "./MultiPoint/MultiPoint.component";
import {MatrixComponent} from "./RotatedTriangleMatrix/Matrix.component";
import {MultiPointSizeComponent} from "./multiPointSize/MultiPointSize.component";
import {HelloTriangleComponent} from "./helloTriangle/HelloTriangle.component";
import {TextureQuadComponent} from "./textureQuad/TextureQuad.component";

@NgModule({
  declarations: [
    TextureQuadComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [TextureQuadComponent]
})
export class AppModule {
}
