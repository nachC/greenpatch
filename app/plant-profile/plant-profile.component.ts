import { Component, OnInit } from '@angular/core';
import { Plant } from '~/shared/plant';
import { DataParams } from '../services/data-params';
import { CouchbaseService } from "../services/couchbase.service";
import { Page, EventData } from 'ui/page';
import { Image } from 'tns-core-modules/ui/image/image';
import {RouterExtensions} from "nativescript-angular/router";
import { TextView } from "ui/text-view";
import * as utils from "utils/utils";
import { isAndroid } from "platform";
import * as frame from "ui/frame";
import { Label } from 'ui/label';

@Component({
  moduleId: module.id,
  selector: 'app-plant-profile',
  templateUrl: './plant-profile.component.html',
  styleUrls: ['./plant-profile.component.scss']
})
export class PlantProfileComponent implements OnInit {

  plants: Plant[];
  plant: Plant;
  updatedData = false;
  editState = false;

  constructor(private dataParams: DataParams,
              private page: Page,
              private couchbaseservice: CouchbaseService,
              private routerExtensions: RouterExtensions) {
    
    this.plant = dataParams.storage;
    //console.log(this.plant);
    let doc = this.couchbaseservice.getDocument('plants');
    this.plants = doc.plants;
  }

  ngOnInit() {
    let profileImage = <Image>this.page.getViewById<Image>('profileImage');
    profileImage.src = this.plant.frontpageImage;
  }

  updateLastWaterDate() {
    let newDate = new Date();
    
    this.plants.filter((plant) => {
     if(plant.name === this.plant.name) {
       let indexToReplace = this.plants.indexOf(plant);
       plant.lastWaterDate = newDate.toISOString();
       this.plants[indexToReplace] = plant;
       this.plant = plant
       this.couchbaseservice.updateDocument('plants', {"plants": this.plants});
       //console.log(plant);
       //console.log(this.plants);
     }
    });
  }

  addNote(args:EventData) {
    let label: Label = <Label>args.object;
    let page: Page = <Page>label.page;
    let textview: TextView = <TextView> page.getViewById("textviewid");
    textview.focus();
    this.editState = true;
    if (isAndroid) {
      utils.ad.showSoftInput(textview.android);
    }
  }

  dismissNote(args:EventData) {
    let label: Label = <Label>args.object;
    let page: Page = <Page>label.page;
    let textview: TextView = <TextView> page.getViewById("textviewid");
    this.editState = false;
    if (isAndroid) {
      utils.ad.dismissSoftInput();
    }

    this.plants.filter((plant) => {
      if(plant.name === this.plant.name) {
        let indexToReplace = this.plants.indexOf(plant);
        plant.notes = textview.text;
        this.plants[indexToReplace] = plant;
        this.plant = plant
        this.couchbaseservice.updateDocument('plants', {"plants": this.plants});
      }
      console.log(plant);
    });
  }

  goBack(): void {
    this.routerExtensions.backToPreviousPage();
  }

}
