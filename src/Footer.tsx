import { eLoadingState, FlowPage } from 'flow-component-model';
import * as React from 'react';
import { calculateValue } from './common-functions';
import './css/Common.css';
import './css/Footer.css';

declare const manywho: any;

class Footer extends FlowPage {

    waitSpinner = 'https://media.giphy.com/media/6Egwsh5J2kvhmXALVu/giphy.gif';

    constructor(props: any) {
        super(props);
    }

    async componentDidMount() {
        await super.componentDidMount();
        this.forceUpdate();
    }

    render() {
        if (this.loadingState === eLoadingState.ready) {
           // const queueGroups = this.values.filter((value: Value) => value.stateValue.developerName === 'UserQueues')[0];
            // const queueItems = this.values.filter((value: Value) => value.stateValue.developerName === 'QueueItems')[0];
            // const queueItemRequest = this.values.filter((value: Value) => value.stateValue.developerName === 'QueueItemRequest')[0];
            const text: string = calculateValue(this, this.getAttribute('title', '© Boomi Flow 2019'));
            return (
                <div className="footer">
                <span className="footer-text">{text}</span>
            </div>
                    );
        } else {
            return (
                    <div className="footer"/>
                );
        }
    }

}

manywho.component.register('Footer', Footer);

export default Footer;
