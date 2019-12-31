import { Component, OnInit } from '@angular/core';
import { MainService } from '../main.service';

import * as $ from 'jquery';
import 'fabric';
declare const fabric: any;


import { PictureFiltersService } from './picture-filters.service';



@Component({
  selector: 'app-picture-filters',
  templateUrl: './picture-filters.component.html',
  styleUrls: ['./picture-filters.component.scss']
})
export class PictureFiltersComponent implements OnInit {

  constructor(
    public mainService: MainService,
    public pfService: PictureFiltersService,
  ) { }

  ngOnInit() {
    // $("#tmpCanvas");
    let canvas = new fabric.Canvas('picture-filters-canvas', {
    });
    this.pfService.canvas = canvas;
    window['pfService'] = this.pfService;
  }
  // console.log(canvas);

}