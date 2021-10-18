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
        type: 'textInput',
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
      }
    ],
    formDataObj: {

    }
  }
  dataObjChange(data: any) {
    console.log(data)
    this.response = data.formDataObj;
  }

  submit() {
    this.showResult = true;
  }
}
