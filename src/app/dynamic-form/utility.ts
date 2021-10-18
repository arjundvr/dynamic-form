// import * as MobileDetect from 'mobile-detect';
// import gradstop from 'gradstop';
// import { FilterEvent } from '../_models/index';
// import { MediaChange } from '@angular/flex-layout';

export class Utility {
    // private static md = new MobileDetect(window.navigator.userAgent);
    // public static isMobile = !!Utility.md.mobile();

    // from: https://stackoverflow.com/a/901144
    // public static getParameterByName(name: string, url = window.location.href) {
    //     name = name.replace(/[\[\]]/g, '\\$&');
    //     const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
    //     const results = regex.exec(url);
    //     if (!results) {
    //         return;
    //     }
    //     if (!results[2]) {
    //         return '';
    //     }
    //     return decodeURIComponent(results[2].replace(/\+/g, ' '));
    // }

    // public static getPathParameter(url, parameter) {
    //     let value;
    //     const pos = url.indexOf(parameter);
    //     if (pos > -1) {
    //         const segment = url.substring(pos).split('/');
    //         if (segment.length > 0) {
    //             value = segment[1];
    //         }
    //     }
    //     return value;
    // }

    public static isDefined(attribute: any): boolean {
        if (typeof attribute === 'undefined' || attribute === null || attribute === 'null') {
            return false;
        }
        return true;
    }

    public static isEmptyObject(obj: any) {
        return !this.isDefined(obj) || (obj && (Object.keys(obj).length === 0));
    }

    public static isEmpty(str: any): boolean {
        if (typeof str === 'undefined' || str === null || str === 'null' || str === 'undefined' || str === '' ||
            (typeof str === 'string' && str.trim() === '')) {
            return true;
        }
        return false;
    }

    // Convert input timestamp to End of Day timestamp
    // Add 23:59:59 HRS
    // public static convertTimetoEOD(date) {
    //     return new Date(date.getTime() + ( 1000 * 59 ) + ( 1000 * 60 * 59 ) + ( 1000 * 60 * 60 * 23 ));
    // }

    public static getTodaySOD() {
        const today = new Date();
        today.setHours( 0, 0, 0, 0 );
        return today;
    }

    public static getTodayEOD() {
        const today = new Date();
        today.setHours( 23, 59, 59, 0 );
        return today;
    }

    public static getLastYearSOD() {
        const lastYear = new Date().getFullYear() - 1;
        const date = this.getTodaySOD();
        date.setUTCDate(1);
        date.setMonth(0);
        date.setFullYear(lastYear);
        return date;
    }

    public static getLastYearEOD() {
        const lastYear = new Date().getFullYear() - 1;
        const date = this.getTodayEOD();
        date.setMonth(11);
        date.setFullYear(lastYear);
        date.setUTCDate(32);
        return date;
    }

    public static getCurrentYearSOD() {
        const date = this.getTodaySOD();
        date.setUTCDate(1);
        date.setMonth(0);
        return date;
    }

    // public static setUrlParam(filterList: FilterEvent[]) {
    //     const params: any = {};
    //     filterList.forEach(filter => {
    //         if (!params[filter.key]) {
    //             params[filter.key] = filter.value;
    //         } else {
    //             params[filter.key] = params[filter.key] + ',' + filter.value;
    //         }
    //     });
    //     return { queryParams: params };
    // }

    // public static getColorSpectrum(color: string, numColorStops: number, reverse: boolean): Array<string> {
    //     const colorSpectrum = [color, '#dfdfdf'];
    //     // calculate color stops - calculate one additional color stop and then remove it
    //     // to ensure spectrum of colors are shades of the given color
    //     let colorStops = gradstop({
    //         stops: numColorStops + 1,
    //         inputFormat: 'hex',
    //         colorArray: colorSpectrum
    //     });

    //     // remove last color stop since it's not a shade of the given color
    //     colorStops = colorStops.slice(0, numColorStops);

    //     // reverse spectrum if requested
    //     if (reverse) {
    //         colorStops = colorStops.reverse();
    //     }
    //     return colorStops;
    // }

    // get ratings colorcode range
    // public static getRatingsColorCodeRange(questionLength, ratingsPalette) {
    //     let colorArray = [ratingsPalette.positive];
    //     if (questionLength > 1) {
    //         const colorStops = Math.trunc(questionLength / 2);
    //         const colorArrayLeft = Utility.getColorSpectrum(ratingsPalette.negative, colorStops, false);
    //         const colorArrayRight = Utility.getColorSpectrum(ratingsPalette.positive, colorStops, true);
    //         if (questionLength % 2 === 0) {
    //             colorArray = [...colorArrayLeft, ...colorArrayRight];
    //         } else {
    //             colorArray = [...colorArrayLeft, ratingsPalette.neutral, ...colorArrayRight];
    //         }
    //     }
    //     return colorArray;
    // }

    // public static getRatingsEmojiDefaultColorCodes(questionLength) {
    //     // tslint:disable-next-line: member-ordering
    //     const colorsDataSet = {
    //         'emoji-0': '#BF110E',
    //         'emoji-1': '#DD423C',
    //         'emoji-2': '#FF671F',
    //         'emoji-3': '#F39E10',
    //         'emoji-4': '#A0D16D',
    //         'emoji-5': '#00AF66',
    //         'emoji-6': '#006F41',
    //     };
    //     let colorRangeArray = [];
    //     switch (questionLength) {
    //         case 2: {
    //             colorRangeArray = [colorsDataSet['emoji-1'], colorsDataSet['emoji-5']];
    //             break;
    //         }
    //         case 3 : {
    //             colorRangeArray = [colorsDataSet['emoji-1'], colorsDataSet['emoji-3'], colorsDataSet['emoji-5']];
    //             break;
    //         }
    //         case 4 : {
    //             colorRangeArray = [colorsDataSet['emoji-1'], colorsDataSet['emoji-2'], colorsDataSet['emoji-4'], colorsDataSet['emoji-5']];
    //             break;
    //         }
    //         case 5 : {
    //             colorRangeArray = [
    //                 colorsDataSet['emoji-1'],
    //                 colorsDataSet['emoji-2'],
    //                 colorsDataSet['emoji-3'],
    //                 colorsDataSet['emoji-4'],
    //                 colorsDataSet['emoji-5']
    //             ];
    //             break;
    //         }
    //         case 6 : {
    //             colorRangeArray = [
    //                 colorsDataSet['emoji-0'],
    //                 colorsDataSet['emoji-1'],
    //                 colorsDataSet['emoji-2'],
    //                 colorsDataSet['emoji-4'],
    //                 colorsDataSet['emoji-5'],
    //                 colorsDataSet['emoji-6']
    //             ];
    //             break;
    //         }
    //         case 7 : {
    //             colorRangeArray = colorRangeArray = [
    //                 colorsDataSet['emoji-0'],
    //                 colorsDataSet['emoji-1'],
    //                 colorsDataSet['emoji-2'],
    //                 colorsDataSet['emoji-3'],
    //                 colorsDataSet['emoji-4'],
    //                 colorsDataSet['emoji-5'],
    //                 colorsDataSet['emoji-6']
    //             ];
    //             break;
    //         }
    //     }
    //     return colorRangeArray;
    // }

    // // get ratings colorcode
    // public static getRatingsColorCode(question, ratingsPalette) {
    //     const colorArray = this.getRatingsColorCodeRange(question.maxRatingsValue, ratingsPalette);
    //     const selectedValueStyleColor = colorArray[question.response.value - 1] ?
    //         colorArray[question.response.value - 1] : ratingsPalette.default;

    //     return selectedValueStyleColor;
    // }

    // public static getBreakPoint(change: MediaChange[]) {
    //     if (change && change.length > 0) {
    //         const standardBreakpoint = change.find(r =>
    //             r.mqAlias === 'xs' || r.mqAlias === 'sm' || r.mqAlias === 'md' || r.mqAlias === 'lg' || r.mqAlias === 'xl');
    //         if (standardBreakpoint) {
    //             return standardBreakpoint;
    //         }
    //         return change[0];
    //     } else {
    //         return null;
    //     }
    // }

    public static getNumberDays(minutes: number): number {
        return Math.floor(minutes / 24 / 60);

    }

    public static getNumberHours(minutes: number): number {
        return Math.floor(minutes / 60 % 24);

    }

    public static getNumberMinutes(minutes: number): number {
        return Math.floor(minutes % 60);
    }

    public static calculateMinutes(days: number, hours: number, minutes: number): number {
        return (days * 24 * 60) + (hours * 60) + minutes;
    }
}