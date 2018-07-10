import { Component, OnInit } from '@angular/core';
import { Plant } from '../shared/plant';
import { CouchbaseService } from "../services/couchbase.service";
import { DataParams } from '../services/data-params';
import {RouterExtensions} from "nativescript-angular/router";
import { PlatformLocation } from '@angular/common';
import { PageRoute } from "nativescript-angular/router";
import { switchMap } from "rxjs/operators";

@Component({
  moduleId: module.id,
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  plants: Plant[] = [];
  numberOfPlants: number;
  zeroPlants: boolean;

  constructor(private couchbaseservice: CouchbaseService,
              private dataparams: DataParams,
              private routerExtensions: RouterExtensions,
              private location : PlatformLocation,
              private pageRoute: PageRoute) {

    let doc = this.couchbaseservice.getDocument('plants');
    if(doc == null) {
      console.log("No plants in db");
      this.numberOfPlants = 0;
    }
    else {
      this.plants = doc.plants;
      this.numberOfPlants = this.plants.length;
    }
  }

  ngOnInit() {
    this.location.onPopState(() => {
      let doc = this.couchbaseservice.getDocument('plants');
      if(doc == null) {
        console.log("No plants in db");
        this.numberOfPlants = 0;
      }
      else {
        this.plants = doc.plants;
        this.numberOfPlants = this.plants.length;
      }
    });
    
    if(this.numberOfPlants == 0) {
      this.zeroPlants = true;
    }
    else if(this.numberOfPlants != 0) {
      this.zeroPlants = false;
    }

    console.log(this.plants);
  }

  deletePlant(obj: Plant) {
    //console.log(obj);
    let indexToDelete = this.plants.indexOf(obj);
    //console.log(indexToDelete);
    this.plants.splice(indexToDelete, 1);
    this.couchbaseservice.updateDocument('plants', {"plants": this.plants});
    this.numberOfPlants = this.plants.length;
    if(this.numberOfPlants == 0) {
      this.zeroPlants = true;
    }
    else if(this.numberOfPlants != 0) {
      this.zeroPlants = false;
    }
    //console.log(this.plants);
  }

  selectPlant(obj: Plant) {
    //console.log(obj);
    this.dataparams.storage = obj;
    this.routerExtensions.navigate(['/plant-profile']);
  }

}
