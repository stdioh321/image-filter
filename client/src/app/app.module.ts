import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
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
    NgxSpinnerModule
  ],
  providers: [MainService, PictureFiltersService],
  bootstrap: [AppComponent]
})
export class AppModule { }
