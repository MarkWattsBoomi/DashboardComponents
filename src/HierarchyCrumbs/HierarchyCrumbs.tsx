import { eContentType, eLoadingState, FlowComponent, FlowObjectData, FlowObjectDataArray, FlowObjectDataProperty} from 'flow-component-model';
import * as React from 'react';
import '../css/HierarchyCrumbs.css';
import HierarchyCrumb from './HierarchyCrumb';
import { HierarchyCrumbEvent } from './HierarchyCrumbEvent';

declare const manywho: any;

if (! sessionStorage['HCC']) {
    // add listener if not defined
    (manywho as any).eventManager.addDoneListener(moveHappened, 'HierarchyCrumbs');
    sessionStorage['HCC'] = 'TRUE';
}

function moveHappened(xhr: any, request: any) {
    if ((xhr as any).invokeType === 'FORWARD') {
        const meir: any = (xhr as any).mapElementInvokeResponses[0];
        let rootCrumb: HierarchyCrumbEvent;
        if (sessionStorage['HierarchyCrumbs']) {
            rootCrumb = JSON.parse(sessionStorage['HierarchyCrumbs']);
            rootCrumb = HierarchyCrumbEvent.fromStorage(rootCrumb);
        }

        const crumb: HierarchyCrumbEvent = new HierarchyCrumbEvent(
            meir.mapElementId,
            meir.developerName,
            new Date(),
            'ARRIVE',
            (xhr as any).stateId,
            (xhr as any).stateToken,
            (xhr as any).joinFlowUri,
        );
        if (rootCrumb) {
            rootCrumb.spliceCrumb(crumb);
        } else {
            rootCrumb = crumb;
        }
        sessionStorage['HierarchyCrumbs'] = JSON.stringify(rootCrumb);
    }
}

export default class Hierarchycrumbs extends FlowComponent {

    history: any;
    myPageComponentId: string;

    constructor(props: any) {
        super(props);
        this.gotoBreadcrumb = this.gotoBreadcrumb.bind(this);
        // this.move = this.move.bind(this);
        this.showMore = this.showMore.bind(this);
        this.moveHappened = this.moveHappened.bind(this);
    }

    showMore() {
        this.history.showMore();
    }

    async gotoBreadcrumb(breadcrumb: HierarchyCrumbEvent) {
        const crumbsStr: string = sessionStorage['HierarchyCrumbs'];
        const crumbStr: HierarchyCrumbEvent = JSON.parse(crumbsStr);
        let crumb = HierarchyCrumbEvent.fromStorage(crumbStr);

        // how many levels up from me is the target?
        let lvlCount: number = 0;
        let ttlCount: number = 0;
        while (crumb) {
            ttlCount ++;
            if (crumb.pageElementId === breadcrumb.pageElementId) {
                // start counting
                lvlCount = ttlCount;
            }
            crumb = crumb.child;
        }
        const diff: number = ttlCount - lvlCount;

        for (let pos = 0 ; pos < diff ; pos++) {
            if (this.outcomes['parent']) {
                await this.triggerOutcome('parent');
            }
        }

        crumb = HierarchyCrumbEvent.fromStorage(crumbStr);
        if (breadcrumb.child) {
            crumb.sliceCrumb(breadcrumb.child);
            sessionStorage['HierarchyCrumbs'] = JSON.stringify(crumb);
        }

        // console.log('Moving To ' + breadcrumb.pageElementName + '(' + breadcrumb.pageElementId + ')');
        // await this.move(breadcrumb.pageElementId);
        this.forceUpdate();
    }

    async componentDidMount() {
        await super.componentDidMount();
        (manywho as any).eventManager.addDoneListener(this.moveHappened, this.componentId);
        // this.breadcrumbs = this.getStateValue() as FlowObjectDataArray;
        this.forceUpdate();
    }

    moveHappened(xhr: any, request: any) {
        if ((xhr as any).invokeType === 'FORWARD') {
            manywho.model.parseEngineResponse(xhr, this.flowKey);
            this.myPageComponentId = (xhr as any).mapElementInvokeResponses[0].mapElementId;
            this.loadOutcomes();
        }
    }

    async componentWillUnmount() {
        (manywho as any).eventManager.removeBeforeSendListener(this.componentId);
    }

    render() {
        const text: number = parseInt(this.getAttribute('breadcrumbCount', '2'), 10);

        const crumbElements: any[] = [];
        let crumbHistory: any;

        if (this.loadingState === eLoadingState.ready) {
            // this.setStateValue(this.breadcrumbs);
            const crumbsStr: string = sessionStorage['HierarchyCrumbs'];
            let crumb: HierarchyCrumbEvent = JSON.parse(crumbsStr);
            crumb = HierarchyCrumbEvent.fromStorage(crumb);

            while (crumb) {
                crumbElements.push(
                    <HierarchyCrumb
                        parent={this}
                        crumb={crumb}
                    />,
                );
                crumb = crumb.child;
            }
        }

        return (
            <div className="hc">
                <div className="hc-crumbs">
                    {crumbElements}
                </div>
            </div>
        );
    }

}

manywho.component.register('Hierarchycrumbs', Hierarchycrumbs);
