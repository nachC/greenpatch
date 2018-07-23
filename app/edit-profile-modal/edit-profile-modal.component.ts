import { Component, OnInit } from '@angular/core';
import { ModalDialogParams } from 'nativescript-angular/modal-dialog';
import { DatePicker } from 'ui/date-picker';
import { TextField } from '../../node_modules/tns-core-modules/ui/text-field/text-field';

@Component({
  moduleId: module.id,
  selector: 'app-edit-profile-modal',
  templateUrl: './edit-profile-modal.component.html',
  styleUrls: ['./edit-profile-modal.component.scss']
})
export class EditProfileModalComponent implements OnInit {

  plantedDatePicker: DatePicker;
  harvestDatePicker: DatePicker;
  newName: string;

  constructor(private params: ModalDialogParams) { 
    console.log(params.context.datePlanted);
    this.newName = params.context.name;
  }

  ngOnInit() {}

  onNameChange(args) {
    let textField = <TextField>args.object;
    this.newName = textField.text;
  }

  onPickerLoaded1(args) {
    this.plantedDatePicker = <DatePicker>args.object;
    this.plantedDatePicker.date = new Date(this.params.context.datePlanted);
    console.log(this.plantedDatePicker.date);
    let currentdate: Date = new Date();

    this.plantedDatePicker.minDate = new Date(currentdate.getFullYear()-5, 0, 1);
    this.plantedDatePicker.maxDate = new Date(2045, 11, 31);
  }
  
  onPickerLoaded2(args) {
    this.harvestDatePicker = <DatePicker>args.object;
    this.harvestDatePicker.date = new Date(this.params.context.dateHarvest);
    let currentdate: Date = new Date();

    this.harvestDatePicker.minDate = new Date(currentdate.getFullYear()-5, 0, 1);
    this.harvestDatePicker.maxDate = new Date(2045, 11, 31);
  }

  onDayChanged1(args) {
    this.plantedDatePicker.day = args.value;
  }

  onDayChanged2(args) {
    this.harvestDatePicker.day = args.value;
  }

  onMonthChanged1(args) {
    this.plantedDatePicker.month = args.value;
  }

  onMonthChanged2(args) {
    this.harvestDatePicker.month = args.value;
  }

  onYearChanged1(args) {
    this.plantedDatePicker.year = args.value;
  }

  onYearChanged2(args) {
    this.harvestDatePicker.year = args.value;
  }

  public onSubmit() {
    let selectedPlantedDate = this.plantedDatePicker.date;
    let selectedHarvestDate = this.harvestDatePicker.date;

    let newPlantedDate = new Date(selectedPlantedDate.getFullYear(), selectedPlantedDate.getMonth(), selectedPlantedDate.getDate());
    let newHarvestDate = new Date(selectedHarvestDate.getFullYear(), selectedHarvestDate.getMonth(), selectedHarvestDate.getDate());

    let paramsData = {
      "newName" : this.newName,
      "updatedPlantedDate" : newPlantedDate.toISOString(),
      "updatedHarvestDate" : newHarvestDate.toISOString()
    }

    this.params.closeCallback(paramsData);
  }

}
