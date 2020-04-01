import { FlowComponent } from 'flow-component-model';
import * as React from 'react';
import Carousel from './Carousel';
import './css/Carousel.css';

declare const manywho: any;

export default class CarouselTile extends React.Component<any, any> {

    constructor(props: any) {
        super(props);
        this.clicked = this.clicked.bind(this);
    }

    async clicked(e: any) {
        e.preventDefault();
        e.stopPropagation();
        const carousel: Carousel =  this.props.parent;

        if (e.ctrlKey === true && e.shiftKey === true) {
            await carousel.tileDoubleClicked(this.props.data);
        } else {
            await carousel.tileClicked(this.props.data);
        }

    }

    render() {
        let label: string;
        let text: string;
        let image: string;
        let tooltip: string;

        label = this.props.title;
        text = this.props.description;
        image = this.props.image;
        tooltip = label;

        return (
            <div
                className="carousel-tile"
                onClick={this.clicked}
                title={tooltip}
            >
                <div
                    className="carousel-tile-top"
                >
                    <img className="carousel-tile-img" src={image} />
                </div>
                <div
                    className="carousel-tile-bottom"
                >
                    <div
                        style={{display: 'flex'}}
                    >
                        <span className="carousel-tile-title">{label}</span>
                    </div>
                    <div
                        style={{display: 'flex'}}
                    >
                        <span className="carousel-tile-body">{text}</span>
                    </div>
                </div>
            </div>
        );
    }
}
