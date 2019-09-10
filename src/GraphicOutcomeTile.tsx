import * as React from 'react';
import './css/GraphicOutcomeTile.css';
import { FlowComponent } from '/Operational Data/Flow UI Custom Components/2019 Version/FlowComponentModel/src/FlowComponent';
import { IManywho } from '/Operational Data/Flow UI Custom Components/2019 Version/FlowComponentModel/src/interfaces';

declare const manywho: IManywho;

class GraphicOutcomeTile extends FlowComponent {

    constructor(props: any) {
        super(props);
        this.clicked = this.clicked.bind(this);
    }

    async clicked() {
        const outcome = this.getAttribute('outcome', null);
        if (outcome) {
            await this.triggerOutcome(outcome);
        }
    }

    render() {

        const label: string = this.getAttribute('title', 'Add title attribute');
        const text: string = this.getAttribute('text', 'Add text attribute');
        const image: string = this.getAttribute('image', 'add image attribute');
        const tooltip: string = this.getAttribute('tooltip', label);
        return (
            <div
                className="graphic-outcome-tile"
                onClick={this.clicked}
                title={tooltip}
            >
                <div
                    className="graphic-outcome-tile-top"
                >
                    <img className="graphic-outcome-tile-img" src={image} />
                </div>
                <div
                    className="graphic-outcome-tile-bottom"
                >
                    <div>
                        <span className="graphic-outcome-tile-title">{label}</span>
                    </div>
                    <div>
                        <span className="graphic-outcome-tile-body">{text}</span>
                    </div>
                </div>
            </div>
        );
    }
}

manywho.component.register('GraphicOutcomeTile', GraphicOutcomeTile);

export default GraphicOutcomeTile;
