import { FormGroup, ValidationErrors } from '@angular/forms';
import moment from 'moment-timezone';

export function MinDateZoneValidator(dateField: string, zoneField: string): ValidationErrors | null {
    return (group: FormGroup) => {
        try {
            const zoneValue = group.get(zoneField).value;
            const minDateValue = moment().tz(zoneValue).format('YYYY-MM-DDTHH:mm');
            const selectedDateValue = group.get(dateField).value;
            return moment(selectedDateValue).isSameOrAfter(minDateValue) ? null : { 'mindate-error': true };
        } catch (err) {
            return null;
        }
    };
}