import * as React from 'react';
import * as CommonFunctions from './common-functions';
import './css/InfoDiscArray.css';
import { FlowObjectDataArray } from '/Operational Data/Flow UI Custom Components/2019 Version/FlowComponentModel/src/FlowObjectDataArray';
import { FlowPage } from '/Operational Data/Flow UI Custom Components/2019 Version/FlowComponentModel/src/FlowPage';
import { IManywho } from '/Operational Data/Flow UI Custom Components/2019 Version/FlowComponentModel/src/interfaces';

declare const manywho: IManywho;

class InfoDiscArray extends FlowPage {

    constructor(props: any) {
        super(props);
        this.makeDisk = this.makeDisk.bind(this);
    }

    render() {

        const discs = [];

        if (this.loadingState === 'initial') { return null; }

        const exTypes: FlowObjectDataArray = this.fields[this.attributes.lookup.value].value as FlowObjectDataArray;

        const lookups: any = {};
        for (const item of exTypes.items) {
            lookups[item.properties['value'].value as string] = item;
        }

        for (const target of this.model.dataSource.items) {
            // target.properties.Amount is quantity
            // target.properties.ExerciseType ties to ExersiseTypes.value to get label and icon
            const icon = lookups[target.properties['ExerciseType'].value as string].properties['icon'].value;
            const label = lookups[target.properties['ExerciseType'].value as string].properties['label'].value;
            const color = lookups[target.properties['ExerciseType'].value as string].properties['color'].value;
            const bgcolor = lookups[target.properties['ExerciseType'].value as string].properties['bgcolor'].value;
            discs.push(this.makeDisk(icon , label, bgcolor, color, target.properties['Amount'].value as number, 50));
        }

        // discs.push(this.makeDisk('glyphicon glyphicon-euro', 'test', 'green', 75, 50));
        // discs.push(this.makeDisk('glyphicon glyphicon-wrench', 'cycling', 'blue', 35, 50));
        // discs.push(this.makeDisk('glyphicon glyphicon-wrench', 'cycling', 'blue', 35, 50));
        return (
        <div className="info-disc-array">
            <div className="info-disc-array-inner">
                {discs}
            </div>
        </div>
        );
    }

    makeDisk(icon: string, label: string, bgColor: string, color: string, pcComplete: number, width: number) {
        const outerStyle: React.CSSProperties = {};
        outerStyle.width = width + '%';
        outerStyle.height = outerStyle.width;

        const innerStyle: React.CSSProperties = {};
        innerStyle.backgroundColor = bgColor;
        innerStyle.color = color;

        let img: any;
        if (icon.startsWith('http')) {
            img = (<img src={icon} style={{width: '50px', height: '50px', marginLeft: 'auto', marginRight: 'auto'}}/>);
        } else {
            img = (<span className={icon} style={{verticalAlign: 'sub'}}/>);
        }
        return (
            <div className="info-disc-array-disc" >
                <div className="info-disc-array-disc-inner" style={innerStyle}>
                    <div className="info-disc-array-disc-label">
                        <span>{label}</span>
                    </div>
                    <div className="info-disc-array-disc-icon">
                        {img}
                    </div>

                    <div className="info-disc-array-disc-value">
                        {pcComplete}
                    </div>

                </div>
            </div>
        );
    }
}

manywho.component.register('InfoDiscArray', InfoDiscArray);

export default InfoDiscArray;
