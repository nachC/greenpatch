import { Component, OnInit, ViewContainerRef} from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { TextField } from 'ui/text-field';
import { ModalDialogService, ModalDialogOptions } from 'nativescript-angular/modal-dialog';
import { DatePickerModalComponent } from '~/date-picker-modal/date-picker-modal.component';
import { CouchbaseService } from "../services/couchbase.service";
import {RouterExtensions} from "nativescript-angular/router";
import * as camera from 'nativescript-camera';
import { Image } from 'ui/image';
import { Page } from 'ui/page';
import * as imagepicker from 'nativescript-imagepicker';
import { Switch } from "ui/switch";

@Component({
  moduleId: module.id,
  selector: 'app-add-plant',
  templateUrl: './add-plant.component.html',
  styleUrls: ['./add-plant.component.scss']
})
export class AddPlantComponent implements OnInit {

  plantProfileData: FormGroup;
  submittedPlantProfileData = {
                                name: '',
                                frontpageImage: null,
                                imageGalery: [],
                                datePlanted: '',
                                dateHarvest: '',
                                lastWaterDate: '',
                                notes: ''
                              };
  
  profileImage: Image;
  harvest: boolean = false;
  formIsValid: boolean = false;

  constructor(private fb: FormBuilder,
              private modalService: ModalDialogService,
              private vcRef: ViewContainerRef,
              private couchbaseService: CouchbaseService,
              private routerExtensions: RouterExtensions,
              private page: Page) {

    this.plantProfileData = this.fb.group({
        name: ['', Validators.required],
        frontpageImage: null,
        imageGalery: [],
        datePlanted: ['', Validators.required],
        dateHarvest: '',
        lastWaterDate: '',
        notes: ''
    });
   }

  ngOnInit() {}

  onNameChange(args) {  
    let textField = <TextField>args.object;
    if(textField.text.length == 0) {
      this.formIsValid = false;
    } else {
      this.plantProfileData.patchValue({name: textField.text});
      this.formIsValid = true;
    }
  }


  onDatePlantedChange(args) {
    let textField = <TextField>args.object;
    this.plantProfileData.patchValue({datePlanted: textField.text});
  }

  onDateHarvestChange(args) {
    let textField = <TextField>args.object;
    this.plantProfileData.patchValue({dateHarvest: textField.text});
  }

  createModalView(args) {
    let options: ModalDialogOptions = {
      viewContainerRef: this.vcRef,
      context: args,
      fullscreen: false
    };

    this.modalService.showModal(DatePickerModalComponent, options)
      .then(result => {
        if(args === 'planted')
          this.plantProfileData.patchValue({datePlanted: result});
        else if (args === 'harvest')
          this.plantProfileData.patchValue({dateHarvest: result});
      });
  }

  onFirstChecked(args) {
    let harvestSwitch = <Switch>args.object;
    if(harvestSwitch.checked) {
      this.harvest = true;
    }
    else {
      this.harvest = false;
    }
  }

  capturePicture() {
    if(camera.isAvailable()) {
      camera.requestPermissions();   
      camera.takePicture()
        .then((imageAsset) => {
            this.profileImage = <Image>this.page.getViewById<Image>('profileImage');
            this.profileImage.src = imageAsset;
            this.plantProfileData.patchValue({frontpageImage: imageAsset.android});
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
          this.plantProfileData.patchValue({frontpageImage: selection[0].android});
          console.log(selection[0].android);
        })
        .catch(function(e) {
          console.log("Error -> " + e);
        });
  }

  onSubmit() {
    this.submittedPlantProfileData.name = this.plantProfileData.value.name;
    this.submittedPlantProfileData.datePlanted = this.plantProfileData.value.datePlanted;
    this.submittedPlantProfileData.dateHarvest = this.plantProfileData.value.dateHarvest;
    this.submittedPlantProfileData.frontpageImage = this.plantProfileData.value.frontpageImage;

    let rand = Math.floor(Math.random() * 99999);
    this.couchbaseService.createPlant(this.submittedPlantProfileData, this.submittedPlantProfileData.name + "_" + rand);
    this.routerExtensions.navigate(["/home"], { clearHistory: true});
  }
}
