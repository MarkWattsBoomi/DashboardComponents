import { eContentType } from './FlowField';
import { FlowObjectData, IFlowObjectData } from './FlowObjectData';
import { FlowObjectDataArray } from './FlowObjectDataArray';

export interface IFlowObjectDataProperty {
    contentFormat: string | null;
    contentType: string;
    contentValue: string | number | boolean | null;
    developerName: string;
    objectData: IFlowObjectData[] | null;
    typeElementId: string | null;
    typeElementPropertyId: string;
}

export class FlowObjectDataProperty {

    static newInstance(developerName: string, contentType: eContentType, value: string | number | boolean | FlowObjectData | FlowObjectDataArray) {

        let cv: string;
        let objd: IFlowObjectData[] = [];

        switch (contentType) {
            case eContentType.ContentObject:
                const od: FlowObjectData = value as FlowObjectData;
                objd.push(od.iObjectData());
                break;

            case eContentType.ContentList:
                const oda: FlowObjectDataArray = value as FlowObjectDataArray;
                objd = oda.iFlowObjectDataArray();
                break;

            default:
                cv = value as string;
                break;
        }
        const data: IFlowObjectDataProperty = {
            contentFormat: null,
            contentType: eContentType[contentType],
            contentValue: cv,
            developerName,
            objectData: objd,
            typeElementId: null,
            typeElementPropertyId: null,
        };
        return new this(data);
    }

    private ContentFormat: string;
    private ContentType: eContentType;
    private DeveloperName: string;
    private TypeElementId: string | null;
    private TypeElementPropertyId: string;
    private Value: string | number | boolean | FlowObjectData | FlowObjectDataArray;

    constructor(property: IFlowObjectDataProperty) {
        this.DeveloperName = property.developerName;
        this.ContentType = eContentType[property.contentType as keyof typeof eContentType];
        this.ContentFormat = property.contentFormat;
        this.TypeElementId = property.typeElementId;
        this.TypeElementPropertyId = property.typeElementPropertyId;

        switch (this.ContentType) {
            case eContentType.ContentObject:
                this.Value = property.objectData ? new FlowObjectData(property.objectData) : null;
                break;

            case eContentType.ContentList:
                this.value = property.objectData ? new FlowObjectDataArray(property.objectData) : new FlowObjectDataArray([]);
                break;

            default:
                this.value = property.contentValue;
                break;
        }
    }

    get contentFormat(): string {
            return this.ContentFormat;
        }
    set contentFormat(contentFormat: string) {
            this.contentFormat = contentFormat;
        }

    get contentType(): eContentType {
        return this.ContentType;
        }
    set contentType(contentType: eContentType) {
        this.ContentType = contentType;
        }

    get developerName(): string {
        return this.DeveloperName;
        }
    set developerName(developerName: string) {
        this.DeveloperName = developerName;
        }

    get typeElementId(): string {
        return this.TypeElementId;
        }
    set typeElementId(typeElementId: string) {
        this.TypeElementId = typeElementId;
        }

    get typeElementPropertyId(): string {
        return this.TypeElementPropertyId;
        }
    set typeElementPropertyId(typeElementPropertyId: string) {
        this.TypeElementPropertyId = typeElementPropertyId;
        }

    get value(): string | number | boolean | FlowObjectData | FlowObjectDataArray {
        switch (this.contentType) {
            case eContentType.ContentNumber:
                return parseFloat(this.Value ? this.Value as string : '0');

            case eContentType.ContentBoolean:
                return new String(this.Value).toLowerCase() === 'true';

            default:
                return this.Value;
        }

    }

    set value(value: string | number | boolean | FlowObjectData | FlowObjectDataArray) {
        this.Value = value;
        }

    iFlowObjectDataProperty(): IFlowObjectDataProperty {

        let contentValue: string;
        let objectData: IFlowObjectData[] = [];

        switch (this.ContentType) {
            case eContentType.ContentObject:
                const od: FlowObjectData = this.Value as FlowObjectData;

                // if it has no developerName then skip it
                if (od && od.developerName && od.developerName.length > 0) {
                    objectData.push(od.iObjectData());
                }
                break;

            case eContentType.ContentList:
                const oda: FlowObjectDataArray = this.Value as FlowObjectDataArray;
                objectData = oda.iFlowObjectDataArray();
                break;

            default:
                contentValue = this.Value as string;
                break;
        }

        const output: IFlowObjectDataProperty = {
            contentFormat: this.ContentFormat,
            contentType: eContentType[this.ContentType],
            contentValue,
            developerName: this.DeveloperName,
            objectData,
            typeElementId: this.TypeElementId,
            typeElementPropertyId: this.TypeElementPropertyId,
        };
        return output;

    }

}
