import { FlowComponent } from 'flow-component-model';
import * as React from 'react';
import './css/TitleBar.css';

declare const manywho: any;

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
