import {FlowAttribute} from './FlowAttribute';

export enum ePageActionBindingType {
    Save = 'SAVE',
    PartialSave = 'PARTIAL_SAVE',
    NoSave = 'NO_SAVE',
}

export enum ePageActionType {
    New = 'NEW',
    Query = 'QUERY',
    Insert = 'INSERT',
    Update = 'UPDATE',
    Upsert = 'UPSERT',
    Delete = 'DELETE',
    Remove = 'REMOVE',
    Add = 'ADD',
    Edit = 'EDIT',
    Next = 'NEXT',
    Back = 'BACK',
    Done = 'DONE',
    Save = 'SAVE',
    Cancel = 'CANCEL',
    Apply = 'APPLY',
    Import = 'IMPORT',
    Close = 'CLOSE',
    Open = 'OPEN',
    Submit = 'SUBMIT',
    Escalate = 'ESCALATE',
    Reject = 'REJECT',
    Delegate = 'DELEGATE',
}

export interface IFlowOutcome {
    attributes: any;
    developerName: string;
    id: string;
    isBulkAction: boolean;
    isOut: boolean;
    label: string;
    order: number;
    pageActionBindingType: ePageActionBindingType;
    pageActionType: ePageActionType;
    pageObjectBindingId: string;
}
export class FlowOutcome {
    private Attributes: {[key: string]: FlowAttribute};
    private DeveloperName: string;
    private Id: string;
    private IsBulkAction: boolean;
    private IsOut: boolean;
    private Label: string;
    private Order: number;
    private PageActionBindingType: ePageActionBindingType;
    private PageActionType: ePageActionType;
    private PageObjectBindingId: string;
    private Outcome: IFlowOutcome;

    get developerName(): string {
        return this.DeveloperName;
    }
    get id(): string {
        return this.Id;
    }
    get isBulkAction(): boolean {
        return this.IsBulkAction;
    }
    get isOut(): boolean {
        return this.IsOut;
    }
    get label(): string {
        return this.Label;
    }
    get order(): number {
        return this.Order;
    }

    get pageActionBindingType(): ePageActionBindingType {
        return this.PageActionBindingType;
    }

    get pageActionType(): ePageActionType {
        return this.PageActionType;
    }

    get pageObjectBindingId(): string {
        return this.PageObjectBindingId;
    }

    get attributes(): {[key: string]: FlowAttribute} {
        return this.Attributes;
    }

    constructor(outcome: IFlowOutcome) {
        this.DeveloperName = outcome.developerName;
        this.Id = outcome.id;
        this.IsBulkAction = outcome.isBulkAction;
        this.IsOut = outcome.isOut;
        this.Label = outcome.label;
        this.Order = outcome.order;
        this.PageActionBindingType = outcome.pageActionBindingType;
        this.PageActionType = outcome.pageActionType;
        this.PageObjectBindingId = outcome.pageObjectBindingId;
        this.Attributes = {};
        if (outcome.attributes) {
            for (const key of Object.keys(outcome.attributes)) {
                this.Attributes[key] = new FlowAttribute(key, outcome.attributes[key]);
            }
        }

        this.Outcome = outcome;
    }

    iFlowOutcome() {
        return this.Outcome;
    }
}
