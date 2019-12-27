import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MainService {

  public original = null;
  public current = null;
  public history: [] = [];
  public picturesList: [] = [];
  constructor() { }
}
