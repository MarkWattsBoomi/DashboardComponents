import * as React from 'react';
import { eContentType } from '/Operational Data/Flow UI Custom Components/2019 Version/FlowComponentModel/src/FlowField';
import { FlowObjectData } from '/Operational Data/Flow UI Custom Components/2019 Version/FlowComponentModel/src/FlowObjectData';
import { FlowPage } from '/Operational Data/Flow UI Custom Components/2019 Version/FlowComponentModel/src/FlowPage';

export function makeDisplayValue(value: string, type: string): JSX.Element {
    switch (type.toLowerCase()) {
        case 'date':
            return (<span>{value}</span>);

        case 'currency':
            const val = parseInt(value);
            const v = '€' + val.toLocaleString('es-ES', {minimumFractionDigits: 2});
            return (<span>{v}</span>);
            '213.245,00';

        case 'hyperlink':
            return <a href={value} target="_blank">{value}</a>;

        default:
            return (<span>{value}</span>);
    }

    return (<span></span>);
}

// this takes a string containing either a literal value or the name of a field surrounded with {{..}}
// if it's literal it just returns otherwise it gets the value.
// it can go down levels like val.attribute.subval etc
export function calculateValue(parent: FlowPage, value: string): string {
    if (value.startsWith('{{') && value.endsWith('}}')) {
        // value points to a field, get it's value
        let stripped: string = value.replace('{{', '');
        stripped = stripped.replace('}}', '');

        let val: any;
        let result: string = '';
        const strippedBits: string[] = stripped.split('.');

        for (let pos = 0 ; pos < strippedBits.length ; pos++) {
            if (pos === 0) {
                val = (parent as FlowPage).fields[strippedBits[pos]];
                if (val.ContentType !== eContentType.ContentObject && val.ContentType !== eContentType.ContentList) {
                result = val.value as string;
                }
            } else {
                const ele = (val.value as FlowObjectData).properties[strippedBits[pos]];
                if (ele.contentType === eContentType.ContentObject || ele.contentType === eContentType.ContentList) {
                    val = (val.value as FlowObjectData).properties[strippedBits[pos]].value;
                } else {
                    result = (val.value as FlowObjectData).properties[strippedBits[pos]].value as string;
                }
            }
        }
        return result;
    } else {
        return value;
    }
}
