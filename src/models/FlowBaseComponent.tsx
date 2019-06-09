import * as React from 'react';
import { FlowAttribute } from './FlowAttribute';
import { FlowDisplayColumn } from './FlowDisplayColumn';
import { FlowField, IFlowField } from './FlowField';
import { FlowObjectData, IFlowObjectData} from './FlowObjectData';
import { FlowObjectDataArray } from './FlowObjectDataArray';
import { FlowOutcome, IFlowOutcome } from './FlowOutcome';
import { IComponentProps, IManywho, IObjectData } from './interfaces';
import { IComponentValue } from './interfaces/services/state';

declare const manywho: IManywho;
declare const $: JQueryStatic;

interface IFlowStateValue {
    contentType: string;
    contentValue: string;
    developerName: string;
    objectData: IObjectData[];
    typeElementDeveloperName: string;
    typeElementId: string;
    typeElementPropertyDeveloperName: string;
    typeElementPropertyId: string;
    valueElementId: string;
}

interface IFlowUser {
    directoryId: string;
    directoryName: string;
    email: string;
    firstName: string;
    groupId: string;
    groupName: string;
    id: string;
    ipAddress: string;
    language: string;
    lastName: string;
    location: string;
    roleId: string;
    roleName: string;
    status: string;
    userName: string;
}

interface IFlowModel {
    contentType: string;
    dataSource: FlowObjectDataArray;
    developerName: string;
    enabled: boolean;
    height: number;
    helpInfo: string;
    hintInfo: string;
    joinUri: string;
    label: string;
    maxSize: number;
    multiSelect: boolean;
    readOnly: boolean;
    required: boolean;
    size: number;
    validationMessage: string;
    visible: boolean;
    width: number;
    displayColumns: FlowDisplayColumn[];
}

if (!(manywho as any).eventManager) {
    (manywho as any).eventManager = {};
    (manywho as any).eventManager.beforeSendListeners = [];
    (manywho as any).eventManager.doneListeners = [];
    (manywho as any).eventManager.failListeners = [];

    (manywho as any).eventManager.beforeSend = (xhr: XMLHttpRequest, request: any) => {
        (manywho as any).eventManager.beforeSendListeners.forEach((listener: any) => listener(xhr, request));
    };

    (manywho as any).eventManager.done = (xhr: XMLHttpRequest, request: any) => {
        (manywho as any).eventManager.doneListeners.forEach((listener: any) => listener(xhr, request));
    };

    (manywho as any).eventManager.fail = (xhr: XMLHttpRequest, request: any) => {
        (manywho as any).eventManager.failListeners.forEach((listener: any) => listener(xhr, request));
    };

    (manywho as any).eventManager.addBeforeSendListener = (handler: (xhr: XMLHttpRequest, request: any) => void) => {
        (manywho as any).eventManager.beforeSendListeners.push(handler);
    };

    (manywho as any).eventManager.addDoneListener = (handler: (xhr: XMLHttpRequest, request: any) => void) => {
        (manywho as any).eventManager.doneListeners.push(handler);
    };

    (manywho as any).eventManager.addFailListener = (handler: (xhr: XMLHttpRequest, request: any) => void) => {
        (manywho as any).eventManager.failListeners.push(handler);
    };

    manywho.settings.initialize(null, {
        invoke: {
            beforeSend: (manywho as any).eventManager.beforeSend,
            done: (manywho as any).eventManager.done,
            fail: (manywho as any).eventManager.fail,
        },
    });
}

export class FlowBaseComponent extends React.Component<IComponentProps, any, any> {

    url: string;
    userurl: string;
    private User: IFlowUser;
    private TenantId: string;
    private StateId: string;
    private FlowKey: string;
    private ComponentId: string;
    private ParentId: string;
    private Fields: {[key: string]: FlowField};
    private IsLoading: boolean;
    private LoadingState: string;
    private Attributes: {[key: string]: FlowAttribute};
    private Outcomes: {[key: string]: FlowOutcome};
    private Model: IFlowModel;

    get tenantId(): string {
        return this.TenantId;
    }

    get stateId(): string {
        return this.StateId;
    }

    get flowKey(): string {
        return this.FlowKey;
    }

    get componentId(): string {
        return this.ComponentId;
    }

    get parentId(): string {
        return this.ParentId;
    }

    get isLoading(): boolean {
        return this.IsLoading;
    }

    get loadingState(): string {
        return this.LoadingState;
    }

    get outcomes(): {[key: string]: FlowOutcome} {
        return this.Outcomes;
    }

    get attributes(): {[key: string]: FlowAttribute} {
        return this.Attributes;
    }

    get fields(): {[key: string]: FlowField} {
        return this.Fields;
    }

    get model(): IFlowModel {
        return this.Model;
    }

    get user(): IFlowUser {
        return this.User;
    }

    get joinURI(): string {
        return window.location.href;
    }

    getAttribute(attributeName: string, defaultValue?: string): string {
        if (this.attributes[attributeName]) {
            return this.attributes[attributeName].value;
        } else {
            return defaultValue || '';
        }
    }

    constructor(props: any) {
        super(props);

        this.IsLoading = true;
        this.Fields = {};
        this.LoadingState = 'initial';
        this.loadValues = this.loadValues.bind(this);
        this.dontLoadValues = this.dontLoadValues.bind(this);
        this.updateValues = this.updateValues.bind(this);
        this.triggerOutcome = this.triggerOutcome.bind(this);
        this.ComponentId = this.props.id;
        this.ParentId = this.props.parentId;
        this.FlowKey = this.props.flowKey;
        this.Attributes = {};
        this.loadModel = this.loadModel.bind(this);
        this.loadAttributes = this.loadAttributes.bind(this);
        this.loadOutcomes = this.loadOutcomes.bind(this);
        this.receiveMessage = this.receiveMessage.bind(this);
        window.addEventListener('message', this.receiveMessage, false);

        // const model = manywho.model.getComponent(this.ComponentId, this.FlowKey);
        this.loadModel();
        this.loadAttributes();
        this.loadOutcomes();

        const baseUrl = manywho.settings.global('platform.uri') || 'https://flow.manywho.com';
        this.StateId = manywho.utils.extractStateId(this.props.flowKey);
        this.TenantId = manywho.utils.extractTenantId(this.props.flowKey);

        this.url = `${baseUrl}/api/run/1/state/${this.StateId}/values`;
        this.userurl = `${baseUrl}/api/run/1/state/${this.StateId}/values/03dc41dd-1c6b-4b33-bf61-cbd1d0778fff`;
    }

    async componentDidMount() {
        // preserve state
        const flowModel = manywho.model.getComponent(this.ComponentId, this.FlowKey);
        const flowState = manywho.state.getComponent(this.componentId, this.flowKey) || {};

        switch (flowModel.contentType) {
            case 'ContentObject':

            case 'ContentList':
                let objectData: any;
                if (flowState.objectData) {
                    objectData = flowState.objectData;
                    objectData = JSON.parse(JSON.stringify(objectData));
                }

                const newState = { objectData };
                manywho.state.setComponent(this.componentId, newState, this.flowKey, true);
                break;

            default:
                flowState.contentValue = flowModel.contentValue;
                break;
        }

        manywho.utils.removeLoadingIndicator('loader');
    }

    loadOutcomes() {

        this.Outcomes = {};

        // add the outcomes from this component
        let outs = manywho.model.getOutcomes(this.props.id, this.props.flowKey);
        for (const outcome of outs) {
            this.Outcomes[outcome.developerName] = new FlowOutcome(outcome);
        }
        // and the ones from the parent page
        outs = manywho.model.getOutcomes(null, this.props.flowKey);
        for (const outcome of outs) {
            this.Outcomes[outcome.developerName] = new FlowOutcome(outcome);
        }
    }

    loadAttributes() {
        const model = manywho.model.getComponent(this.ComponentId, this.FlowKey);
        // add the attributes
        const attrs = model.attributes;
        if (attrs) {
            for (const key of Object.keys(attrs)) {
                this.Attributes[key] = new FlowAttribute(key, attrs[key]);
            }
        }
    }

    loadModel() {
        const model = manywho.model.getComponent(this.ComponentId, this.FlowKey);
        if (model) {
            this.Model = {
                contentType: model.contentType,
                dataSource:  new FlowObjectDataArray([]),
                developerName: model.developerName,
                displayColumns: [],
                enabled:  model.isEnabled,
                height:  model.height,
                helpInfo:  model.helpInfo,
                hintInfo:  model.hintValue,
                joinUri: this.joinURI,
                label:  model.label,
                maxSize:  model.maxSize,
                multiSelect:  model.isMultiSelect,
                readOnly:  !model.isEditable,
                required:  model.isRequired,
                size:  model.size,
                validationMessage:  model.validationMessage,
                visible:  model.isVisible,
                width: model.width,
            };

            // get the datasource value name
            const ds = model.objectData;
            if (ds) {
                for (const od of ds) {
                    this.Model.dataSource.addItem(new FlowObjectData([od]));
                }
            }

            const cols = model.columns;
            if (cols) {
                for (const col of cols) {
                    this.Model.displayColumns.push(new FlowDisplayColumn(col));
                }
            }
        }
    }

    async loadValues() {
        this.IsLoading = true;
        this.LoadingState = this.LoadingState !== 'initial' ? 'refreshing' : 'initial';
        this.Fields = {};

        const values = await manywho.connection.request(this, null, this.url , 'GET', this.TenantId, this.StateId, manywho.state.getAuthenticationToken(this.FlowKey), null);

        (values || []).map((value: IFlowStateValue) => {this.Fields[value.developerName] = new FlowField(value); });

        const userval = await manywho.connection.request(this, null, this.userurl , 'GET', this.TenantId, this.StateId, manywho.state.getAuthenticationToken(this.FlowKey), null);
        const u = new FlowField(userval);
        const props = (u.value as FlowObjectData).properties;

        this.User = {
            directoryId: props['Directory Id'].value as string,
            directoryName: props['Directory Name'].value as string,
            email: props['Email'].value as string || 'mark',
            firstName: props['First Name'].value as string,
            groupId: props['Primary Group Id'].value as string,
            groupName: props['Primary Group Name'].value as string,
            id: props['User ID'].value as string,
            ipAddress: props['IP Address'].value as string,
            language: props['Language'].value as string,
            lastName: props['Last Name'].value as string,
            location: props['Location'].value as string,
            roleId: props['Role Id'].value as string,
            roleName: props['Role Name'].value as string,
            status: props['Status'].value as string,
            userName: props['Username'].value as string,
        };

        this.IsLoading = false;
        this.LoadingState = 'loaded';
        this.forceUpdate();
    }

    async dontLoadValues() {
        this.IsLoading = false;
        this.LoadingState = 'loaded';
        this.forceUpdate();
    }

    getStateValue(): string | boolean | number | Date | FlowObjectData | FlowObjectDataArray {
        const flowState = manywho.state.getComponent(this.componentId, this.flowKey) || {};
        const flowModel = manywho.model.getComponent(this.ComponentId, this.FlowKey);
        switch (flowModel.contentType) {
            case 'ContentObject':
                return new FlowObjectData(flowState.objectData[0]);

            case 'ContentList':
                return new FlowObjectDataArray(flowState.objectData);
                break;

            default:
                return flowState.contentValue;
                break;
        }
    }

    getStateValueType(): string | boolean | number | Date | FlowObjectData | FlowObjectDataArray {
        const flowState = manywho.state.getComponent(this.componentId, this.flowKey) || {};
        const flowModel = manywho.model.getComponent(this.ComponentId, this.FlowKey);
        switch (flowModel.contentType) {
            case 'ContentObject':
                return new FlowObjectData(flowState.objectData[0]);

            case 'ContentList':
                return new FlowObjectDataArray(flowState.objectData);
                break;

            default:
                return flowState.contentValue;
                break;
        }
    }

    async setStateValue(value: string | boolean | number | Date | FlowObjectData | FlowObjectDataArray) {
        const flowModel = manywho.model.getComponent(this.ComponentId, this.FlowKey);
        const flowState = manywho.state.getComponent(this.componentId, this.flowKey) || {};
        let newState: any;
        switch (flowModel.contentType) {
            case 'ContentObject':
                let objectData = (value as FlowObjectData).iFlowObjectDataArray();
                objectData = JSON.parse(JSON.stringify(objectData));
                newState = { objectData };
                manywho.state.setComponent(this.componentId, newState, this.flowKey, true);
                break;

            case 'ContentList':
                let objectDataArray = (value as FlowObjectDataArray).iFlowObjectDataArray();
                objectDataArray = JSON.parse(JSON.stringify(objectData));
                newState = { objectDataArray };
                manywho.state.setComponent(this.componentId, newState, this.flowKey, true);
                break;

            case 'ContentDate':
                flowState.contentValue = (value as Date).toISOString();
                break;

            default:
                flowState.contentValue = value as string;
                break;

        }
        // manywho.engine.sync(this.flowKey);
    }

    async updateValues(values: FlowField[]) {
        this.IsLoading = true;
        this.LoadingState = this.LoadingState !== 'initial' ? 'refreshing' : 'initial';
        this.forceUpdate();

        const updateFields: IFlowField[] = [];

        for (const field of values) {
            updateFields.push(field.iFlowField());
        }

        await manywho.connection.request(this, null, this.url , 'POST', this.TenantId, this.StateId, manywho.state.getAuthenticationToken(this.FlowKey), updateFields);
        // await manywho.engine.sync(this.flowKey);
    }

    async triggerOutcome(outcomeName: string, data?: IFlowObjectData[]) {
        this.IsLoading = true;
        this.LoadingState = this.LoadingState !== 'initial' ? 'refreshing' : 'initial';
        this.forceUpdate();

        if (!data) {
            data = null;
        }

        let oc: IFlowOutcome;
        if (this.outcomes[outcomeName]) {
            oc = this.outcomes[outcomeName].iFlowOutcome();
        }

        if (oc) {
            await manywho.component.onOutcome(oc, data, this.FlowKey);
        } else {
            this.log('Could not find outcome ' + outcomeName);
        }
    }

    log(message: string) {
        const now = new Date();
        const time = [('0' + now.getHours()).slice(-2), ('0' + now.getMinutes()).slice(-2),
            ('0' + now.getSeconds()).slice(-2)];
        const timestamp = '[' + time.join(':') + '] ';
        console.log(timestamp + message);
    }

    async launchFlowSilent(tenant: string, flowId: string, player: string, objectData?: FlowObjectDataArray) {
        const baseUrl = manywho.settings.global('platform.uri') || 'https://flow.manywho.com';
        const url = `${baseUrl}/api/run/1/state`;

        const data: any = {};
        data.id = flowId;
        data.developerName = null;
        data.inputs = objectData ? objectData.iFlowObjectDataArray() : null;
        manywho.connection.request(this, null, url , 'POST', this.TenantId, null, manywho.state.getAuthenticationToken(this.FlowKey), data);

    }

    async launchFlowTab(tenant: string, flowId: string, player: string, objectData?: FlowObjectDataArray) {
        const baseUrl = manywho.settings.global('platform.uri') || 'https://flow.boomi.com';
        const url = baseUrl + '/' + tenant + '/play/' + player + '?flow-id=' + flowId;

        window.open(url, '_new');

    }

    async receiveMessage(message: any) {
        if (message.data.data) {
            const msg = JSON.parse(message.data.data);
            if (msg.action) {
                switch (msg.action.toUpperCase()) {
                    case 'OUTCOME':
                        await this.triggerOutcome(msg.data);
                        break;

                    default:
                        await this.handleMessage(msg);
                        break;
                }
            }
        }
    }

    async handleMessage(msg: any) {

    }

}
