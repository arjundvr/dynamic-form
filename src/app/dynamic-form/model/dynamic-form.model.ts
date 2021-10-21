export interface DisplayFields {
    id: string;
    label: string;
    placeholder?: string;
    required?: boolean;
    type: string;
    disabled?: boolean;
    value?: string;
    minlength?: number;
    maxlength?: number;
    length?: number;
    serviceAttrName: any;
    dependentField?: string;
    readOnly?: boolean;
    dependentFieldValues?: string[];
    minValue?: number;
    maxValue?: number;
    minRows?: number;
    maxRows?: number;
    minDueDate?: any;
    noWhitespaceValidator?: boolean;
    alphaNumericValidator?: boolean;
    minDateAndZoneValidator?: boolean; // min date and corresponding timezone validator
    maxDays?: number; // Mandatory when maxDateAndZoneValidator is set true; number of days ahead that is allowed
    maxDateAndZoneValidator?: boolean;
    minDate?: string; // date picker controlling min date
    maxDate?: string; // date picker controlling max date
    counterName?: any;
    updateValidatorDynamic?: boolean;
    iconAttrName?: string;
    iconColorAttrName?: string;
    options?: DisplayFieldOptions[];
    hideTabs?: boolean;
    activeTab?: number;
    dropdownValues?: any;
}

export interface DisplayFieldOptions {
    label: string;
    value: number;
}
