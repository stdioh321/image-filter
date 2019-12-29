import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { MainService } from './main.service';
import { PictureFiltersService } from './picture-filters/picture-filters.service';
import { HttpClient } from '@angular/common/http';


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
    "color": ['Poster Look', 'Dreamy Retro', 'Retro Sepia', 'Caramel Haze', 'Bronze Sepia', 'Dramatic Look', ' ', 'Fantasy Blue', 'Hdr', 'Hot Sunset', 'Dramatic Retro'],
    "fancy_filters": ['Puzzle', 'Edge Detection', 'Cartoon', 'Dave Hill', 'Infrared', 'Neon', 'Crazy Fractal', 'Matrix', 'Fire', 'Kaleidoscope', 'Underwater','Plastic', 'Engraving', 'Cross Stitch', 'Circle Mosaic', 'Isolines', 'Mosaic', 'Image To Text Effect', 'Pixelation'],
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

  uploadImageImgur(file = null) {
    let url = "https://api.imgur.com/3/image";
    let clientId = "Client-ID 93117ee7a96785a";
    let options = { headers: { "Authorization": clientId } };
    let fData = new FormData();
    fData.append("image", file);
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

        // let reader = new FileReader();
        // this.spinner.show();
        // reader.onload = (e) => {

        //   let img = e['target']['result'];

        //   this.pfService.loadImageOnCanvas(img)
        //     .then(res => {
        //       this.spinner.hide();
        //       this.currFilter = 0;
        //       this.currMenu = 1;
        //       this.mainService.originalFile = null;
        //       this.mainService.original = null;
        //       this.mainService.initial = null;
        //       this.mainService.current = null;
        //       setTimeout(() => {
        //         this.mainService.originalFile = file;
        //         this.mainService.original = img;
        //         this.mainService.current = img;
        //         this.mainService.initial = img;
        //         console.log(file);

        //       }, 0);


        //     });
        // }
        // reader.onerror = (e) => {
        //   this.spinner.hide();
        // }
        // reader.readAsDataURL(file);
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
  }
  downloadCurrentImage(e) {
    let a = document.createElement("a");
    let href = null;
    a.href = this.getCurrentImage();
    a.download = Date.now() + ".png";
    let evtClick = new MouseEvent('click');
    a.dispatchEvent(evtClick);
  }
  downloadAllImage(e = null) {
    this.spinner.show();
    this.mainService.picturesList.forEach((item, index) => {
      let a = document.createElement("a");
      // let href = item;
      a.target = "_blank";
      a.href = item;
      a.download = index + "_" + Date.now() + ".png";
      let evtClick = new MouseEvent('click');
      a.dispatchEvent(evtClick);
    });
    this.spinner.hide();
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
  onFilterPhotoRangeChange(e) {
    let val = e.target.value || 0;
    this.pfService.filterChangeIntensity(val);
  }
  onFilterRangeChange(e) {
    let val = e.target.value || 0;
    this.pfService.filterChangeIntensity(val);
  }
}
