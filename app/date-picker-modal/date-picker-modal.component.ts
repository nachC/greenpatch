import { Component, OnInit } from '@angular/core';
import { ModalDialogParams } from 'nativescript-angular/modal-dialog';
import { DatePicker } from 'ui/date-picker';

@Component({
  moduleId: module.id,
  templateUrl: './date-picker-modal.component.html',
  styleUrls: ['./date-picker-modal.component.scss']
})
export class DatePickerModalComponent implements OnInit {

  datePicker: DatePicker;

  constructor(private params: ModalDialogParams) {
  }

  ngOnInit() {}

  onPickerLoaded(args) {
    this.datePicker = <DatePicker>args.object;
    let currentdate: Date = new Date();

    this.datePicker.minDate = new Date(currentdate.getFullYear()-5, 0, 1);
    this.datePicker.maxDate = new Date(2045, 11, 31); 
  }

  onDayChanged(args) {
    this.datePicker.day = args.value;
  }

  onMonthChanged(args) {
    this.datePicker.month = args.value;
  }

  onYearChanged(args) {
    this.datePicker.year = args.value;
  }

  public onSubmit() {
    let selectedDate = this.datePicker.date;

    let date = new Date(selectedDate.getFullYear(),
                                 selectedDate.getMonth(),
                                 selectedDate.getDate());

    this.params.closeCallback(date.toISOString());
  }

}
