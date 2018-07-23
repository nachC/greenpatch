import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Plant } from '~/shared/plant';
import { ModalDialogService, ModalDialogOptions } from 'nativescript-angular/modal-dialog';
import { EditProfileModalComponent } from '../edit-profile-modal/edit-profile-modal.component';
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
import { action } from 'ui/dialogs';
import * as camera from 'nativescript-camera';
import * as imagepicker from 'nativescript-imagepicker';

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
  profileImage: Image;

  constructor(private dataParams: DataParams,
              private page: Page,
              private couchbaseservice: CouchbaseService,
              private routerExtensions: RouterExtensions,
              private modalService: ModalDialogService,
              private vcRef: ViewContainerRef) {
    
    this.plant = dataParams.storage;
    //console.log(this.plant);
    let doc = this.couchbaseservice.getDocument('plants');
    this.plants = doc.plants;
  }

  ngOnInit() {
    let profileImage = <Image>this.page.getViewById<Image>('profileImage');
    profileImage.src = this.plant.frontpageImage;
  }

  openEditActions() {
    let options = {
      title : "Actions",
      cancelButtonText : "Cancel",
      actions : [
        "Take new picture",
        "Upload new picture",
        "Change details"
      ]
    };

    action(options).then((result) => {
      if(result == "Take new picture") {
        console.log("Take new picture clicked");
        this.capturePicture();
      }
      else if(result == "Upload new picture") {
        console.log("Upload new picture clicked");
        this.uploadPicture();
      }
      if(result == "Change details") {
        this.createModalView();
      }
    });
  }

  capturePicture() {
    if(camera.isAvailable()) {
      camera.requestPermissions();   
      camera.takePicture()
        .then((imageAsset) => {
            this.profileImage = <Image>this.page.getViewById<Image>('profileImage');
            this.profileImage.src = imageAsset;
            this.plants.filter((plant) => {
              if(plant.name === this.plant.name) {
                let indexToReplace = this.plants.indexOf(plant);
                plant.frontpageImage = imageAsset.android;
                this.plants[indexToReplace] = plant;
                this.plant = plant
                this.couchbaseservice.updateDocument('plants', {"plants": this.plants});
              }
             });
        }).catch((err) => {
            console.log("Error -> " + err.message);
        });
    }
  }

  uploadPicture() {
    let image = <Image>this.page.getViewById<Image>('profileImage');
    let context = imagepicker.create({
      mode: 'single'
    });

    context
      .authorize()
        .then(() => {
          return context.present();
        })
        .then((selection) => {
          image.src = selection[0];
          this.plants.filter((plant) => {
            if(plant.name === this.plant.name) {
              let indexToReplace = this.plants.indexOf(plant);
              plant.frontpageImage = selection[0].android;
              this.plants[indexToReplace] = plant;
              this.plant = plant
              this.couchbaseservice.updateDocument('plants', {"plants": this.plants});
            }
           });
        })
        .catch(function(e) {
          console.log("Error -> " + e);
        });
  }

  createModalView() {
    let options: ModalDialogOptions = {
      viewContainerRef: this.vcRef,
      context: {
        name : this.plant.name,
        datePlanted : this.plant.datePlanted,
        dateHarvest : this.plant.dateHarvest
      },
      fullscreen: false
    };
    this.modalService.showModal(EditProfileModalComponent, options)
      .then(result => {
        if(result) {
          this.plants.filter((plant) => {
            if(plant.name === this.plant.name) {
              let indexToReplace = this.plants.indexOf(plant);
              plant.name = result.newName;
              plant.datePlanted = result.updatedPlantedDate;
              plant.dateHarvest = result.updatedHarvestDate;
              this.plants[indexToReplace] = plant;
              this.plant = plant
              this.couchbaseservice.updateDocument('plants', {"plants": this.plants});
            }
           });
          //console.log(result);
        }
        else {
          console.log("Result undefined");
        }
        
      });
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
