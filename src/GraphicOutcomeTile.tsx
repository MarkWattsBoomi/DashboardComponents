import { FlowComponent } from 'flow-component-model';
import * as React from 'react';
import './css/GraphicOutcomeTile.css';

declare const manywho: any;

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
        let label: string;
        let text: string;
        let image: string;
        let tooltip: string;

        if (this.props.inCarousel !== true) {
            label = this.getAttribute('title', 'Add title attribute');
            text = this.getAttribute('text', 'Add text attribute');
            image = this.getAttribute('image', 'add image attribute');
            tooltip = this.getAttribute('tooltip', label);
        } else {
            label = this.props.title;
            text = this.props.description;
            image = this.props.image;
            tooltip = label;
        }

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
