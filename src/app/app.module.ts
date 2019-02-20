import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {HelloPoint2Component} from "./HelloPoint2/HelloPoint2.component";
import {MultiPointComponent} from "./MultiPoint/MultiPoint.component";
import {MatrixComponent} from "./RotatedTriangleMatrix/Matrix.component";
import {MultiPointSizeComponent} from "./multiPointSize/MultiPointSize.component";

@NgModule({
  declarations: [
    MultiPointSizeComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [MultiPointSizeComponent]
})
export class AppModule {
}
