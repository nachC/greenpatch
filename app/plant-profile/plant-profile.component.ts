import { Component, OnInit } from '@angular/core';
import { Plant } from '~/shared/plant';
import { DataParams } from '../services/data-params';
import { Page } from 'ui/page';
import { Image } from 'tns-core-modules/ui/image/image';

@Component({
  moduleId: module.id,
  selector: 'app-plant-profile',
  templateUrl: './plant-profile.component.html',
  styleUrls: ['./plant-profile.component.scss']
})
export class PlantProfileComponent implements OnInit {

  plant: Plant;

  constructor(private dataParams: DataParams,
              private page: Page) {
    
    this.plant = dataParams.storage;
    console.log(this.plant);
  }

  ngOnInit() {
    //console.log("Selected plant:");
    //console.log(this.plant.frontpageImage);
    let profileImage = <Image>this.page.getViewById<Image>('profileImage');
    profileImage.src = this.plant.frontpageImage;
   }

   addNote() {
     console.log("Add new note");
   }

}
