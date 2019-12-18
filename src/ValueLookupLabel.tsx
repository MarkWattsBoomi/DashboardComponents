import { FlowComponent } from 'flow-component-model';
import * as React from 'react';
import './css/ValueLookupLabel.css';

declare const manywho: any;

class ValueLookupLabel extends FlowComponent {

    constructor(props: any) {
        super(props);
    }

    render() {

        // get buttons
        const state: string = (this.getStateValue() as string).toLowerCase();
        let label: string = '';
        for (const item of this.model.dataSource.items) {
            if (state === item.properties['value'].value as string) {
                label = item.properties['label'].value as string;
                break;
            }
        }

        return (
        <div className="value-lookup">
            <span className="value-lookup-span">{label}</span>
        </div>
        );
    }
}

manywho.component.register('ValueLookupLabel', ValueLookupLabel);

export default ValueLookupLabel;
