import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { TextField } from 'ui/text-field';
import { ModalDialogService, ModalDialogOptions } from 'nativescript-angular/modal-dialog';
import { DatePickerModalComponent } from '~/date-picker-modal/date-picker-modal.component';
import { CouchbaseService } from "../services/couchbase.service";
import {RouterExtensions} from "nativescript-angular/router";

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
                                frontpageImage: '',
                                imageGalery: [],
                                datePlanted: '',
                                dateHarvest: '',
                                lastWaterDate: '',
                                notes: ''
                              };
  
  documentId: string = 'plants';
  formSubmissions = [];

  constructor(private fb: FormBuilder,
              private modalService: ModalDialogService,
              private vcRef: ViewContainerRef,
              private couchbaseService: CouchbaseService,
              private routerExtensions: RouterExtensions) {

    this.plantProfileData = this.fb.group({
        name: ['', Validators.required],
        frontpageImage: '',
        imageGalery: [],
        datePlanted: ['', Validators.required],
        dateHarvest: '',
        lastWaterDate: '',
        notes: ''
    });

    let doc = this.couchbaseService.getDocument(this.documentId);
    if(doc == null) {
      this.couchbaseService.createDocument({"plants" : []}, this.documentId);
    }
    else {
      this.formSubmissions = doc.plants;
    }
    console.log("doc in constructor:")
    console.log(doc);

   }

  ngOnInit() {}

  onNameChange(args) {
    let textField = <TextField>args.object;
    this.plantProfileData.patchValue({name: textField.text});
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

  onSubmit() {
    this.submittedPlantProfileData.name = this.plantProfileData.value.name;
    this.submittedPlantProfileData.datePlanted = this.plantProfileData.value.datePlanted;
    this.submittedPlantProfileData.dateHarvest = this.plantProfileData.value.dateHarvest;

    this.formSubmissions.push(this.submittedPlantProfileData);
    this.couchbaseService.updateDocument(this.documentId, {"plants" : this.formSubmissions});
    console.log("formSubmissions:");
    console.log(this.formSubmissions);
    let doc = this.couchbaseService.getDocument(this.documentId);
    console.log("doc onSubimit:");
    console.log(doc);
    this.routerExtensions.navigate(["/home"], { clearHistory: true});
  }

}
