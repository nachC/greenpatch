import { Component, OnInit } from '@angular/core';
import { Plant } from '../shared/plant';
import { CouchbaseService } from "../services/couchbase.service";
import { DataParams } from '../services/data-params';
import { RouterExtensions } from "nativescript-angular/router";
import { PlatformLocation } from '@angular/common';
import { confirm } from "ui/dialogs";

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
              private dataParams: DataParams,
              private routerExtensions: RouterExtensions,
              private location : PlatformLocation) {

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
  }

  confirmDelete(obj: Plant) {
    let options = {
      title: "Delete",
      message: "Are you sure you want to delete this plant?",
      okButtonText: "Yes",
      cancelButtonText: "No"
    };
  
    confirm(options).then((result: boolean) => {
        if(result) {
          this.deletePlant(obj);
        }
    });
  }

  deletePlant(obj: Plant) {
    let indexToDelete = this.plants.indexOf(obj);
    this.plants.splice(indexToDelete, 1);
    this.couchbaseservice.updateDocument('plants', {"plants": this.plants});
    this.numberOfPlants = this.plants.length;
    if(this.numberOfPlants == 0) {
      this.zeroPlants = true;
    }
    else if(this.numberOfPlants != 0) {
      this.zeroPlants = false;
    }
  }

  selectPlant(obj: Plant) {
    this.dataParams.storage = obj;
    this.routerExtensions.navigate(['/plant-profile']);
  }

}