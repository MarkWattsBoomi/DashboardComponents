import { eContentType, eLoadingState, FlowComponent, FlowObjectData, FlowObjectDataArray, FlowObjectDataProperty} from 'flow-component-model';
import * as React from 'react';
import '../css/Breadcrumbs.css';
import Breadcrumb from './Breadcrumb';
import { BreadcrumbEvent } from './BreadcrumbEvent';
import BreadcrumbHistory from './BreadcrumbHistory';
import BreadcrumbMore from './BreadcrumbMore';
import BreadcrumbSpacer from './BreadcrumbSpacer';

declare const manywho: any;

if (! sessionStorage['breadcrumb']) {
    // (manywho as any).eventManager.history = [];
    if (!sessionStorage['breadcrumbs']) {
        const breadcrumb: BreadcrumbEvent = new BreadcrumbEvent('init', 'init', 'INIT');
        const breadcrumbs: BreadcrumbEvent[] = [];
        breadcrumbs.push(breadcrumb);
        sessionStorage['breadcrumbs'] = JSON.stringify(breadcrumbs);
    }

    (manywho as any).eventManager.addBeforeSendListener(moveGoingToHappen, 'breadcrumb');
    (manywho as any).eventManager.addDoneListener(moveHappened, 'breadcrumb');
}

function moveGoingToHappen(xhr: any, request: any) {
    const breadcrumb: BreadcrumbEvent = new BreadcrumbEvent(request.currentMapElementId, request.currentMapElementId, 'LEAVE');
    // (manywho as any).eventManager.history.push(breadcrumb);
    const breadcrumbs: BreadcrumbEvent[] = JSON.parse(sessionStorage['breadcrumbs']);
    breadcrumbs.push(breadcrumb);
    sessionStorage['breadcrumbs'] = JSON.stringify(breadcrumbs);
}

function moveHappened(xhr: any, request: any) {
    if ((xhr as any).invokeType === 'FORWARD') {
        const breadcrumb: BreadcrumbEvent = new BreadcrumbEvent((xhr as any).mapElementInvokeResponses[0].mapElementId, (xhr as any).mapElementInvokeResponses[0].developerName, 'ARRIVE');
        const breadcrumbs: BreadcrumbEvent[] = JSON.parse(sessionStorage['breadcrumbs']);
        breadcrumbs.push(breadcrumb);
        sessionStorage['breadcrumbs'] = JSON.stringify(breadcrumbs);
    }
}

export default class Breadcrumbs extends FlowComponent {

    history: any;

    constructor(props: any) {
        super(props);
        this.gotoBreadcrumb = this.gotoBreadcrumb.bind(this);
        this.move = this.move.bind(this);
        this.showMore = this.showMore.bind(this);
    }

    showMore() {
        this.history.showMore();
    }

    async gotoBreadcrumb(breadcrumb: BreadcrumbEvent) {
        // console.log('Moving To ' + breadcrumb.pageElementName + '(' + breadcrumb.pageElementId + ')');
        await this.move(breadcrumb.pageElementId);
    }

    async componentDidMount() {
        await super.componentDidMount();
        // this.breadcrumbs = this.getStateValue() as FlowObjectDataArray;
        this.forceUpdate();
    }

    async componentWillUnmount() {
        (manywho as any).eventManager.removeBeforeSendListener(this.componentId);
    }

    async move(targetElement: string) {
        console.log('move to : ' + targetElement);

        const baseUrl = manywho.settings.global('platform.uri') || window.location.origin || 'https://flow.manywho.com';
        const invokeurl = `${baseUrl}/api/run/1/state/${this.stateId}`;

        const info = manywho.state.getState(this.flowKey);
         ///  api/run/1/state/{stateId}
        const request: any = {};
        request.currentMapElementId = info.currentMapElementId;
        request.invokeType = 'NAVIGATE';
        request.mapElementInvokeRequest = {};
        request.mapElementInvokeRequest.selectedOutcomeId = null;
        request.pageRequest = {
            pageComponentInputResponses: [
              { pageComponentId: this.componentId, contentValue: null, objectData: null},
            ],
        };
        request.selectedMapElementId = targetElement; // '63573014-69a5-490c-a988-57809e4bf3f0';
        request.stateId = this.stateId;
        request.stateToken = info.token;

        console.log(JSON.stringify(request));
        console.log(this.flowKey);

        const resp: any = await manywho.connection.request(this, null, invokeurl , 'POST', this.tenantId, this.stateId, manywho.state.getAuthenticationToken(this.flowKey), request);

        manywho.model.parseEngineResponse(resp, this.flowKey);

        // add to breadcrumbs
        const breadcrumb: BreadcrumbEvent = new BreadcrumbEvent(resp.mapElementInvokeResponses[0].mapElementId, resp.mapElementInvokeResponses[0].developerName, 'ARRIVE');
        const breadcrumbs: BreadcrumbEvent[] = JSON.parse(sessionStorage['breadcrumbs']);
        breadcrumbs.push(breadcrumb);
        sessionStorage['breadcrumbs'] = JSON.stringify(breadcrumbs);

        await manywho.engine.render(this.flowKey);
        await manywho.engine.sync(this.flowKey);
        // manywho.engine.ping(this.flowKey);

        return Promise.resolve();
    }

    render() {
        const text: number = parseInt(this.getAttribute('breadcrumbCount', '2'), 10);

        const breadcrumbElements: any[] = [];
        let breadcrumbHistory: any;

        if (this.loadingState === eLoadingState.ready) {
            // this.setStateValue(this.breadcrumbs);
            const breadcrumbs: BreadcrumbEvent[] = JSON.parse(sessionStorage['breadcrumbs']);
            let events: BreadcrumbEvent[] = [];
            breadcrumbs.forEach((breadcrumb: BreadcrumbEvent) => {
                if (breadcrumb.eventType === 'ARRIVE') {
                    events.push(breadcrumb);
                }
            });

            if (events.length > 6) {
                breadcrumbElements.push(
                    <BreadcrumbMore
                        parent={this}
                    />,
                    );
            }

            events = events.slice(Math.max(events.length - 6, 0));

            events.forEach((breadcrumb: BreadcrumbEvent) => {
                // if (breadcrumbElements.length > 0) {
                //    breadcrumbElements.push(
                //        <BreadcrumbSpacer/>,
                //        );
                // }
                breadcrumbElements.push(
                <Breadcrumb
                    parent={this}
                    breadcrumb={breadcrumb}
                />,
                );
            });

            breadcrumbHistory = (
                <BreadcrumbHistory
                    ref={(element: any) => {this.history = element; }}
                    parent={this}
                    breadcrumbs={breadcrumbs}
                />
            );
        }

        return (
            <div className="breadcrumbs">
                <div className="breadcrumbs-crumbs">
                    {breadcrumbElements}
                </div>
                <div className="breadcrumbs-history">
                    {breadcrumbHistory}
                </div>

            </div>
        );
    }

}

manywho.component.register('Breadcrumbs', Breadcrumbs);
