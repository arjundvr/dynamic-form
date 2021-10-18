import { AbstractControl, ValidationErrors } from '@angular/forms';

export function AlphaNumericValidator(control: AbstractControl): ValidationErrors | null {
    const isAlphaNumeric = /^[a-zA-Z0-9]*$/.test(control.value);
    return isAlphaNumeric ? null : { 'not-alphanumeric': true };
}