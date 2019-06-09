import * as React from 'react';
import './css/ImageButtonRow.css';
import { FlowComponent } from './models/FlowComponent';
import { IManywho } from './models/interfaces';

declare const manywho: IManywho;

class ImageButtonRow extends FlowComponent {

    constructor(props: any) {
        super(props);
        this.buttonClicked = this.buttonClicked.bind(this);
    }

    buttonClicked(value: string) {
        this.setStateValue(value);
        this.forceUpdate();
    }

    render() {

        // get buttons
        const buttons: JSX.Element[] = [];
        const selected: string = this.getStateValue() as string;
        for (const button of this.model.dataSource.items) {
            let cls: string = 'image-button-row-button';
            if (selected === button.properties['value'].value) {
                cls += ' image-button-row-button-selected';
            }
            buttons.push(
                <div
                    className={cls}
                    title={button.properties['tooltip'].value as string}
                    onClick={(e) => {this.buttonClicked(button.properties['value'].value as string); }}>
                    <img
                        className="image-button-row-button-icon"
                        src={button.properties['icon'].value as string}
                    />
                    <span className="image-button-row-button-label">{button.properties['label'].value}</span>

            </div>,
            );
        }

        return (
        <div className="image-button-row">
            {buttons}
        </div>
        );
    }
}

manywho.component.register('ImageButtonRow', ImageButtonRow);

export default ImageButtonRow;
