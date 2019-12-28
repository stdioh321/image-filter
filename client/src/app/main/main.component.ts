import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { MainService } from './main.service';
import { PictureFiltersService } from './picture-filters/picture-filters.service';


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  public imgUpload = null;
  public currMenu = 1;
  public currFilter = 0;

  constructor(
    public spinner: NgxSpinnerService,
    public mainService: MainService,
    public pfService: PictureFiltersService
  ) { }

  ngOnInit() {
  }
  onPictureUpload(e) {
    let file = e.target.files[0];
    // console.log(this.imgUpload);

    if (file) {

      if (file.type.match(/image/gi)) {
        // alert("Sucesso, uma imagem");
        let reader = new FileReader();
        this.spinner.show();
        reader.onload = (e) => {

          let img = e['target']['result'];

          this.pfService.loadImageOnCanvas(img)
            .then(res => {
              this.spinner.hide();
              this.currFilter = 0;
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


            });
        }
        reader.onerror = (e) => {
          this.spinner.hide();
        }
        reader.readAsDataURL(file);
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
    this.currFilter = 0;
    this.currMenu = idx;
  }
  downloadCurrentImage(e) {
    let a = document.createElement("a");
    let href = null;
    a.href = this.getCurrentImage();
    a.download = Date.now() + ".png";
    a.click();
  }
  downloadAllImage(e = null) {
    this.spinner.show();
    this.mainService.picturesList.forEach((item, index) => {
      let a = document.createElement("a");
      // let href = item;
      a.target = "_blank";
      a.href = item;
      a.download = index + "_" + Date.now() + ".png";
      a.click();
    });
    this.spinner.hide();
  }
  addCurrentImage(e) {
    this.spinner.show();
    this.mainService.picturesList.push(this.getCurrentImage());
    setTimeout(() => {
      this.spinner.hide();
    }, 200);
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
    this.spinner.show();
    this.pfService.filterSelected(filterName)
      .then(res => {
        this.currFilter = filterIndex;
        this.spinner.hide();
      }).catch(err => {
        this.spinner.hide();
      });
  }
  onFilterRangeChange(e) {
    let val = e.target.value || 0;
    this.pfService.filterChangeIntensity(val);
  }
}
