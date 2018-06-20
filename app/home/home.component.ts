import { Component, OnInit } from '@angular/core';
import { Plant } from '../shared/plant';
import { CouchbaseService } from "../services/couchbase.service";

@Component({
  moduleId: module.id,
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  plants: Plant[] = [];

  constructor(private couchbaseservice: CouchbaseService) {
    let doc = this.couchbaseservice.getDocument('plants');
    if(doc == null) {
      console.log("No plants in db");
    }
    else {
      this.plants = doc.plants;
    }
  }

  ngOnInit() {
    console.log(this.plants);
  }

  deletePlant(obj: Plant) {
    //console.log(obj);
    let indexToDelete = this.plants.indexOf(obj);
    //console.log(indexToDelete);
    this.plants.splice(indexToDelete, 1);
    this.couchbaseservice.updateDocument('plants', {"plants": this.plants});
    //console.log(this.plants);
  }

}
