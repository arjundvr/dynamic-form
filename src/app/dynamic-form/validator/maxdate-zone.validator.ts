import { FormGroup, ValidationErrors } from '@angular/forms';
import moment from 'moment-timezone';

export function MaxDateZoneValidator(dateField: string, zoneField: string, maxDate: number): ValidationErrors | null {
    return (group: FormGroup) => {
        try {
            const zoneValue = group.get(zoneField).value;
            const maxDateValue = moment().tz(zoneValue).add(maxDate, 'days').format('YYYY-MM-DDTHH:mm');
            const selectedDateValue = group.get(dateField).value;
            return moment(maxDateValue).isSameOrAfter(selectedDateValue) ? null : { 'maxdate-error': true };
        } catch (err) {
            return null;
        }
    };
}