import { Injectable, OnInit } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MainService implements OnInit {
  public originalFile = null;
  public initial = null;
  public original = null;
  public current = null;

  public history: [] = [];
  public picturesList: any = [];


  
  constructor() {
    console.log('mainService');

    window['mainService'] = this;
  }

  ngOnInit() {

  }
}
