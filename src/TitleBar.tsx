import * as React from 'react';
import * as CommonFunctions from './common-functions';
import './css/TitleBar.css';
import { FlowComponent } from './models/FlowComponent';
import { IManywho } from './models/interfaces';

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
