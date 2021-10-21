import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'dynamic-form';
  showResult = false;
  response = {};
  noResponse = {};
  isFormInvalid = false;
  isFormPristine = true;

  dataObj = {
    displayFields: [
      {
        id: 'name',
        label: 'Name',
        serviceAttrName: 'name',
        type: 'textInput',
        required: true
      },
      {
        id: 'email',
        label: 'Email',
        serviceAttrName: 'email',
        type: 'email',
        required: true
      },
      {
        id: 'gender',
        label: 'Gender',
        serviceAttrName: 'gender',
        type: 'radiobutton',
        dropdownValues: [
          {
            text: 'Male',
            value: 'male'
          },
          {
            text: 'Female',
            value: 'female'
          },
        ]
      },
      {
        id: 'age',
        label: 'Age(Male)',
        serviceAttrName: 'age',
        type: 'number',
        dependentField: 'gender',
        dependentFieldValues: ['male']
      },
      {
        id: 'date',
        label: 'Date',
        serviceAttrName: 'date',
        type: 'date',
      },
      {
        id: 'timeZone',
        label: 'Time with Zone',
        serviceAttrName: 'timeZone',
        type: 'dateTimeZone',
        dropdownValues: [
          {
            text: 'Central Time',
            value: 'America/Chicago'
          },{
            text: 'Eastern Time',
            value: 'America/New_York'
          },{
            text: 'Pacific Time',
            value: 'America/Los_Angeles'
          },{
            text: 'Mountain Time',
            value: 'America/Denver'
          }
        ]
      },
      {
        id: 'color',
        label: 'Color',
        serviceAttrName: 'color',
        type: 'colorInput'
      },
      {
        id: 'notes',
        label: 'Notes',
        serviceAttrName: 'notes',
        type: 'wysiwygInput'
      }
    ],
    formDataObj: {

    }
  }
  dataObjChange(data: any) {
    console.log(data)
    this.response = data.formDataObj;
    this.isFormInvalid = data.isFormInvalid;
    this.isFormPristine = data.isFormPristine;
  }

  submit() {
    this.showResult = true;
  }
}
