import { eLoadingState, FlowComponent, FlowObjectData } from 'flow-component-model';
import * as React from 'react';
import CarouselTile from './CarouselTile';
import './css/Carousel.css';

declare const manywho: any;

export default class Carousel extends FlowComponent {

    constructor(props: any) {
        super(props);
        this.tileClicked = this.tileClicked.bind(this);
        this.tileDoubleClicked = this.tileDoubleClicked.bind(this);
    }

    async componentDidMount() {
        await super.componentDidMount();
        this.forceUpdate();
    }

    async tileClicked(selectedItem: FlowObjectData) {
        const outcome = this.getAttribute('onClick', null);
        if (outcome) {
            await this.setStateValue(selectedItem);
            await this.triggerOutcome(outcome);
        }
    }

    async tileDoubleClicked(selectedItem: FlowObjectData) {
        const outcome = this.getAttribute('onDoubleClick', null);
        if (outcome) {
            await this.setStateValue(selectedItem);
            await this.triggerOutcome(outcome);
        }
    }

    render() {

        const tiles: any[] = [];

        if (this.loadingState === eLoadingState.ready) {
            const idAttribute: string = this.getAttribute('idField', 'id');
            const titleAttribute: string = this.getAttribute('titleField', 'name');
            const descriptionAttribute: string = this.getAttribute('descriptionField', 'description');
            const imageAttribute: string = this.getAttribute('imageField', 'thumbnail');

            this.model.dataSource.items.forEach((item: FlowObjectData) => {
                tiles.push(
                    <CarouselTile
                        parent={this}
                        data={item}
                        id={item.properties[idAttribute].value as number}
                        title={item.properties[titleAttribute].value as string}
                        description={item.properties[descriptionAttribute].value as string}
                        image={item.properties[imageAttribute].value as string}
                    />,
                );
            });
        }

        return (
            <div
                className="carousel"
            >
                {tiles}
            </div>
        );
    }
}

manywho.component.register('Carousel', Carousel);
