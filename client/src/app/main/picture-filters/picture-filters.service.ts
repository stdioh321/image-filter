import { Injectable } from '@angular/core';

import * as $ from 'jquery';
import 'fabric';
declare const fabric: any;

@Injectable({
  providedIn: 'root'
})
export class PictureFiltersService {
  public canvas = null;
  constructor() { }

  loadBase64OnCanvas(img = null) {
    return new Promise((res, rej) => {
      if (!img) {
        rej(false);
        return false;
      };
      let tmpImg = document.createElement('img');
      tmpImg.src = img;

      tmpImg.onload = () => {
        let imgInstance = new fabric.Image(tmpImg, {});
        this.canvas.setWidth(tmpImg.width);
        this.canvas.setHeight(tmpImg.height);
        this.canvas.clear();
        this.canvas.add(imgInstance);
        this.canvas.item(0).selectable = false;
        res(true);
      };
      tmpImg.onerror = () => {
        rej(false);
      }
    });

  }
  filterHue(val = 0) {
    let current = this.canvas.item(0);
    // console.log(val);
    current.filters = [new fabric.Image.filters.HueRotation({
      rotation: val
    })];
    current.applyFilters();
    this.canvas.renderAll();
  }
  filterBlur(val = 0) {
    let current = this.canvas.item(0);
    // console.log(val);
    current.filters = [new fabric.Image.filters.Blur({
      blur: val
    })];
    current.applyFilters();
    this.canvas.renderAll();    
  }
}
