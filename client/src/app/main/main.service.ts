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
    window['mainService'] = this;
  }

  ngOnInit() {

  }
  clearAll() {
    this.originalFile = null;
    this.initial = null;
    this.original = null;
    this.current = null;

    this.history = []
    this.picturesList = [];
  }
}
