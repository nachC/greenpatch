import { Component, OnInit, ViewContainerRef } from '@angular/core';
import {RouterExtensions} from "nativescript-angular/router";
import { ModalDialogService, ModalDialogOptions } from 'nativescript-angular/modal-dialog';
import { EditProfileModalComponent } from '../edit-profile-modal/edit-profile-modal.component';
import { CouchbaseService } from "../services/couchbase.service";
import { Page, EventData } from 'ui/page';
import { Image } from 'tns-core-modules/ui/image/image';
import { TextView } from "ui/text-view";
import { isAndroid } from "platform";
import { Label } from 'ui/label';
import { action } from 'ui/dialogs';
import { ImageGaleryModalComponent } from '~/image-galery-modal/image-galery-modal.component';
import { PageRoute } from "nativescript-angular/router";
import { switchMap } from "rxjs/operators";
import { Plant } from '~/shared/plant';

import * as utils from "utils/utils";
import * as camera from 'nativescript-camera';
import * as imagepicker from 'nativescript-imagepicker';

@Component({
  moduleId: module.id,
  selector: 'app-plant-profile',
  templateUrl: './plant-profile.component.html',
  styleUrls: ['./plant-profile.component.scss']
})
export class PlantProfileComponent implements OnInit {
  
  plant: Plant;
  updatedData = false;
  editState = false;
  profileImage: Image;
  id: string;

  constructor(private page: Page,
              private couchbaseservice: CouchbaseService,
              private routerExtensions: RouterExtensions,
              private modalService: ModalDialogService,
              private vcRef: ViewContainerRef,
              private pageRoute: PageRoute) {
    
                this.pageRoute.activatedRoute.pipe(
                  switchMap(activatedRoute => activatedRoute.params)
                ).forEach((params) => { 
                  this.id = params["id"];
                });

                let document = this.couchbaseservice.getPlant(this.id);
                this.plant = document;
                console.log(document);
  }

  ngOnInit() {
    let profileImage = <Image>this.page.getViewById<Image>('profileImage');
    profileImage.src = this.plant.frontpageImage;
  }

  openEditActions() {  
    let options = {
      title : "Edit",
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
      else if(result == "Change details") {
        this.createEditModalView();
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
          this.plant.frontpageImage = imageAsset.android;
          this.couchbaseservice.updatePlant(this.id, this.plant);
        })
        .catch((err) => {
          console.log("Error -> " + err.message);
        });
    }
  }
  
  
  uploadPicture() {
    this.profileImage = <Image>this.page.getViewById<Image>('profileImage');
    let context = imagepicker.create({
      mode: 'single'
    });
    
    context
      .authorize()
        .then(() => {
          return context.present();
        })
        .then((selection) => {
          this.profileImage.src = selection[0];
          this.plant.frontpageImage = selection[0].android;
          this.couchbaseservice.updatePlant(this.id, this.plant);
        })
        .catch(function(e) {
          console.log("Error -> " + e);
        });
  }

  
  createEditModalView() {
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
          this.plant.name = result.newName;
          if(result.updatedPlantedDate) {
            this.plant.datePlanted = result.updatedPlantedDate;
          }
          if(result.updatedHarvestDate) {
            this.plant.dateHarvest = result.updatedHarvestDate;
          }
          this.couchbaseservice.updatePlant(this.id, this.plant);
        }
        else {
          console.log("Result undefined");
        }
        
      });
  }

  
  createImageGaleryModalView() {
    let options: ModalDialogOptions = {
      viewContainerRef: this.vcRef,
      context: this.plant.imageGalery,
      fullscreen: true
    };

    this.modalService.showModal(ImageGaleryModalComponent, options)
      .then(newImageGalery => {
        this.plant.imageGalery = newImageGalery.images;
        this.couchbaseservice.updatePlant(this.id, this.plant);
      });
  }

  updateLastWaterDate() {
    let newDate = new Date();
    this.plant.lastWaterDate = newDate.toISOString();
    this.couchbaseservice.updatePlant(this.id, this.plant);
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

    this.plant.notes = textview.text;
    this.couchbaseservice.updatePlant(this.id, this.plant);
  }

  goBack(): void {
    this.routerExtensions.backToPreviousPage();
  }

}
