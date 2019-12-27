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

          this.pfService.loadBase64OnCanvas(img)
            .then(res => {
              this.spinner.hide();
              this.mainService.original = null;
              this.mainService.current = null;
              setTimeout(() => {
                this.mainService.original = img;
                this.mainService.current = img;
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

  onFilterHueChange(e) {
    this.pfService.filterHue(e.target.value);
  }
  onFilterBlurChange(e) {
    this.pfService.filterBlur(e.target.value);
  }
}
