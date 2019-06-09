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
