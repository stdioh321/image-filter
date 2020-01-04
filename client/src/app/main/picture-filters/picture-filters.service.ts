import { Injectable } from '@angular/core';

import * as $ from 'jquery';
import 'fabric';
import { MainService } from '../main.service';
import { HttpClient } from '@angular/common/http';
declare const fabric: any;

declare const photoAPIApplyFilter: any;

@Injectable({
  providedIn: 'root'
})
export class PictureFiltersService {
  public canvas = null;
  public image = null;
  public text = null;
  constructor(
    public mainService: MainService,
    public http: HttpClient,
  ) {
    this.startWaterMark();

  }
  startWaterMark() {
    this.image = new fabric.Image('', { selectable: false, id: 'image' });
    this.text = new fabric.Text('', { selectable: false, fill: '#FF0000', fontSize: 50, id: 'txt' });
  }
  drawWaterMark() {
    this.canvas.getObjects().forEach((el) => {
      if (el.id == 'txt' || el.id == 'image') {
        try {
          this.canvas.remove(el)
        } catch (error) {

        }
      };
    });



    if (this.image && this.image.getElement() && this.image.getElement()['naturalWidth']) {
      this.updateObjPosition(this.image.pos || '9', this.image);
      this.canvas.add(this.image);
    }
    this.updateObjPosition(this.text.pos, this.text);
    this.canvas.add(this.text);
    this.canvas.renderAll();

  }

  loadImageOnCanvas(img = null, crossOrigin = false) {
    return new Promise((res, rej) => {
      if (!img) {
        rej(false);
        return false;
      };
      try {

        this.canvas.clear();
        this.canvas.setBackgroundImage(img, (tmp) => {
          if (!tmp) {
            rej(false);
            return false;
          }
          let w = (tmp && tmp.width) || 0;
          let h = (tmp && tmp.height) || 0;
          this.canvas.setWidth(w);
          this.canvas.setHeight(h);
          this.canvas.renderAll();
          this.drawWaterMark();
          res(true);
        }, { 'crossOrigin': "anonymous" });
        // });

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
        // console.log(photoImg);
        if (!photoImg) {
          reject(false);
          return false;
        }
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
              img.set({ selectable: false, id: 'filtro' });
              img.scaleToWidth(this.canvas.width);
              img.scaleToHeight(this.canvas.height);
              img.applyFilters();
              this.canvas.add(img);
              this.canvas.getObjects().forEach(el => {
                if (el.id == 'filtro') {
                  el.sendToBack();
                }
              });
              this.canvas.renderAll();
              this.mainService.current = tmpImgResult;
              resolve(true);
            }, { crossOrigin: 'anonymous' });
            // });

          }).catch(err => {
            reject(false);
          });
      } catch (error) {
        reject(false);
      }

    });

  }
  filterPhotoAnimationSelected(filterName = null) {
    return new Promise(async (resolve, reject) => {
      try {


        let photoImg = await this.getPhotoFIlter(filterName, this.mainService.original, 'trending', 'animated_effect');
        // console.log('filterPhotoAnimationSelected');
        console.log(photoImg);
        resolve(true);
      } catch (error) {
        reject(false);
      }
    });
  }
  filterChangeIntensity(val = 0) {
    try {
      let current = null;
      this.canvas.forEachObject((el) => {
        if (el.id == "filtro")
          current = el;
      });
      current.set({ opacity: val });
      this.canvas.renderAll();
    } catch (error) {

    }
  }

  getPhotoFIlter(template = null, imgUrl = null, effect = "trending", name = "collage") {
    return new Promise((resolve, reject) => {
      photoAPIApplyFilter(effect, template, imgUrl, {
        before: function () {
          // console.log('before');
        }, success: (requestId, json) => {
          // console.log(requestId, json);

          // resolve("https://arkzffgvpo.cloudimg.io/width/600/n/" + json['result_url']);
          
          let url = json['result_url'];
          url = url.replace(/^http:\/\//i, 'https://');
          resolve("https://arkzffgvpo.cloudimg.io/width/600/n/" + url);

          // this.uploadImageImgur(json['result_url'])
          //   .subscribe(res => {
          //     resolve(res['data']['link']);
          //   }, err => {
          //     reject('imgur');
          //   });

          // this.getBase64FromImage(json['result_url'], (b64) => {
          //   resolve(b64);
          // }, () => {
          //   reject('getBase64FromImage');
          // });
        }, ajaxError: function () {
          reject('ajaxError');
        }, apiError: function () {
          reject('apiError');
        }
      }, name)
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

  updateLogomarcaImg(img) {
    try {
      new fabric.Image.fromURL(img, (result) => {
        result.scaleToWidth(100);
        this.image = result;
        this.drawWaterMark();
      }, { selectable: false, id: 'image' });
    } catch (error) {
      alert('Não foi possível carregar a imagem');
    }
  }
  removeLogomarcaImg() {
    try {
      this.image = new fabric.Image('', { selectable: false, id: 'image' });
      this.drawWaterMark();
    } catch (error) {
      alert('Não foi possível remover a imagem');
    }
  }

  updateObjPosition(pos = '1', obj = null) {
    if (!obj) return false;
    pos = pos + "";
    let padd = 15;
    var left = 0;
    var top = 0;
    switch (pos) {
      case '1':
        left = padd;
        top = padd;
        break;
      case '2':
        top = padd;
        left = (this.canvas.getWidth() / 2) - (obj.getScaledWidth() / 2);
        break
      case '3':
        top = padd;
        left = this.canvas.getWidth() - obj.getScaledWidth() - padd;
        break
      case '4':
        top = this.canvas.getHeight() / 2 - obj.getScaledHeight() / 2;
        left = padd;
        break
      case '5':
        top = this.canvas.getHeight() / 2 - obj.getScaledHeight() / 2;
        left = (this.canvas.getWidth() / 2) - (obj.getScaledWidth() / 2);
        break
      case '6':
        top = this.canvas.getHeight() / 2 - obj.getScaledHeight() / 2;
        left = this.canvas.getWidth() - obj.getScaledWidth() - padd;
        break
      case '7':
        top = this.canvas.getHeight() - obj.getScaledHeight() - padd;
        left = padd;
        break
      case '8':
        top = this.canvas.getHeight() - obj.getScaledHeight() - padd;
        left = (this.canvas.getWidth() / 2) - (obj.getScaledWidth() / 2);
        break
      case '9':
        top = this.canvas.getHeight() - obj.getScaledHeight() - padd;
        left = this.canvas.getWidth() - obj.getScaledWidth() - padd;
        break
      default:
        left = padd;
        top = padd;
        break;
    }
    obj.set('left', left);
    obj.set('top', top);
  }

  uploadImageImgur(file = null, type = null) {
    let url = "https://api.imgur.com/3/image";
    let clientId = "Client-ID 93117ee7a96785a";
    let options = { headers: { "Authorization": clientId } };
    let fData = new FormData();
    fData.append("image", file);

    if (type)
      fData.append("type", type);
    return this.http.post(url, fData, options);
  }

}
