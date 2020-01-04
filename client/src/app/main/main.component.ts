import { Component, OnInit, NgZone } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { MainService } from './main.service';
import { PictureFiltersService } from './picture-filters/picture-filters.service';
import { HttpClient } from '@angular/common/http';


import * as $ from 'jquery';
import 'fabric';
declare const fabric: any;

declare const FilerobotImageEditor: any;
declare const download: any;

declare const Pixie: any;

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  // public tmp = []
  public pixieEditor: any = null;
  public imgUpload = null;
  public currMenu = 1;
  public currFilter = null;
  public photoFiltersList = {
    "trending": ['Soft Lilac', 'Lilac Dreams', 'Sweet Caramel', 'Light Bokeh', 'Antique Oil Painting', 'Old Style Bw', 'Washed Out Edges', 'Dreams Of Love', 'Tropical Butterflies', 'Vintage Card'],
    "stylized": ['Old Style Bw', 'Soft Lilac', 'Dramatic Bronze', 'Vintage Card', 'Old Photo', 'Retro Film', 'Triptych Effect', 'Sweet Caramel'],
    "lighting": ['Rainbow Rays', 'Dawn Light', 'Floodlights', 'Mysterious Rays', 'Moon Night', 'Romantic Landscape', 'Evening Light'],
    "color": ['Poster Look', 'Dreamy Retro', 'Retro Sepia', 'Caramel Haze', 'Bronze Sepia', 'Dramatic Look', 'Fantasy Blue', 'Hdr', 'Hot Sunset', 'Dramatic Retro'],
    "fancy_filters": ['Puzzle', 'Edge Detection', 'Cartoon', 'Dave Hill', 'Infrared', 'Neon', 'Crazy Fractal', 'Matrix', 'Fire', 'Kaleidoscope', 'Underwater', 'Plastic', 'Engraving', 'Cross Stitch', 'Circle Mosaic', 'Isolines', 'Mosaic', 'Image To Text Effect', 'Pixelation'],
    "background": ['Light Bokeh', 'Dreams Of Love', 'Lilac Dreams', 'Christmas Bokeh', 'Frozen Window', 'Sunny Field', 'Old Cityscape', 'Old Street Frame', 'Winter Scenery', 'Flower Dream', 'Tropical Butterflies', 'In The Wave', 'Dreamlike Scenery', 'Industrial'],
    // "painting_and_drawing": ['Antique Oil Painting', 'Fusain Painting', 'Sketch', 'Charcoal', 'Pen And Ink', 'Frosty Pattern', 'Plumbago', 'Pencil Painting', 'Impressionism', 'Pointillism', 'Van Gogh Style', 'Painting'],
    "painting_and_drawing": ["Sketch", "Color Pencil Drawing", "Warm Colors Watercolor", "Trois Couleurs Drawing", "Sanguine Drawing", "Vintage Charcoal Sketch", "Graphite Pencil Sketch", "Pastel Drawing", "Pen Sketch", "Color Pencil Sketch", "Antique Oil Painting", "Charcoal Drawing", "Crayon Drawing", "Pen and Ink", "Water Color", "Impressionism", "Fusain Painting", "Pointillism", "Charcoal", "Van Gogh Style", "Felt Tip Pen Drawing", "Pencil Painting", "Plumbago", "Painting"],
    "borders": ['Washed Out Edges', 'Simple Edge', 'Semi Transparent Frame', 'Rounded Border', 'Stamp Frame', 'Postage Frame'],
    "draws_pictures": ["Photography in Drawing ", "Torn Color Pencil Sketch", "Burning Sketch Effect", "Photo to Sketch in iPad", "Ballpoint Pen Drawing vs Photography", "Pastel Drawing vs Photography", "Photography vs Watercolor", "Pencil VS Reality"],
    "frames": ["Balloon Frame", "Heart in Hands", "Fireworks Frame", "Birthday Owls", "Wavy Blue Frame", "I Love you Honey", "Frame of Roses"]

  };

  public logoImagePos = null;
  constructor(
    public spinner: NgxSpinnerService,
    public mainService: MainService,
    public pfService: PictureFiltersService,
    public http: HttpClient,
    public ngZone: NgZone
  ) { }

  ngOnInit() {
    this.startPixieEditor();
  }

  uploadImageImgur(file = null, type = null) {
    // let url = "https://api.imgur.com/3/upload";
    let url = "https://api.imgur.com/3/image";
    let clientId = "Client-ID 93117ee7a96785a";
    let options = { headers: { "Authorization": clientId } };
    let fData = new FormData();
    fData.append("image", file);

    if (type)
      fData.append("type", type);
    return this.http.post(url, fData, options);
  }

  onPictureUpload(e) {
    let file = e.target.files[0];
    e.target.value = null;
    // console.log(this.imgUpload);

    if (file) {

      if (file.type.match(/image/gi)) {
        // alert("Sucesso, uma imagem");
        this.spinner.show();

        this.resizeImageFile(file)
          .then(resolve => {
            let tmpImage = (resolve + "").split(',')[1];
            this.pfService.uploadImageImgur(tmpImage)
              .subscribe(res => {
                let img = res['data']['link'];
                this.pfService.loadImageOnCanvas(img, true)
                  .then(res => {
                    this.spinner.hide();
                    this.currFilter = null;
                    this.currMenu = 1;
                    this.mainService.originalFile = null;
                    this.mainService.original = null;
                    this.mainService.initial = null;
                    this.mainService.current = null;
                    setTimeout(() => {
                      this.mainService.originalFile = file;
                      this.mainService.original = img;
                      this.mainService.current = img;
                      this.mainService.initial = img;
                      // console.log(file);

                    }, 0);


                  })
                  .catch(err => {
                    this.spinner.hide();
                    setTimeout(() => {
                      alert("Não foi possivel carregar a imagem no canvas");
                    }, 500);
                  });
              }, err => {
                console.log(err);
                this.spinner.hide();
                setTimeout(() => {
                  alert("Não foi possivel carregar a imagem");
                }, 500);
              });
          })
          .catch(err => {
            console.log(err);
            this.spinner.hide();
            setTimeout(() => {
              alert("Não foi possivel carregar a imagem");
            }, 500);
          })
      } else {
        alert("Não é uma imagem.");
        this.imgUpload = null;
        return false;
      }
    } else {
      // alert("Imagem necessária.");
      this.imgUpload = null;
      return false;
    }
  }
  changeMenu(idx = 0) {
    if (idx == this.currMenu) return;
    this.currFilter = null;
    this.currMenu = idx;
    let currMenuWrap = document.querySelector('.current-menu-wrap');
    if (currMenuWrap) currMenuWrap.scrollTo(0, 0);
  }
  downloadCurrentImage(e) {

    this.spinner.show();
    try {
      download(this.getCurrentImage(), Date.now() + ".png");
      setTimeout(() => {
        this.spinner.hide();
      }, 300);
    } catch (error) {
      this.spinner.hide();
    }
  }
  downloadFile(file, idx) {
    this.spinner.show();

    try {
      download(file, idx + "_" + Date.now() + ".png");
      setTimeout(() => {
        this.spinner.hide();
      }, 300);
    } catch (error) {
      this.spinner.hide();
    }
  }



  downloadAllImage(e = null) {
    this.spinner.show();
    try {
      this.mainService.picturesList.forEach((item, index) => {
        download(item, index + "_" + Date.now() + ".png");
      });
      setTimeout(() => {
        this.spinner.hide();
      }, 300);
    } catch (error) {
      this.spinner.hide();
    }
  }
  addCurrentImage(e) {
    this.spinner.show();
    setTimeout(() => {
      this.mainService.picturesList.push(this.getCurrentImage());
    }, 0);
    setTimeout(() => {
      this.spinner.hide();
    }, 500);
  }
  getCurrentImage() {
    let result = null;
    let currentCanvas: HTMLCanvasElement = document.querySelector("#picture-filters-canvas");
    if (currentCanvas) {
      result = currentCanvas.toDataURL();
    } else {
      result = this.mainService.current;
    }
    return result;
  }

  onFilterPhotoSelected(filterName = null, filterIndex = 0, canChangeIntensity = false) {
    if (this.currFilter == filterIndex)
      return;
    this.spinner.show();
    this.pfService.filterPhotoSelected(filterName, canChangeIntensity)
      .then(res => {
        this.currFilter = filterIndex;
        this.spinner.hide();
      }).catch(err => {
        this.spinner.hide();
        setTimeout(() => {
          alert("Não foi possível aplicar o filtro.");
        }, 800);
      });
  }
  onFilterPhotoAnimationSelected(filterName = null, filterIndex = 0) {
    // if (this.currFilter == filterIndex)
    // return;
    this.spinner.show();
    this.pfService.filterPhotoAnimationSelected(filterName)
      .then(res => {
        console.log('SUCCESS');

        // this.currFilter = filterIndex;
        this.spinner.hide();
      }).catch(err => {
        this.spinner.hide();
        // setTimeout(() => {
        // alert("Não foi possível aplicar o filtro.");
        // }, 800);
      });
  }
  onOriginalSelected() {
    this.spinner.show();
    this.pfService.originalSelected()
      .then(res => {
        this.currFilter = null;
        this.spinner.hide();
      }).catch(err => {
        this.spinner.hide();
      });
  }

  onFilterPhotoRangeChange(e) {
    let val = e.target.value || 0;
    this.pfService.filterChangeIntensity(val);
  }
  onFilterRangeChange(e) {
    let val = e.target.value || 0;
    this.pfService.filterChangeIntensity(val);
  }

  openEditor() {
    let config = {};
    config['translations'] = { 'en': { 'toolbar.download': 'Finalize' } };
    config['watermark'] = { fileUpload: true, opacity: 1, position: 'right-bottom' };
    config['tools'] = ['adjust', 'effects', 'filters', 'rotate', 'crop', 'watermark'];

    let ImageEditor = new FilerobotImageEditor(config, { onBeforeComplete: this.onEditComplete.bind(this) });

    let img = this.mainService.original;
    ImageEditor.open(img);


  }
  openPixieEditor() {
    let tmpImage = document.createElement('img');
    let c = document.createElement('canvas');
    let ctx = c.getContext("2d");
    tmpImage.crossOrigin = 'anonymous';
    tmpImage.src = this.mainService.original;

    tmpImage.onload = () => {
      c.width = tmpImage.width;
      c.height = tmpImage.height;
      ctx.drawImage(tmpImage, 0, 0);
      let b64 = c.toDataURL();
      this.pixieEditor.resetAndOpenEditor('image', b64);
    }
    tmpImage.onerror = () => {
      alert('Não foi possível carregar a imagem');
    }
  }
  onPixieEditorSave(result) {

    if (result) {
      this.spinner.show();
      let tmpNewImage = result;
      tmpNewImage = tmpNewImage.split(",")[1];
      this.pfService.uploadImageImgur(tmpNewImage, 'base64')
        .subscribe(res => {
          // this.spinner.hide();
          // console.log(res);
          let img = res['data']['link'];
          this.pfService.loadImageOnCanvas(img)
            .then(response => {
              this.spinner.hide();
              this.currFilter = null;
              this.currMenu = 1;
              this.mainService.original = null;
              this.mainService.current = null;
              setTimeout(() => {
                this.mainService.original = img;
                this.mainService.current = img;
              }, 0);
            })
            .catch(err => {
              this.spinner.hide();
              alert("Não foi possível carregar a imagem no canvas");
            });
        }, err => {
          this.spinner.hide();
          alert("Não foi possível fazer o upload da imagem");
        });
    } else {
      alert("Não foi possível editar a imagem");
    }
  }
  startPixieEditor() {
    this.pixieEditor = new window['Pixie']({
      openImageDialog: {
        show: false
      },
      onLoad: () => {
        console.log('Pixie is ready');
      },
      ui: {
        allowEditorClose: true,
        mode: 'overlay',
        theme: 'dark',
        toolbar: {
          hideCloseButton: false
        }
      },
      onSave: (b64) => {
        // console.log(b64);
        // this.mainService.original = b64;
        this.onPixieEditorSave(b64);
        this.pixieEditor.close();
      },
      onClose: () => {
        console.log('onClose');
      }

    });
  }

  onEditComplete(result) {
    console.log('RESULT', result);
    // return false;
    // window.alert("OK");
    if (result['status'] == 'before-complete') {
      // console.log(result['canvas'].toDataURL());
      this.spinner.show();
      let tmpNewImage = result['canvas'].toDataURL();
      tmpNewImage = tmpNewImage.split(",")[1];
      this.pfService.uploadImageImgur(tmpNewImage, 'base64')
        .subscribe(res => {
          // this.spinner.hide();
          // console.log(res);
          let img = res['data']['link'];
          this.pfService.loadImageOnCanvas(img)
            .then(response => {
              this.spinner.hide();
              this.currFilter = null;
              this.currMenu = 1;
              this.mainService.original = null;
              this.mainService.current = null;
              setTimeout(() => {
                this.mainService.original = img;
                this.mainService.current = img;
              }, 0);
            })
            .catch(err => {
              this.spinner.hide();
              alert("Não foi possível carregar a imagem no canvas");
            });
        }, err => {
          this.spinner.hide();
          alert("Não foi possível fazer o upload da imagem");
        });
    } else {
      alert("Não foi possível editar a imagem");
    }
  }
  onBeforeComplete(props) {
    console.log('onBeforeComplete: ', props);
    console.log(props.canvas.toDataURL());

  }

  openLogomarca() {
    this.spinner.show();
    this.pfService.originalSelected()
      .then(res => {
        this.currFilter = null;
        this.spinner.hide();
      }).catch(err => {
        this.spinner.hide();
      });

  }
  changeLogoText(e) {
    this.pfService.text.set('text', e.target.value);
    this.pfService.drawWaterMark();
    // this.pfService.canvas.renderAll();

  }
  changeLogoImage(e) {
    // console.log(e);
    let file = e.target.files[0];
    e.target.value = null;
    if (file) {
      if (file.type.match(/image/gi)) {
        let render = new FileReader();
        render.readAsDataURL(file);

        render.onload = (data) => {
          let imgB64 = data['target']['result'];
          this.pfService.updateLogomarcaImg(imgB64);
          this.logoImagePos = null;
        }
      } else {
        alert("Não é uma imagem.");
        return false;
      }
    } else {
      return false;
    }

  }


  resizeImageURL(url = null, width = 600) {
    return new Promise((resolve, reject) => {
      if (!url) {
        reject(false);
        return false;
      }
      let c = document.createElement('canvas');
      let ctx = c.getContext('2d');
      let img = new Image();
      img.onload = () => {
        c.width = 600;
        c.height = img.height * 600 / img.width;
        ctx.drawImage(img, 0, 0, c.width, c.height);
        resolve(c.toDataURL());
      }
      img.onerror = () => {
        reject(false);
      }
      img.crossOrigin = "anonymous";
      img.src = url;
    });
  }
  resizeImageFile(file = null, width = 600) {
    return new Promise((resolve, reject) => {
      if (!file) {
        reject(false);
        return false;
      }

      let render = new FileReader();
      render.readAsDataURL(file);
      render.onload = () => {
        let url = render['result'];
        this.resizeImageURL(url, width)
          .then(res => {
            resolve(res);
          })
          .catch(err => {
            reject(false);
          });
      }
      render.onerror = () => {
        reject(false);
      }

    });
  }
  onLogoTextSizeChange(e) {
    let val = e.target.value;
    // console.log(e);
    this.pfService.text.set('fontSize', val);
    this.pfService.drawWaterMark();
  }
  onLogoTextColorChange(e) {
    let colorHex = e.color.hex;
    this.pfService.text.set('fill', colorHex);
    // this.pfService.text.fontSize = this.pfService.text.fontSize;
    this.pfService.drawWaterMark();

  }
  onLogoTextPositionChange(e) {
    let val = e.target.value;
    this.pfService.text.set('pos', val);
    this.pfService.drawWaterMark();
  }

  onLogoImageSizeChange(e) {
    let val = e.target.value;
    // console.log(val);
    this.pfService.image.scaleToWidth(val);
    this.pfService.drawWaterMark();
  }
  onLogoImagePositionChange(e) {
    let val = e.target.value;
    this.pfService.image.set('pos', val);
    this.pfService.drawWaterMark();
  }

  resetAll() {
    if (confirm('Realmente resetar??')) {
      this.currFilter = null;
      this.currMenu = 1;
      this.imgUpload = null;
      this.mainService.current = null;
      this.mainService.history = [];
      this.mainService.initial = null;
      this.mainService.original = null;
      this.mainService.originalFile = null;
      this.mainService.picturesList = [];
      this.pfService.startWaterMark();
      this.pfService.canvas.clear();
    }
  }
  onRemoveLogoImage() {
    this.pfService.removeLogomarcaImg();
  }

  resetMain() {

  }

  removeCurrentImage(idx) {
    // console.log(idx);
    this.mainService.picturesList.splice(idx, 1);
  }
  onFilterThumbErro(e) {
    let src = e.target.src;
    e.target.src = "assets/images/filters/filter_original.jpg"
  }
}


