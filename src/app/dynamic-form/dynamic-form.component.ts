import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
// import * as Quill from 'quill';

// import { NoWhitespaceValidator } from './validator/no-whitespace.validator';
// import { AlphaNumericValidator } from './validator/alphanumeric.validator';
import { Utility } from './utility';
import { DisplayFields } from './model/dynamic-form.model';
// import { MaxDateZoneValidator } from './validator/maxdate-zone.validator';
// import { MinDateZoneValidator } from './validator/mindate-zone.validator';


@Component({
    selector: 'app-dynamic-form',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './dynamic-form.component.html',
    styleUrls: ['./dynamic-form.component.scss']
})
export class DynamicFormComponent implements OnInit, OnChanges {
    @Input() dataObj: any;
    @Input() set displayFields(displayFields: DisplayFields[]){
        this.fieldsToDisplay = displayFields;
    }
    @Input() formGroupNameStr: string = 'test';
    @Input() labelClass = 'col-sm-2';
    @Input() inputClass = 'col-sm-10';
    @Output() dataObjChange = new EventEmitter<any>();

    fieldsToDisplay: DisplayFields[] = [];
    formGroup: any = {};

    constructor() {

        // Force Quill to use standard inline CSS, rather than custom quill namespaced classes
        // const alignStyle = Quill.import('attributors/style/align');
        // const backgroundStyle = Quill.import('attributors/style/background');
        // const colorStyle = Quill.import('attributors/style/color');
        // const directionStyle = Quill.import('attributors/style/direction');
        // const fontStyle = Quill.import('attributors/style/font');
        // const sizeStyle = Quill.import('attributors/style/size');

        // Quill.register(alignStyle, true);
        // Quill.register(backgroundStyle, true);
        // Quill.register(colorStyle, true);
        // Quill.register(directionStyle, true);
        // Quill.register(fontStyle, true);
        // Quill.register(sizeStyle, true);
    }

    ngOnInit() {
        this.initForm();
    }

    ngOnChanges(changes: SimpleChanges) {
        if (!Utility.isEmptyObject(this.dataObj) && !Utility.isEmptyObject(this.formGroup)) {
            if (Object.keys(changes).length !== 1 ||
                !changes.fieldsToDisplay ||
                changes.fieldsToDisplay.previousValue.length !== changes.fieldsToDisplay.currentValue.length
            ) {
                this.initForm();
            }
        }
    }

    initForm() {
        this.formGroup[this.formGroupNameStr] = new FormGroup({});
        const formGroupValidators: any[] = [];
        if (this.fieldsToDisplay) {
            this.fieldsToDisplay.forEach(fieldDetailsObj => {
                // Set Validators
                const formControlValidators = this.setFormControlValidators(fieldDetailsObj);
                this.setFormGroupValidators(fieldDetailsObj).forEach(validator => {
                    formGroupValidators.push(validator);
                });

                if (fieldDetailsObj.type === 'inputList') {
                    if (this.dataObj[fieldDetailsObj.serviceAttrName]) {
                        this.dataObj[fieldDetailsObj.serviceAttrName].forEach((object: any) => {
                            this.formGroup[this.formGroupNameStr].addControl(
                                this.getInputListItemName(fieldDetailsObj.serviceAttrName, object.value),
                                new FormControl({ value: fieldDetailsObj.value ? fieldDetailsObj.value : undefined,
                                    disabled: this.convertToBoolean(fieldDetailsObj.disabled) }, formControlValidators));
                        });
                    }
                } else if (fieldDetailsObj.type === 'inputListBasedOnCount') {
                    this.formGroup[this.formGroupNameStr].addControl(fieldDetailsObj.counterName,
                        new FormControl({ value: this.dataObj[fieldDetailsObj.serviceAttrName] ?
                            this.dataObj[fieldDetailsObj.serviceAttrName].length : undefined,
                            disabled: this.convertToBoolean(fieldDetailsObj.disabled) }, formControlValidators));
                    if (this.dataObj[fieldDetailsObj.serviceAttrName]) {
                        this.dataObj[fieldDetailsObj.counterName] = this.dataObj[fieldDetailsObj.serviceAttrName].length;

                        this.dataObj[fieldDetailsObj.serviceAttrName].forEach((object: any) => {
                            this.formGroup[this.formGroupNameStr].addControl(
                                this.getInputListItemName(fieldDetailsObj.serviceAttrName, object.value),
                                new FormControl({ value: fieldDetailsObj.value ? fieldDetailsObj.value : undefined,
                                    disabled: this.convertToBoolean(fieldDetailsObj.disabled) }, formControlValidators));
                        });
                    }
                } else if (fieldDetailsObj.type === 'inputListIconPickerBasedOnCount') {
                    this.formGroup[this.formGroupNameStr].addControl(fieldDetailsObj.counterName,
                        new FormControl({ value: this.dataObj[fieldDetailsObj.serviceAttrName] ?
                            this.dataObj[fieldDetailsObj.serviceAttrName].length : undefined,
                            disabled: this.convertToBoolean(fieldDetailsObj.disabled) }, formControlValidators));
                    if (this.dataObj[fieldDetailsObj.serviceAttrName]) {
                        this.dataObj[fieldDetailsObj.counterName] = this.dataObj[fieldDetailsObj.serviceAttrName].length;
                        this.dataObj[fieldDetailsObj.serviceAttrName].forEach((object: any) => {
                            this.formGroup[this.formGroupNameStr].addControl(
                                this.getInputListItemName(fieldDetailsObj.serviceAttrName, object.value),
                                new FormControl({ value: object.value ? object.value : undefined,
                                    disabled: this.convertToBoolean(fieldDetailsObj.disabled) }, formControlValidators));
                        });
                    }
                    // if (this.dataObj[fieldDetailsObj.iconAttrName]) {
                    //     this.dataObj[fieldDetailsObj.iconAttrName].forEach((object: any) => {
                    //         this.formGroup[this.formGroupNameStr].addControl(
                    //             this.getInputListItemName(fieldDetailsObj.iconAttrName, object.value),
                    //             new FormControl({ value: object.value ? object.value : undefined,
                    //                 disabled: this.convertToBoolean(fieldDetailsObj.disabled) }, formControlValidators));
                    //     });
                    // }
                    // if (this.dataObj[fieldDetailsObj.iconColorAttrName]) {
                    //     this.dataObj[fieldDetailsObj.iconColorAttrName].forEach((object: any) => {
                    //         this.formGroup[this.formGroupNameStr].addControl(
                    //             this.getInputListItemName(fieldDetailsObj.iconColorAttrName, object.value),
                    //             new FormControl({ value: object.value ? object.value : undefined,
                    //                 disabled: this.convertToBoolean(fieldDetailsObj.disabled) }, formControlValidators));
                    //     });
                    // }
                } else if (fieldDetailsObj.type === 'timeDuration') {
                    this.formGroup[this.formGroupNameStr].addControl(fieldDetailsObj.serviceAttrName + 'Days',
                        new FormControl({ value: fieldDetailsObj.value ? fieldDetailsObj.value : undefined,
                            disabled: this.convertToBoolean(fieldDetailsObj.disabled) }, formControlValidators));
                    this.formGroup[this.formGroupNameStr].addControl(fieldDetailsObj.serviceAttrName + 'Hours',
                        new FormControl({ value: fieldDetailsObj.value ? fieldDetailsObj.value : undefined,
                            disabled: this.convertToBoolean(fieldDetailsObj.disabled) }, formControlValidators));
                    this.formGroup[this.formGroupNameStr].addControl(fieldDetailsObj.serviceAttrName + 'Minutes',
                        new FormControl({ value: fieldDetailsObj.value ? fieldDetailsObj.value : undefined,
                            disabled: this.convertToBoolean(fieldDetailsObj.disabled) }, formControlValidators));
                } else if (fieldDetailsObj.type === 'dateTimeZone') {
                    this.formGroup[this.formGroupNameStr].addControl(fieldDetailsObj.serviceAttrName,
                        new FormControl({ value: fieldDetailsObj.value ? fieldDetailsObj.value : undefined,
                            disabled: this.convertToBoolean(fieldDetailsObj.disabled) }, formControlValidators));
                    this.formGroup[this.formGroupNameStr].addControl(fieldDetailsObj.serviceAttrName + 'Zone',
                        new FormControl({ value: fieldDetailsObj.value ? fieldDetailsObj.value : undefined,
                            disabled: this.convertToBoolean(fieldDetailsObj.disabled) }, formControlValidators));
                } else if (fieldDetailsObj.type === 'multiselect-checkbox') {
                    fieldDetailsObj?.options?.forEach(option => {
                        this.formGroup[this.formGroupNameStr].addControl(fieldDetailsObj.serviceAttrName + option.value,
                            new FormControl({ value: fieldDetailsObj.value ? fieldDetailsObj.value : undefined,
                                disabled: this.convertToBoolean(fieldDetailsObj.disabled) }, formControlValidators));
                    });
                }  else {
                    this.formGroup[this.formGroupNameStr].addControl(fieldDetailsObj.serviceAttrName,
                        new FormControl({ value: fieldDetailsObj.value ? fieldDetailsObj.value : undefined,
                            disabled: this.convertToBoolean(fieldDetailsObj.disabled) }, formControlValidators));
                }
            });
        }
        if (formGroupValidators.length > 0) {
            this.formGroup[this.formGroupNameStr].setValidators(formGroupValidators);
        }
        if (!Utility.isEmptyObject(this.dataObj)) {
            this.setDataForFormFields(this.formGroup[this.formGroupNameStr], this.dataObj);
        }
    }

    setFormControlValidators(fieldDetailsObj: DisplayFields) {
        const formControlValidators = [];
        if (fieldDetailsObj.required) {
            formControlValidators.push(Validators.required as any);
        }
        if (fieldDetailsObj.type === 'email') {
            formControlValidators.push(Validators.email as any);
        }
        // if (fieldDetailsObj.noWhitespaceValidator) {
        //     formControlValidators.push(NoWhitespaceValidator);
        // }
        // if (fieldDetailsObj.alphaNumericValidator) {
        //     formControlValidators.push(AlphaNumericValidator);
        // }
        // if (!this.isEmpty(fieldDetailsObj.minlength)) {
        //     formControlValidators.push(Validators.minLength(fieldDetailsObj.minlength) as any);
        // }
        // if (!this.isEmpty(fieldDetailsObj.maxlength)) {
        //     formControlValidators.push(Validators.maxLength(fieldDetailsObj.maxlength) as any);
        // }
        // if (!this.isEmpty(fieldDetailsObj.minValue)) {
        //     formControlValidators.push(Validators.min(fieldDetailsObj.minValue) as any);
        // }
        // if (!this.isEmpty(fieldDetailsObj.maxValue)) {
        //     formControlValidators.push(Validators.max(fieldDetailsObj.maxValue) as any);
        // }
        return formControlValidators;
    }

    setFormGroupValidators(fieldDetailsObj: DisplayFields) {
        const formGroupValidators: any[] = [];
        // if (!this.isEmpty(fieldDetailsObj.minDateAndZoneValidator)) {
        //     const zoneAttrName = `${fieldDetailsObj.serviceAttrName}Zone`;
        //     formGroupValidators.push(MinDateZoneValidator(fieldDetailsObj.serviceAttrName, zoneAttrName));
        // }
        // if (!this.isEmpty(fieldDetailsObj.maxDateAndZoneValidator)) {
        //     const zoneAttrName = `${fieldDetailsObj.serviceAttrName}Zone`;
        //     formGroupValidators.push(MaxDateZoneValidator(fieldDetailsObj.serviceAttrName, zoneAttrName, fieldDetailsObj.maxDays));
        // }
        return formGroupValidators;
    }

    keyUpHandler() {
        this.updateFormState();
    }

    updateFormState() {
        this.dataObj.formGroup = this.formGroup;
        this.dataObj.formDataObj = this.constructFormDataObjectWithGivenForm(this.formGroup[this.formGroupNameStr]);
        this.dataObj.fieldsToDisplay = this.fieldsToDisplay;
        this.dataObj.isFormInvalid = this.validateFormFields(this.formGroup[this.formGroupNameStr]);
        this.dataObj.isFormPristine = this.formGroup[this.formGroupNameStr].pristine;
        this.dataObj.isFormUntouched = this.formGroup[this.formGroupNameStr].untouched;
        this.dataObjChange.emit(this.dataObj);
    }

    validateFormFields(formGroupsInfo: FormGroup): boolean {
        let formInvalid = false;
        Object.keys(formGroupsInfo.controls).forEach(fieldName => {
            this.fieldsToDisplay.forEach(fieldDetailsObj => {
                if (fieldDetailsObj.serviceAttrName === fieldName ||
                    fieldDetailsObj.serviceAttrName === this.getServiceAttrName(fieldName) ||
                    fieldDetailsObj.counterName === fieldName) {
                    // Dynamically Upadate validators of a particular Field if updateValidatorDynamic is set true
                    if (!this.isEmpty(fieldDetailsObj.updateValidatorDynamic)) {
                        const formControlValidators = this.setFormControlValidators(fieldDetailsObj);
                        this.formGroup[this.formGroupNameStr].controls[fieldDetailsObj.serviceAttrName]
                            .setValidators(formControlValidators);
                        this.formGroup[this.formGroupNameStr].controls[fieldDetailsObj.serviceAttrName]
                            .updateValueAndValidity();
                    }
                    if (!this.isEmpty(fieldDetailsObj.dependentField)) {
                        if (fieldDetailsObj?.dependentFieldValues?.includes(
                            this.formGroup[this.formGroupNameStr].controls[fieldDetailsObj.dependentField || '1'].value)) { // TODO
                            if (fieldDetailsObj.required &&
                                this.isEmpty(this.formGroup[this.formGroupNameStr].controls[fieldName].value)) {
                                formInvalid = true;
                            } else if (fieldDetailsObj.minValue &&
                                this.formGroup[this.formGroupNameStr].controls[fieldName].dirty &&
                                !this.isEmpty(this.formGroup[this.formGroupNameStr].controls[fieldName].value) &&
                                this.formGroup[this.formGroupNameStr].controls[fieldName].hasError('min')) {
                                formInvalid = true;
                            } else if (fieldDetailsObj.maxValue &&
                                this.formGroup[this.formGroupNameStr].controls[fieldName].dirty &&
                                !this.isEmpty(this.formGroup[this.formGroupNameStr].controls[fieldName].value) &&
                                this.formGroup[this.formGroupNameStr].controls[fieldName].hasError('max')) {
                                formInvalid = true;
                            } else if (fieldDetailsObj.maxlength &&
                                this.formGroup[this.formGroupNameStr].controls[fieldName].dirty &&
                                !this.isEmpty(this.formGroup[this.formGroupNameStr].controls[fieldName].value) &&
                                this.formGroup[this.formGroupNameStr].controls[fieldName].hasError('maxlength')) {
                                formInvalid = true;
                            }
                        }
                    } else if (fieldDetailsObj.required &&
                        this.isEmpty(this.formGroup[this.formGroupNameStr].controls[fieldName].value)) {
                        formInvalid = true;
                    } else if (fieldDetailsObj.alphaNumericValidator &&
                        !this.isEmpty(this.formGroup[this.formGroupNameStr].controls[fieldName].value) &&
                        this.formGroup[this.formGroupNameStr].controls[fieldName].hasError('not-alphanumeric')) {
                        formInvalid = true;
                    } else if (fieldDetailsObj.noWhitespaceValidator &&
                        !this.isEmpty(this.formGroup[this.formGroupNameStr].controls[fieldName].value) &&
                        this.formGroup[this.formGroupNameStr].controls[fieldName].hasError('whitespace')) {
                        formInvalid = true;
                    // Check error on FormGroup and set it to the FormControl to display the error in-line
                    } else if (fieldDetailsObj.minDateAndZoneValidator &&
                        !this.isEmpty(this.formGroup[this.formGroupNameStr].controls[fieldName].value) &&
                        this.formGroup[this.formGroupNameStr].hasError('mindate-error')) {
                        this.formGroup[this.formGroupNameStr].controls[fieldName].setErrors({'mindate-error': true});
                        formInvalid = true;
                    } else if (fieldDetailsObj.maxDateAndZoneValidator &&
                        !this.isEmpty(this.formGroup[this.formGroupNameStr].controls[fieldName].value) &&
                        this.formGroup[this.formGroupNameStr].hasError('maxdate-error')) {
                        this.formGroup[this.formGroupNameStr].controls[fieldName].setErrors({'maxdate-error': true});
                        formInvalid = true;
                    } else if (fieldDetailsObj.minValue &&
                        this.formGroup[this.formGroupNameStr].controls[fieldName].dirty &&
                        !this.isEmpty(this.formGroup[this.formGroupNameStr].controls[fieldName].value) &&
                        this.formGroup[this.formGroupNameStr].controls[fieldName].hasError('min')) {
                        formInvalid = true;
                    } else if (fieldDetailsObj.maxValue &&
                        this.formGroup[this.formGroupNameStr].controls[fieldName].dirty &&
                        !this.isEmpty(this.formGroup[this.formGroupNameStr].controls[fieldName].value) &&
                        this.formGroup[this.formGroupNameStr].controls[fieldName].hasError('max')) {
                        formInvalid = true;
                    } else if (fieldDetailsObj.type === 'email' &&
                        this.formGroup[this.formGroupNameStr].controls[fieldName].dirty &&
                        !this.isEmpty(this.formGroup[this.formGroupNameStr].controls[fieldName].value) &&
                        this.formGroup[this.formGroupNameStr].controls[fieldName].hasError('email')) {
                        formInvalid = true;
                    } else if (fieldDetailsObj.maxlength &&
                        this.formGroup[this.formGroupNameStr].controls[fieldName].dirty &&
                        !this.isEmpty(this.formGroup[this.formGroupNameStr].controls[fieldName].value) &&
                        this.formGroup[this.formGroupNameStr].controls[fieldName].hasError('maxlength')) {
                        formInvalid = true;
                    }
                    // Unset FormControl mindate error if already set and when FormGroup does not have mindate error
                    if (fieldDetailsObj.minDateAndZoneValidator &&
                        !this.isEmpty(this.formGroup[this.formGroupNameStr].controls[fieldName].value) &&
                        !this.formGroup[this.formGroupNameStr].hasError('mindate-error') &&
                        this.formGroup[this.formGroupNameStr].controls[fieldName].hasError('mindate-error')) {
                        this.formGroup[this.formGroupNameStr].controls[fieldName].setErrors({'mindate-error': false});
                        this.formGroup[this.formGroupNameStr].controls[fieldName].updateValueAndValidity();
                    }
                    // Unset FormControl maxdate error if already set and when FormGroup does not have maxdate error
                    if (fieldDetailsObj.maxDateAndZoneValidator &&
                        !this.isEmpty(this.formGroup[this.formGroupNameStr].controls[fieldName].value) &&
                        !this.formGroup[this.formGroupNameStr].hasError('maxdate-error') &&
                        this.formGroup[this.formGroupNameStr].controls[fieldName].hasError('maxdate-error')) {
                        this.formGroup[this.formGroupNameStr].controls[fieldName].setErrors({'maxdate-error': false});
                        this.formGroup[this.formGroupNameStr].controls[fieldName].updateValueAndValidity();
                    }
                }
            });
        });
        return formInvalid;
    }

    constructFormDataObjectWithGivenForm(formGroupsInfo: any, appendOnlyTouchedFields?: boolean, fieldsToExclude: Array<any> = []): any {
        const formObjectData: any = {};
        fieldsToExclude = Utility.isDefined(fieldsToExclude) ? fieldsToExclude : [];
        this.fieldsToDisplay.forEach(field => {
            if (this.isDefined(field.dependentField) &&
                !field.dependentFieldValues?.includes(this.formGroup[this.formGroupNameStr].controls[field.dependentField|| '1'].value)) { // TODO
                fieldsToExclude.push(field.serviceAttrName);
            }
            if (field.type === 'checkbox' &&
                this.isEmpty(formGroupsInfo.controls[field.serviceAttrName].value)) {
                formGroupsInfo.controls[field.serviceAttrName].value = false;
            }
        });
        Object.keys(formGroupsInfo.controls).forEach(fieldName => {
            // If appendOnlyTouchedFields is false then all the fields should be appended and dirty check should not be done
            // If appendOnlyTouchedFields is true then only the dirty fields should be appended
            // Apart from the above this field should not be present in the exclusions list
            if ((!appendOnlyTouchedFields || (appendOnlyTouchedFields && formGroupsInfo.controls[fieldName].dirty)) &&
                fieldsToExclude.indexOf(fieldName) === -1) {
                const formFieldValue = this.isEmpty(formGroupsInfo.controls[fieldName].value) ?
                    '' : formGroupsInfo.controls[fieldName].value;

                if (fieldName.indexOf('-') !== -1) {
                    const serviceAttrName = this.getServiceAttrName(fieldName);
                    const serviceAttrIndex = this.getServiceAttrIndex(fieldName);
                    if (formObjectData[serviceAttrName]) {
                        formObjectData[serviceAttrName].push({ label: formFieldValue, value: Number(serviceAttrIndex) });
                    } else {
                        formObjectData[serviceAttrName] = [];
                        formObjectData[serviceAttrName].push({ label: formFieldValue, value: Number(serviceAttrIndex) });
                    }
                } else {
                    formObjectData[fieldName] = formFieldValue;
                }
            }
        });
        return formObjectData;
    }

    setDataForFormFields(formGroupObj: FormGroup, dataObj: any, serverAttrMap?: any, fieldsToExclude?: Array<string>,
                         markAsDirty?: boolean): FormGroup {
        fieldsToExclude = !Utility.isDefined(fieldsToExclude) ? [] : fieldsToExclude;
        Object.keys(formGroupObj.controls).forEach(fieldName => {
            if (fieldsToExclude?.length === 0 || fieldsToExclude && fieldsToExclude.indexOf(fieldName) < 0) {
                let fieldValue = '';
                if (Utility.isDefined(serverAttrMap) && !this.isEmpty(serverAttrMap[fieldName])) {
                    fieldValue = dataObj[serverAttrMap[fieldName]];
                } else {
                    if (fieldName.indexOf('-') !== -1) {
                        const data = dataObj[this.getServiceAttrName(fieldName)];
                        const searchValue = this.getServiceAttrIndex(fieldName);
                        const found = data.find((datum: any) => {
                            return datum.value.toString() === searchValue;
                        });
                        fieldValue = found.label;
                    } else {
                        fieldValue = this.isEmpty(dataObj[fieldName]) ? '' : dataObj[fieldName];
                    }
                }
                formGroupObj.controls[fieldName].setValue(fieldValue);
                if (!this.isEmpty(fieldValue) && markAsDirty) {
                    formGroupObj.controls[fieldName].markAsDirty();
                }
            }
        });
        return formGroupObj;
    }

    addInputListItem(inputListItemName: string, dataObjElement: any[]) {
        let inputItemIndex = 0;
        if (dataObjElement.length > 0) {
            inputItemIndex = Math.max.apply(Math, dataObjElement.map(item => item.value)) + 1;
        }
        this.formGroup[this.formGroupNameStr].addControl(this.getInputListItemName(inputListItemName, inputItemIndex),
                new FormControl({ value: undefined, disabled: false } ));
        this.dataObj[inputListItemName].push({ label: '', value: inputItemIndex });
    }

    removeInputListItem(inputListItemName: string, dataObjElement: any) {
        const serviceAttrName = this.getServiceAttrName(inputListItemName);
        const serviceAttrIndex = Number(this.getServiceAttrIndex(inputListItemName));
        this.dataObj[serviceAttrName].forEach((inputItem: any, index: number) => {
            if (inputItem.value === serviceAttrIndex) {
                this.dataObj[serviceAttrName].splice(index, 1);
            }
        });

        this.formGroup[this.formGroupNameStr].removeControl(inputListItemName);
        this.formGroup[this.formGroupNameStr].markAsDirty();
        this.updateFormState();
    }

    createDynamicOptions(fieldDetailsObj: any) {
        if (this.isDefined(fieldDetailsObj.minValue) &&
            this.formGroup[this.formGroupNameStr].controls[fieldDetailsObj.counterName].hasError('min')) {
            return;
        }

        if (this.isDefined(fieldDetailsObj.maxValue) &&
            this.formGroup[this.formGroupNameStr].controls[fieldDetailsObj.counterName].hasError('max')) {
            return;
        }
        for (let index = 1; index <= this.formGroup[this.formGroupNameStr].controls[fieldDetailsObj.counterName].value; index++) {
            if (!this.formGroup[this.formGroupNameStr].get(this.getInputListItemName(fieldDetailsObj.serviceAttrName, index))) {
                this.formGroup[this.formGroupNameStr].addControl(this.getInputListItemName(fieldDetailsObj.serviceAttrName, index),
                        new FormControl({ value: undefined, disabled: false } ));
                this.dataObj[fieldDetailsObj.serviceAttrName].push({ label: '', value: index });
            }
            if (fieldDetailsObj.iconAttrName &&
                !this.formGroup[this.formGroupNameStr].get(this.getInputListItemName(fieldDetailsObj.iconAttrName, index))) {
                this.formGroup[this.formGroupNameStr].addControl(this.getInputListItemName(fieldDetailsObj.iconAttrName, index),
                        new FormControl({ value: undefined, disabled: false } ));
                this.dataObj[fieldDetailsObj.iconAttrName].push({ label: '', value: index });
            }
            if (fieldDetailsObj.iconColorAttrName &&
                !this.formGroup[this.formGroupNameStr].get(this.getInputListItemName(fieldDetailsObj.iconColorAttrName, index))) {
                this.formGroup[this.formGroupNameStr].addControl(this.getInputListItemName(fieldDetailsObj.iconColorAttrName, index),
                        new FormControl({ value: undefined, disabled: false } ));
                this.dataObj[fieldDetailsObj.iconColorAttrName].push({ label: '', value: index });
            }
        }
        const spliceIndex = this.formGroup[this.formGroupNameStr].controls[fieldDetailsObj.counterName].value;
        const spliceCount = this.dataObj[fieldDetailsObj.serviceAttrName].length -
            this.formGroup[this.formGroupNameStr].controls[fieldDetailsObj.counterName].value;

        this.dataObj[fieldDetailsObj.serviceAttrName].splice(spliceIndex, spliceCount);
        for (let index = this.formGroup[this.formGroupNameStr].controls[fieldDetailsObj.counterName].value + 1;
            index <= fieldDetailsObj.maxValue; index++) {
            if (this.formGroup[this.formGroupNameStr].get(this.getInputListItemName(fieldDetailsObj.serviceAttrName, index))) {
                this.formGroup[this.formGroupNameStr]
                .removeControl(this.getInputListItemName(fieldDetailsObj.serviceAttrName, index));
            }
            if (fieldDetailsObj.iconAttrName &&
                this.formGroup[this.formGroupNameStr].get(this.getInputListItemName(fieldDetailsObj.iconAttrName, index))) {
                this.formGroup[this.formGroupNameStr]
                .removeControl(this.getInputListItemName(fieldDetailsObj.iconAttrName, index));
            }
            if (fieldDetailsObj.iconColorAttrName &&
                this.formGroup[this.formGroupNameStr].get(this.getInputListItemName(fieldDetailsObj.iconColorAttrName, index))) {
                this.formGroup[this.formGroupNameStr]
                .removeControl(this.getInputListItemName(fieldDetailsObj.iconColorAttrName, index));
            }
        }
    }

    isEmpty(str: any): boolean {
        if (typeof str === 'undefined' || str === null || str === 'null' || str === 'undefined' || str === '' ||
            (typeof str === 'string' && str.trim() === '')) {
            return true;
        }
        return false;
    }

    isFormControlTouched(formControlObj: any): boolean {
        if (Utility.isDefined(formControlObj) && (formControlObj.touched || formControlObj.dirty)) {
            return true;
        }
        return false;
    }

    convertToBoolean(str: any): boolean {
        if (!this.isEmpty(str) && (str === true || (typeof str === 'string' && (str.toLowerCase() === 'true' ||
            str.toLowerCase() === 'yes')))) {
            return true;
        }
        return false;
    }

    isDefined(attribute: any): boolean {
        return Utility.isDefined(attribute);
    }

    isEmptyObject(obj: any) {
        return (obj && (Object.keys(obj).length === 0));
    }

    getInputListItemName(serviceAttrName: string, serviceAttrIndex: number) {
        return serviceAttrName + '-' + serviceAttrIndex;
    }

    getServiceAttrName(inputListItemName: string): string {
        return inputListItemName.split('-')[0];
    }

    getServiceAttrIndex(inputListItemName: string): string {
        return inputListItemName.split('-')[1];
    }

    updateColor(formControlObj: FormControl, color: any) {
        formControlObj.patchValue(color);
        formControlObj.markAsDirty();
    }

    syncWysiwygTabs(formControlObj: FormControl) {
        // setting the value to itself to force the wysiwyg editor and textarea to update to have the same content
        formControlObj.patchValue(formControlObj.value);
    }

    isShowDependentField(fieldDetailsObj: any) {
        return !Utility.isDefined(fieldDetailsObj.dependentField) || (Utility.isDefined(fieldDetailsObj.dependentField)) && fieldDetailsObj.dependentFieldValues.includes(this.formGroup[this.formGroupNameStr].controls[fieldDetailsObj.dependentField].value);
    }
}