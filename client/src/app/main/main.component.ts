import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { MainService } from './main.service';
import { PictureFiltersService } from './picture-filters/picture-filters.service';
import { HttpClient } from '@angular/common/http';


import * as $ from 'jquery';
import 'fabric';
declare const fabric: any;

declare const FilerobotImageEditor: any;
declare const download: any;

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
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
    "painting_and_drawing": ['Antique Oil Painting', 'Fusain Painting', 'Sketch', 'Charcoal', 'Pen And Ink', 'Frosty Pattern', 'Plumbago', 'Pencil Painting', 'Impressionism', 'Pointillism', 'Van Gogh Style', 'Painting'],
    "borders": ['Washed Out Edges', 'Semi Transparent Frame', 'Rounded Border', 'Simple Edge', 'Stamp Frame', 'Postage Frame']
  };
  constructor(
    public spinner: NgxSpinnerService,
    public mainService: MainService,
    public pfService: PictureFiltersService,
    public http: HttpClient
  ) { }

  ngOnInit() {

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
    // let fData = new FormData();
    // fData.append("image", this.image);
    // // fData.append("type", 'base64');
    // this.http.post(this.url, fData, {

    //   headers: {
    //     "Authorization": this.clientId
    //   }

    // }).subscribe(res => {
    //   console.log(res);
    // }, err => {
    //   console.log(err);

    // });
  }

  onPictureUpload(e) {
    let file = e.target.files[0];
    // console.log(this.imgUpload);

    if (file) {

      if (file.type.match(/image/gi)) {
        // alert("Sucesso, uma imagem");
        this.spinner.show();
        this.uploadImageImgur(file)
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
                  console.log(file);

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
    download(this.getCurrentImage(), Date.now() + ".png");
    setTimeout(() => {
      this.spinner.hide();
    }, 300);
  }
  downloadFile(file, idx) {
    this.spinner.show();

    download(file, idx + "_" + Date.now() + ".png");
    setTimeout(() => {
      this.spinner.hide();
    }, 300);
  }



  downloadAllImage(e = null) {
    this.spinner.show();
    this.mainService.picturesList.forEach((item, index) => {
      download(item, index + "_" + Date.now() + ".png");
    });
    setTimeout(() => {
      this.spinner.hide();
    }, 300);
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

  onFilterSelected(filterName = null, filterIndex = 0) {
    if (this.currFilter == filterIndex)
      return;
    // this.currFilter = filterIndex;
    // return;
    this.spinner.show();
    // return;
    this.pfService.filterSelected(filterName)
      .then(res => {
        this.currFilter = filterIndex;
        this.spinner.hide();
      }).catch(err => {
        this.spinner.hide();
      });
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

    // config['colorScheme'] = 'light';
    let ImageEditor = new FilerobotImageEditor(config, { onBeforeComplete: this.onEditComplete.bind(this) });

    // let img = "https://scaleflex.airstore.io/demo/stephen-walker-unsplash.jpg"; 
    let img = this.mainService.original;
    ImageEditor.open(img);
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
      this.uploadImageImgur(tmpNewImage, 'base64')
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

        // this.pfService.drawWaterMark();
      }).catch(err => {
        this.spinner.hide();
      });

  }
  changeLogoText(e) {
    this.pfService.text.text = e.target.value;
    this.pfService.drawWaterMark();
  }
  changeLogoImage(e) {
    console.log(e);
    let file = e.target.files[0];
    if (file) {
      if (file.type.match(/image/gi)) {
        let render = new FileReader();
        render.readAsDataURL(file);

        render.onload = (data) => {
          // console.log(data.target.result);
          let imgB64 = data.target.result;
          this.pfService.image.setSrc(imgB64, (img) => {
            // img.set({width:60});
            console.log(img);
            img.scaleToWidth(90,true);
            this.pfService.drawWaterMark();
          });

        }
      } else {
        alert("Não é uma imagem.");
        return false;
      }
    } else {
      // alert("Imagem necessária.");
      // this.imgUpload = null;
      return false;
    }
    // this.pfService.text.text = e.target.value;
    // this.pfService.drawWaterMark();
  }
}


