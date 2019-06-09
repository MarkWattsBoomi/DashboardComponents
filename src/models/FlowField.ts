import {FlowObjectData, IFlowObjectData} from './FlowObjectData';
import {FlowObjectDataArray} from './FlowObjectDataArray';

export interface IFlowField {
    contentType: string;
    contentValue: string;
    developerName: string;
    objectData: IFlowObjectData[];
    typeElementDeveloperName: string;
    typeElementId: string;
    typeElementPropertyDeveloperName: string;
    typeElementPropertyId: string;
    valueElementId: string;
}

export enum eContentType {
    ContentString,
    ContentNumber,
    ContentObject,
    ContentBoolean,
    ContentList,
    ContentPassword,
    ContentContent,
    ContentDateTime,
    ContentEncrypted,
}

export class FlowField {
    private ContentType: eContentType;
    private DeveloperName: string;
    private TypeElementDeveloperName: string;
    private TypeElementId: string;
    private TypeElementPropertyDeveloperName: string;
    private TypeElementPropertyId: string;
    private ValueElementId: string;
    private Value: string | number | Date | boolean | FlowObjectData | FlowObjectDataArray;

    get contentType(): eContentType {
        return this.ContentType;
    }

    get developerName(): string {
        return this.DeveloperName;
    }

    get typeElementDeveloperName(): string {
        return this.TypeElementDeveloperName;
    }

    get typeElementId(): string {
        return this.TypeElementId;
    }

    get typeElementPropertyDeveloperName(): string {
        return this.TypeElementPropertyDeveloperName;
    }

    get typeElementPropertyId(): string {
        return this.TypeElementPropertyId;
    }

    get valueElementId(): string {
        return this.ValueElementId;
    }

    get value(): string | number | Date | boolean | FlowObjectData | FlowObjectDataArray {
        return this.Value;
    }

    set value(value: string | number | Date | boolean | FlowObjectData | FlowObjectDataArray) {
        this.Value = value;
    }

    constructor(field: IFlowField) {
        this.ContentType = eContentType[field.contentType as keyof typeof eContentType];
        this.DeveloperName = field.developerName;
        this.TypeElementDeveloperName = field.typeElementDeveloperName;
        this.TypeElementId = field.typeElementId;
        this.TypeElementPropertyDeveloperName = field.typeElementPropertyDeveloperName;
        this.TypeElementPropertyId = field.typeElementPropertyId;
        this.ValueElementId = field.valueElementId;

        switch (this.ContentType) {
            case eContentType.ContentObject:
                this.Value = field.objectData && field.objectData[0] ? new FlowObjectData(field.objectData) : null;
                break;

            case eContentType.ContentList:
                this.Value = field.objectData && field.objectData[0] ? new FlowObjectDataArray(field.objectData) : new FlowObjectDataArray([]);
                break;

            default:
                this.Value = field.contentValue;
                break;
        }

    }

    iFlowField(): IFlowField {
        let contentValue: string;
        let objectData: IFlowObjectData[] = [];

        switch (this.ContentType) {
            case eContentType.ContentObject:
                const od: FlowObjectData = this.Value as FlowObjectData;
                objectData.push(od.iObjectData());
                break;

            case eContentType.ContentList:
                const oda: FlowObjectDataArray = this.Value as FlowObjectDataArray;
                objectData = oda.iFlowObjectDataArray();
                break;

            default:
                contentValue = this.Value as string;
                break;
        }

        const output: IFlowField = {
            contentType: eContentType[this.ContentType],
            contentValue,
            developerName: this.DeveloperName,
            objectData,
            typeElementDeveloperName: this.TypeElementDeveloperName,
            typeElementId: this.TypeElementId,
            typeElementPropertyDeveloperName: this.TypeElementPropertyDeveloperName,
            typeElementPropertyId: this.TypeElementPropertyId,
            valueElementId:  this.ValueElementId,
        };

        return output;
    }
}
