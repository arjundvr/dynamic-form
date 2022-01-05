import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { NoWhitespaceValidator } from './validator/no-whitespace.validator';
import { AlphaNumericValidator } from './validator/alphanumeric.validator';
import { Utility } from './utility';
import { DisplayFields } from './model/dynamic-form.model';
import { BaseDynamicFormComponent } from '../dynamic-form/base-dynamic-form.component';


@Component({
    selector: 'app-profile',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss']
})
export class ProfileComponent extends BaseDynamicFormComponent {
    constructor() {
        super();
    }
    
}