import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {

  public options = {};
  title = 'client';

  constructor(
    public http: HttpClient
  ) {
    this.options = {
      'cssMaxWidth': 400,
      'cssMaxHeight': 400,
      includeUI: {
        menuBarPosition: 'bottom'
      }
    };

  }

  ngAfterViewInit() {

  }
}
