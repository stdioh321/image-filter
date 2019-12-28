import { Injectable } from '@angular/core';

import * as $ from 'jquery';
import 'fabric';
import { MainService } from '../main.service';
declare const fabric: any;

@Injectable({
  providedIn: 'root'
})
export class PictureFiltersService {
  public canvas = null;
  constructor(
    public mainService: MainService

  ) { }

  loadImageOnCanvas(img = null) {
    return new Promise((res, rej) => {
      if (!img) {
        rej(false);
        return false;
      };
      let tmpImg = document.createElement('img');
      tmpImg.src = img;

      tmpImg.onload = () => {
        let imgInstance = new fabric.Image(tmpImg, {
          "id": "original"
        });
        this.canvas.clear();
        this.canvas.setBackgroundImage(imgInstance, this.canvas.renderAll.bind(this.canvas));
        this.canvas.setWidth(tmpImg.width);
        this.canvas.setHeight(tmpImg.height);

        // this.canvas.add(imgInstance);

        // this.canvas.setActiveObject(this.canvas.item(0));
        // this.canvas.selection = false;

        // this.canvas.item(0).selectable = false;
        window['tmp'] = this.canvas;
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
  filterSelected(filterName = null) {
    return new Promise((resolve, reject) => {
      if (!filterName) {
        reject(false);
        return false;
      };

      let tmpImgOriginal = this.mainService.original;
      let tmpImgResult = this.mainService.original;

      this.loadImageOnCanvas(tmpImgOriginal)
        .then(res => {
          try {
            fabric.Image.fromURL(tmpImgResult, (img) => {
              img.set({ selectable: false });
              console.log(filterName);

              switch (filterName) {
                case 'sepia':
                  img.filters = [new fabric.Image.filters.Sepia()];
                  break;
                case 'bw':
                  img.filters = [new fabric.Image.filters.BlackWhite()];
                  break;

                case 'vintage':
                  img.filters = [new fabric.Image.filters.Vintage()];
                  break;

                default:
                  break;
              }
              img.applyFilters();
              this.canvas.add(img);
              this.mainService.current = this.canvas.toDataURL();
              this.canvas.renderAll();
              resolve(true);
            });
          } catch (error) {
            reject(false);
          }

        });

    });

  }
  filterChangeIntensity(val = 0) {
    let current = this.canvas.item(0);
    current.set({ opacity: val });
    this.canvas.renderAll();
  }


}
