import { Component, OnInit } from '@angular/core';
import { Plant } from '../shared/plant';
import { CouchbaseService } from "../services/couchbase.service";
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
  documents = [];

  constructor(private couchbaseservice: CouchbaseService,
              private routerExtensions: RouterExtensions,
              private location : PlatformLocation) {

              this.documents = this.couchbaseservice.getAllPlants();
              this.updateNumberOfPlants();
              console.log(this.documents);
  }

  ngOnInit() {
    this.location.onPopState(() => {
      this.documents = this.couchbaseservice.getAllPlants();
      this.updateNumberOfPlants();
    });
  }

  updateNumberOfPlants() {
    if(this.documents.length == 0) {
      console.log("No plants in db");
      this.zeroPlants = true;
    }
    else {
      this.zeroPlants = false;
    }
  }

  deletePlant(id: string) {
    let options = {
      title: "Delete",
      message: "Are you sure you want to delete this plant?",
      okButtonText: "Yes",
      cancelButtonText: "No"
    };
  
    confirm(options).then((result: boolean) => {
        if(result) {
          this.couchbaseservice.deletePlant(id);
          this.documents = this.couchbaseservice.getAllPlants();
          this.updateNumberOfPlants();
        }
    });
  }

  selectPlant(id: string) {
    this.routerExtensions.navigate(['/plant-profile', id]);
  }

}