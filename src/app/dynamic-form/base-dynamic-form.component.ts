import { Component, OnInit } from '@angular/core';
import { DisplayFields } from './model/dynamic-form.model';


@Component({
    template: '',
})
export abstract class BaseDynamicFormComponent {
    response = {};
    isFormInvalid = false;
    isFormPristine = true;
    dataObj = {
        displayFields: [],
        formDataObj: {}
    }

    dataObjChange(data: any) {
        this.response = data.formDataObj;
        this.isFormInvalid = data.isFormInvalid;
        this.isFormPristine = data.isFormPristine;
    }
}
