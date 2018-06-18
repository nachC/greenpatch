import { Component, OnInit } from '@angular/core';
import { Plant } from '../shared/plant';

@Component({
  moduleId: module.id,
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  plants: Plant[] = [];

  constructor() {
    this.plants.push(
      {
        id: 0,
        name: 'Plant 1',
        frontpageImage: '',
        imageGalery: [],
        datePlanted: '',
        dateHarvest: '',
        lastWaterDate: '',
        notes: ''
      },
      {
        id: 1,
        name: 'Plant 2',
        frontpageImage: '',
        imageGalery: [],
        datePlanted: '',
        dateHarvest: '',
        lastWaterDate: '',
        notes: ''
      }
    );
   }

  ngOnInit() {
    //console.log(this.plants);
  }

}
