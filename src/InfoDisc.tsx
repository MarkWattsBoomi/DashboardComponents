import { FlowComponent, FlowField, FlowObjectData } from 'flow-component-model';
import * as React from 'react';
import * as CommonFunctions from './common-functions';
import './css/InfoDisc.css';

declare const manywho: any;

class InfoDisc extends FlowComponent {

    render() {

        let icon: string = 'euro';
        if (this.attributes.icon && this.attributes.icon.value && this.attributes.icon.value.length > 0) {
            icon = this.attributes.icon.value;
        }
        icon = 'glyphicon glyphicon-' + icon;

        const style: React.CSSProperties = {};

        if (this.model.width && this.model.width > 0) {
            style.width = this.model.width;
        }

        if (this.model.height && this.model.height > 0) {
            style.height = this.model.height;
        }

        if (this.attributes.color && this.attributes.color.value && this.attributes.color.value.length > 0) {
            style.color = this.attributes.color.value;
        }
        if (this.attributes.backgroundColor && this.attributes.backgroundColor.value && this.attributes.backgroundColor.value.length > 0) {
            style.backgroundColor = this.attributes.backgroundColor.value;
        }

        let value: JSX.Element;
        let label: string = '';

        if (this.attributes.state) {
            const state: FlowField = this.fields[this.attributes.state.value];
            if (state) {
                if (this.fields[(state.value as FlowObjectData).properties.Value.value as string]) {

                    const val: string = this.fields[(state.value as FlowObjectData).properties.Value.value as string].value as string;
                    const typ: string = (state.value as FlowObjectData).properties.Label.value as string;
                    value = CommonFunctions.makeDisplayValue(val, typ);
                } else {
                    value = <span>{(state.value as FlowObjectData).properties.Value.value as string}</span>;
                }

                label = (state.value as FlowObjectData).properties.Label.value as string;
            }
        }

        return (
        <div className="info-disk">
            <div className="info-disk-inner" style={style}>
                <div className="info-disk-icon">
                    <span className={icon}/>
                </div>
                <div className="info-disk-value">
                    {value}
                </div>
                <div className="info-disk-label">
                    <span>{label}</span>
                </div>
            </div>
        </div>
        );
    }
}

manywho.component.register('InfoDisc', InfoDisc);

export default InfoDisc;
