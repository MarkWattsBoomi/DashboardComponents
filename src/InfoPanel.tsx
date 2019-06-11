import * as React from 'react';
import * as CommonFunctions from './common-functions';
import './css/InfoPanel.css';
import { FlowComponent } from '/Operational Data/Flow UI Custom Components/2019 Version/FlowComponentModel/src/FlowComponent';
import { FlowField } from '/Operational Data/Flow UI Custom Components/2019 Version/FlowComponentModel/src/FlowField';
import { FlowObjectData } from '/Operational Data/Flow UI Custom Components/2019 Version/FlowComponentModel/src/FlowObjectData';
import { FlowObjectDataArray } from '/Operational Data/Flow UI Custom Components/2019 Version/FlowComponentModel/src/FlowObjectDataArray';
import { IManywho } from '/Operational Data/Flow UI Custom Components/2019 Version/FlowComponentModel/src/interfaces';

declare const manywho: IManywho;

class InfoPanel extends FlowComponent {

    render() {

        let icon: string = 'euro';
        if (this.attributes.icon && this.attributes.icon.value && this.attributes.icon.value.length > 0) {
            icon = this.attributes.icon.value;
        }
        icon = 'glyphicon glyphicon-' + icon;

        let title: string = '';
        const primaryLabel: string = '';
        const primaryValue: string = '';
        const secondaryItems: JSX.Element[] = [];

        if (this.attributes.state) {
            const state: FlowField = this.fields[this.attributes.state.value];
            if (state) {
                title = (state.value as FlowObjectData).properties.Label.value as string;
                const secondary: FlowObjectDataArray = (state.value as FlowObjectData).properties.Values.value as FlowObjectDataArray;
                if (secondary && secondary.items.length > 0) {
                    for (const item of secondary.items) {
                        let value: string = '';
                        if (this.fields[item.properties.Value.value as string]) {
                            value = this.fields[item.properties.Value.value as string].value as string;
                        } else {
                            value = item.properties.Value.value as string;
                        }
                        secondaryItems.push(
                            <div className="info-panel-secondary-bar">
                                <div className="info-panel-secondary-bar-label">
                                    <span>{item.properties.Label.value}</span>
                                </div>
                                <div className="info-panel-secondary-bar-value">
                                    {CommonFunctions.makeDisplayValue(value, item.properties.Type.value as string)}
                                </div>
                            </div>);
                    }
                }
            }
        }

        const style: React.CSSProperties = {};

        if (this.model.width && this.model.width > 0) {
            style.width = this.model.width;
            style.maxWidth = this.model.width;
        }

        if (this.model.height && this.model.height > 0) {
            style.height = this.model.height;
            style.maxHeight = this.model.height;
        }

        return (
        <div className="info-panel" style={style}>
            <div className="info-panel-title-bar">
                <div className="info-panel-title-bar-icon">
                    <span className={icon}/>
                </div>
                <div className="info-panel-title-bar-title">
                    <span>{title}</span>
                </div>
            </div>
            <div className="info-panel-secondary-bars">
                {secondaryItems}
            </div>
        </div>
        );
    }
}

manywho.component.register('InfoPanel', InfoPanel);

export default InfoPanel;
