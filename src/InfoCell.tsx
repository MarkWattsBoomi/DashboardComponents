import * as React from 'react';
import * as CommonFunctions from './common-functions';
import './css/InfoCell.css';
import {FlowComponent} from '/Operational Data/Flow UI Custom Components/2019 Version/FlowComponentModel/src/FlowComponent';
import { IManywho } from '/Operational Data/Flow UI Custom Components/2019 Version/FlowComponentModel/src/interfaces';

import { FlowField } from '/Operational Data/Flow UI Custom Components/2019 Version/FlowComponentModel/src/FlowField';
import { FlowObjectData } from '/Operational Data/Flow UI Custom Components/2019 Version/FlowComponentModel/src/FlowObjectData';
import { FlowObjectDataArray } from '/Operational Data/Flow UI Custom Components/2019 Version/FlowComponentModel/src/FlowObjectDataArray';

declare const manywho: IManywho;

class InfoCell extends FlowComponent {

    render() {

        let icon: string = 'euro';
        if (this.attributes.icon && this.attributes.icon.value && this.attributes.icon.value.length > 0) {
            icon = this.attributes.icon.value;
        }
        icon = 'glyphicon glyphicon-' + icon;

        let title: string = '';
        let primaryLabel: string = '';
        let primaryValue: JSX.Element;
        let value: string = '';
        const secondaryItems: JSX.Element[] = [];

        if (this.attributes.state) {
            const state: FlowField = this.fields[this.attributes.state.value];
            if (state) {
                title = (state.value as FlowObjectData).properties.Label.value as string;
                const primary: FlowObjectData = (state.value as FlowObjectData).properties.PrimaryValue.value as FlowObjectData;
                primaryLabel = primary.properties.Label.value as string;
                if (this.fields[primary.properties.Value.value as string]) {
                    value = this.fields[primary.properties.Value.value as string].value as string;
                } else {
                    value = primary.properties.Value.value as string;
                }
                primaryValue = CommonFunctions.makeDisplayValue(value as string, primary.properties.Type.value as string);

                const secondary: FlowObjectDataArray = (state.value as FlowObjectData).properties.SecondaryValues.value as FlowObjectDataArray;
                if (secondary && secondary.items.length > 0) {
                    for (const item of secondary.items) {

                        if (this.fields[item.properties.Value.value as string]) {
                            value = this.fields[item.properties.Value.value as string].value as string;
                        } else {
                            value = item.properties.Value.value as string;
                        }
                        secondaryItems.push(
                            <div className="info-cell-secondary-bar">
                                <div className="info-cell-secondary-bar-label">
                                    <span>{item.properties.Label.value}</span>
                                </div>
                                <div className="info-cell-secondary-bar-value">
                                    {CommonFunctions.makeDisplayValue(value as string, item.properties.Type.value as string)}
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
        <div className="info-cell" style={style}>
            <div className="info-cell-title-bar">
                <div className="info-cell-title-bar-icon">
                    <span className={icon}/>
                </div>
                <div className="info-cell-title-bar-title">
                    <span>{title}</span>
                </div>
            </div>
            <div className="info-cell-primary-bar">
                <div className="info-cell-primary-bar-label">
                    <span>{primaryLabel}</span>
                </div>
                <div className="info-cell-primary-bar-value">
                    {primaryValue}
                </div>
            </div>
            <div className="info-cell-secondary-bars">
                {secondaryItems}
            </div>
        </div>
        );
    }
}

manywho.component.register('InfoCell', InfoCell);

export default InfoCell;
