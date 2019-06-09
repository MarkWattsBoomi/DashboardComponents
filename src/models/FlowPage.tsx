import { FlowBaseComponent } from './FlowBaseComponent';
import { IFlowObjectData } from './FlowObjectData';
import {  IManywho } from './interfaces';

declare const manywho: IManywho;
declare const $: JQueryStatic;

export class FlowPage extends FlowBaseComponent {

    constructor(props: any) {
        super(props);
        this.reloadValues = this.reloadValues.bind(this);
        (manywho as any).eventManager.addDoneListener(this.reloadValues);
    }

    // the FlowPage automatically gets values
    async componentDidMount() {
        await super.componentDidMount();
        await this.loadValues();
    }
    //
    async triggerOutcome(outcomeName: string, data?: IFlowObjectData[]) {
        await super.triggerOutcome(outcomeName, data);
        await this.loadModel();
        await this.loadValues();
    }

    async reloadValues(xhr: XMLHttpRequest, request: any) {
        await this.loadModel();
        await this.loadValues();
    }
}
