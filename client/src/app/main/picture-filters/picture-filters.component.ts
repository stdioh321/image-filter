import { Component, OnInit } from '@angular/core';
import { MainService } from '../main.service';

import * as $ from 'jquery';
import 'fabric';
declare const fabric: any;


import { PictureFiltersService } from './picture-filters.service';



@Component({
  selector: 'app-picture-filters',
  templateUrl: './picture-filters.component.html',
  styleUrls: ['./picture-filters.component.scss']
})
export class PictureFiltersComponent implements OnInit {

  constructor(
    public mainService: MainService,
    public pfService: PictureFiltersService,
  ) {
    // console.log(canvas);
    [
      { name: "Beyonce Knowles", filter_name: "beyonce_knowles", canChange: false },
      { name: "Michael Jackson", filter_name: "michael_jackson", canChange: false },
      { name: "Leonardo Dicaprio", filter_name: "leonardo_dicaprio", canChange: false },
      { name: "Taylor Lautner", filter_name: "taylor_lautner", canChange: false },
      { name: "Jonas Brothers", filter_name: "jonas_brothers", canChange: false },
      { name: "Paul Wesley And Ian Somerhalder", filter_name: "paul_wesley_and_ian_somerhalder", canChange: false },
      { name: "Usher Terry Raymond", filter_name: "usher_terry_raymond", canChange: false },
      { name: "The Beatles", filter_name: "the_beatles", canChange: false },
      { name: "Cody Simpson", filter_name: "cody_simpson", canChange: false },
      { name: "Lil Wayne", filter_name: "lil_wayne", canChange: false },
      { name: "Rihanna", filter_name: "rihanna", canChange: false }
      // { name: "Jennifer Lopez", filter_name: "jennifer_lopez", canChange: false },
      // { name: "Rolling Stones", filter_name: "rolling_stones", canChange: false },
      // { name: "Bill Kaulitz", filter_name: "bill_kaulitz", canChange: false },
      // { name: "Prison Break", filter_name: "prison_break", canChange: false },
      // { name: "Bon Jovi", filter_name: "bon_jovi", canChange: false },
      // { name: "Aishwarya Rai", filter_name: "aishwarya_rai", canChange: false },
      // { name: "Lost", filter_name: "lost", canChange: false },
      // { name: "Pink", filter_name: "pink", canChange: false },
      // { name: "Tom Cruise", filter_name: "tom_cruise", canChange: false },
      // { name: "Sergei Bezrukov", filter_name: "sergei_bezrukov", canChange: false },
      // { name: "Justin Bieber", filter_name: "justin_bieber", canChange: false },
      // { name: "Lionel Messi", filter_name: "lionel_messi", canChange: false },
      // { name: "Bruce Willis", filter_name: "bruce_willis", canChange: false },
      // { name: "Robert Pattinson", filter_name: "robert_pattinson", canChange: false },
      // { name: "Medvedev And Schwarzenegger", filter_name: "medvedev_and_schwarzenegger", canChange: false },
      // { name: "Nicole Kidman", filter_name: "nicole_kidman", canChange: false },
      // { name: "Shah Rukh Khan", filter_name: "shah_rukh_khan", canChange: false },
      // { name: "Selena Gomez", filter_name: "selena_gomez", canChange: false, extraImage: true },
      // { name: "One Direction", filter_name: "one_direction", canChange: false, face: true },
      // { name: "Lady Gaga", filter_name: "lady_gaga", canChange: false },
      // { name: "Angelina Jolie", filter_name: "angelina_jolie", canChange: false },
      // { name: "Brad Pitt", filter_name: "brad_pitt", canChange: false },
      // { name: "Johnny Depp", filter_name: "johnny_depp", canChange: false },
      // { name: "Keira Knightley", filter_name: "keira_knightley", canChange: false },
      // { name: "Kim Kardashian", filter_name: "kim_kardashian", canChange: false },
      // { name: "Jackie Chan", filter_name: "jackie_chan", canChange: false },
      // { name: "House Md", filter_name: "house_md", canChange: false },
      // { name: "David Duchovny", filter_name: "david_duchovny", canChange: false },
      // { name: "Harry Potter", filter_name: "harry_potter", canChange: false },
      // { name: "Kristen Stewart", filter_name: "kristen_stewart", canChange: false }

    ]
  }

  ngOnInit() {
    this.startCanvas();
  }
  startCanvas() {
    let canvas = new fabric.Canvas('picture-filters-canvas', {});
    this.pfService.canvas = canvas;
    window['pfService'] = this.pfService;
  }
}