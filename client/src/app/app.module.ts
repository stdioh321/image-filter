import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainComponent } from './main/main.component';

// CUSTOM IMPORTS
import { NgxSpinnerModule } from "ngx-spinner";
import { PictureFiltersComponent } from './main/picture-filters/picture-filters.component';
import { MainService } from './main/main.service';
import { PictureFiltersService } from './main/picture-filters/picture-filters.service';
import { UcWidgetModule } from 'ngx-uploadcare-widget';
import { ColorSketchModule } from 'ngx-color/sketch';
import { ColorHueModule } from 'ngx-color/hue'; // <color-hue-picker></color-hue-picker>
import { ColorChromeModule } from 'ngx-color/chrome'; // <color-chrome></color-chrome>
import { ToastUiImageEditorModule } from "ngx-tui-image-editor";


@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    PictureFiltersComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NgxSpinnerModule,
    UcWidgetModule,
    ColorChromeModule,
    ToastUiImageEditorModule
  ],
  providers: [MainService, PictureFiltersService],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
