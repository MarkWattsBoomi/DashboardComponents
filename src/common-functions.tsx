import { eContentType, FlowObjectData, FlowPage } from 'flow-component-model';
import * as React from 'react';

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
// NOTE: there's a good chance timing wise that there are no fields yet
//       so we just return value if any errors are encountered like val === null
export function calculateValue(parentPage: FlowPage, value: string): string {
    // is it replaceable?  starts and ends with {{}}
    if (value.startsWith('{{') && value.endsWith('}}')) {
        // value points to a field, get it's value
        let stripped: string = value.replace('{{', '');
        stripped = stripped.replace('}}', '');

        let val: any;
        let result: string = '';
        // it could be a sub field with parent.child
        const strippedBits: string[] = stripped.split('.');

        // loop over bits
        for (let pos = 0 ; pos < strippedBits.length ; pos++) {
            // pos 0 will set val for any child elements
            if (pos === 0) {
                val = (parentPage as FlowPage).fields[strippedBits[pos]];
                if (!val) {
                    console.log('The Value [' + strippedBits[pos] + '] was not found, have you included it in your flow');
                    result = value;
                } else {
                    if (val.ContentType !== eContentType.ContentObject && val.ContentType !== eContentType.ContentList) {
                    result = val.value as string;
                    }
                }
            } else {
                // did bits 0 get a val?
                if (val) {
                    const ele = (val.value as FlowObjectData).properties[strippedBits[pos]];
                    if (ele) {
                        if (ele.contentType === eContentType.ContentObject || ele.contentType === eContentType.ContentList) {
                            val = (val.value as FlowObjectData).properties[strippedBits[pos]].value;
                        } else {
                            result = (val.value as FlowObjectData).properties[strippedBits[pos]].value as string;
                        }
                    } else {
                        result = value;
                    }
                } else {
                    result = value;
                }
            }
        }
        return result;
    } else {
        return value;
    }
}
