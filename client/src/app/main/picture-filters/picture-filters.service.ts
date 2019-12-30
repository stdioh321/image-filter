import { Injectable } from '@angular/core';

import * as $ from 'jquery';
import 'fabric';
import { MainService } from '../main.service';
declare const fabric: any;

declare const photoAPIApplyFilter: any;

@Injectable({
  providedIn: 'root'
})
export class PictureFiltersService {
  public canvas = null;
  constructor(
    public mainService: MainService

  ) { }

  loadImageOnCanvas(img = null, crossOrigin = false) {
    return new Promise((res, rej) => {
      if (!img) {
        rej(false);
        return false;
      };
      try {
        this.canvas.clear();
        this.canvas.setBackgroundImage(img, (tmp) => {
          this.canvas.setWidth(tmp.width);
          this.canvas.setHeight(tmp.height);
          this.canvas.renderAll();
          res(true);
        }, { crossOrigin: "anonymous" });

      } catch (error) {
        console.log('FROMURL ERROR');
        rej(false);
      }

    });

  }


  originalSelected() {
    return new Promise((resolve, reject) => {
      this.loadImageOnCanvas(this.mainService.original)
        .then(res => {
          resolve(true);
        })
        .catch(err => {
          reject(false);
        })
    });
  }
  filterSelected(filterName = null) {
    return new Promise((resolve, reject) => {
      if (!filterName) {
        reject(false);
        return false;
      };

      let tmpImgOriginal = this.mainService.original;
      let tmpImgResult = this.mainService.original;
      // resolve(true);
      this.loadImageOnCanvas(tmpImgOriginal, true)
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
            }, { crossOrigin: 'anonymous' });
          } catch (error) {
            reject(false);
          }

        });

    });

  }


  filterPhotoSelected(filterName = null, canChangeIntensity = false) {
    return new Promise(async (resolve, reject) => {
      if (!filterName) {
        reject(false);
        return false;
      };
      // console.log(await this.getPhotoFIlter(filterName, this.mainService.original));

      let tmpImgOriginal = null;
      let tmpImgResult = null;

      try {
        let photoImg = await this.getPhotoFIlter(filterName, this.mainService.original);

        if (canChangeIntensity) {
          tmpImgOriginal = this.mainService.original;
          tmpImgResult = photoImg;
        } else {
          tmpImgOriginal = photoImg;
        }
        this.loadImageOnCanvas(tmpImgOriginal)
          .then(res => {
            if (!tmpImgResult) {
              resolve(true);
              return;
            }
            fabric.Image.fromURL(tmpImgResult, (img) => {

              img.set({ selectable: false, width: this.canvas.width, height: this.canvas.height });
              // console.log(filterName);

              img.applyFilters();
              this.canvas.add(img);
              this.mainService.current = this.canvas.toDataURL();
              this.canvas.renderAll();
              resolve(true);
            }, { crossOrigin: 'anonymous' });

          }).catch(err => {
            reject(false);
          });
      } catch (error) {
        reject(false);
      }

    });

  }

  filterChangeIntensity(val = 0) {
    let current = this.canvas.item(0);
    current.set({ opacity: val });
    this.canvas.renderAll();
  }

  getPhotoFIlter(template = null, imgUrl = null, effect = "trending") {
    return new Promise((resolve, reject) => {
      photoAPIApplyFilter(effect, template, imgUrl, {
        before: function () {
          // console.log('before');
        }, success: (requestId, json) => {
          // console.log(requestId, json);
          this.getBase64FromImage(json['result_url'], (b64) => {
            resolve(b64);
          }, () => {
            reject('getBase64FromImage');
          })
        }, ajaxError: function () {
          reject('ajaxError');
        }, apiError: function () {
          reject('apiError');
        }
      })
    });
  }
  getBase64FromImage(url, onSuccess, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = "arraybuffer";
    xhr.open("GET", "https://cors-anywhere.herokuapp.com/" + url);
    xhr.onload = function () {
      var base64, binary, bytes, mediaType;
      bytes = new Uint8Array(xhr.response);
      //NOTE String.fromCharCode.apply(String, ...
      //may cause "Maximum call stack size exceeded"
      binary = [].map.call(bytes, function (byte) {
        return String.fromCharCode(byte);
      }).join('');
      mediaType = xhr.getResponseHeader('content-type');
      base64 = [
        'data:',
        mediaType ? mediaType + ';' : '',
        'base64,',
        btoa(binary)
      ].join('');
      onSuccess(base64);
    };
    xhr.onerror = onError;
    xhr.send();
  }
}
