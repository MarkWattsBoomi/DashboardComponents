import * as React from 'react';
import './css/TitleBar.css';
import { FlowComponent } from '/Operational Data/Flow UI Custom Components/2019 Version/FlowComponentModel/src/FlowComponent';
import { IManywho } from '/Operational Data/Flow UI Custom Components/2019 Version/FlowComponentModel/src/interfaces';

declare const manywho: IManywho;

class TitleBar extends FlowComponent {

    render() {

        const caption: string = this.getAttribute('title', 'title attribute missing');

        return (
        <div className="title-bar">
            <label className="title-bar-text">{caption}</label>
        </div>
        );
    }
}

manywho.component.register('TitleBar', TitleBar);

export default TitleBar;
