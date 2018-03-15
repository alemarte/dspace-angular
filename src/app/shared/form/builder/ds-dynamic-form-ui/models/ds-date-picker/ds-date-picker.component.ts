import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DynamicDsDatePickerModel } from './ds-date-picker.model';

export const DS_DATE_PICKER_SEPARATOR = '-';

@Component({
  selector: 'ds-date-picker',
  styleUrls: ['./ds-date-picker.component.scss'],
  templateUrl: './ds-date-picker.component.html',
})

export class DsDatePickerComponent implements OnInit {
  @Input() bindId = true;
  @Input() group: FormGroup;
  @Input() model: DynamicDsDatePickerModel;
  @Input() showErrorMessages = false;
  // @Input()
  // minDate;
  // @Input()
  // maxDate;

  @Output()
  selected = new EventEmitter<number>();
  @Output()
  remove = new EventEmitter<number>();
  @Output()
  change = new EventEmitter<any>();

  initialYear: number;
  initialMonth: number;
  initialDay: number;

  year: number;
  month: number;
  day: number;

  minYear: 0;
  maxYear: number;
  minMonth = 1;
  maxMonth = 12;
  minDay = 1;
  maxDay = 31;

  yearPlaceholder = 'year';
  monthPlaceholder = 'month';
  dayPlaceholder = 'day';

  disabledMonth = true;
  disabledDay = true;
  invalid = false;

  ngOnInit() {// TODO Manage fields when not setted
    const now = new Date();
    this.initialYear = now.getFullYear();
    this.initialMonth = now.getMonth() + 1;
    this.initialDay = now.getDate();

    if (this.model.value && this.model.value !== null) {
      const values = this.model.value.toString().split(DS_DATE_PICKER_SEPARATOR);
      if (values.length > 0) {
        this.initialYear = parseInt(values[0], 10);
        this.year = this.initialYear;
        this.disabledMonth = false;
      }
      if (values.length > 1) {
        this.initialMonth = parseInt(values[1], 10);
        this.month = this.initialMonth;
        this.disabledDay = false;
      }
      if (values.length > 2) {
        this.initialDay = parseInt(values[2], 10);
        this.day = this.initialDay;
      }
    }

    this.maxYear = this.initialYear + 100;

    // Invalid state for year
    this.group.get(this.model.id).statusChanges.subscribe((state) => {
      if (state === 'INVALID' || this.model.malformedDate) {
        this.invalid = true;
      } else {
        this.invalid = false;
        this.model.malformedDate = false;
      }
    });
  }

  onChange(event) {
    // update year-month-day
    switch (event.field) {
      case 'year': {
        if (event.value !== null) {
          this.year = event.value;
        } else {
          this.year = undefined;
          this.month = undefined;
          this.day = undefined;
        }
        break;
      }
      case 'month': {
        if (event.value !== null) {
          this.month = event.value;
        } else {
          this.month = undefined;
          this.day = undefined;
        }
        break;
      }
      case 'day': {
        if (event.value !== null) {
          this.day = event.value;
        } else {
          this.day = undefined;
        }
        break;
      }
    }

    // set max for days by month/year
    if (!this.disabledDay) {
      const month = this.month ? this.month - 1 : 0;
      const date = new Date(this.year, month, 1);
      this.maxDay = this.getLastDay(date);
      if (this.day > this.maxDay) {
        this.day = this.maxDay;
      }
    }

    // Manage disable
    if (!this.model.value && event.field === 'year') {
      this.disabledMonth = false;
    } else if (this.disabledDay && event.field === 'month') {
      this.disabledDay = false;
    }

    // update value
    let value = null;
    if (this.year) {
      let yyyy = this.year.toString();
      while (yyyy.length < 4) {
        yyyy = '0' + yyyy;
      }
      value = yyyy;
    }
    if (this.month) {
      const mm = this.month.toString().length === 1
        ? '0' + this.month.toString()
        : this.month.toString();
      value += DS_DATE_PICKER_SEPARATOR + mm;
    }
    if (this.day) {
      const dd = this.day.toString().length === 1
        ? '0' + this.day.toString()
        : this.day.toString();
      value += DS_DATE_PICKER_SEPARATOR + dd;
    }
    this.model.valueUpdates.next(value);
    this.change.emit(event);
  }

  getLastDay(date: Date) {
    // Last Day of the same month (+1 month, -1 day)
    date.setMonth(date.getMonth() + 1, 0);
    return date.getDate();
  }

}