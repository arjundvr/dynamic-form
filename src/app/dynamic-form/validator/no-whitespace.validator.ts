// based on: https://www.jokecamp.com/blog/angular-whitespace-validator-directive/#validator

import { AbstractControl, ValidationErrors } from '@angular/forms';

export function NoWhitespaceValidator(control: AbstractControl): ValidationErrors | null {
    const isWhitespace = (control.value || '').trim().length === 0;
    return isWhitespace ? { 'whitespace': true } : null;
}