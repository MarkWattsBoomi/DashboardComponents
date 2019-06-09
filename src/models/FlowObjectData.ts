// import { any, string } from 'prop-types';
// import { objectDataHandler } from '../utils/proxy';
import {eContentType} from './FlowField';
import { FlowObjectDataProperty, IFlowObjectDataProperty } from './FlowObjectDataProperty';
import { IManywho, IObjectData} from './interfaces';

declare const manywho: IManywho;

export interface IFlowObjectData {
    developerName: string;
    externalId: string;
    internalId: string;
    isSelected: boolean;
    order: number;
    properties: IFlowObjectDataProperty[];
}

export class FlowObjectData {
    private DeveloperName: string;
    private ExternalId: string = null;
    private InternalId: string;
    private IsSelected: boolean = false;
    private Order: number = 0;
    private Properties: {[key: string]: FlowObjectDataProperty} = {};

    get developerName(): string {
        return this.DeveloperName;
    }
    set developerName(developerName: string) {
        this.DeveloperName = developerName;
    }

    get externalId(): string {
        return this.ExternalId;
    }
    set externalId(externalId: string) {
        this.ExternalId = externalId;
    }

    get internalId(): string {
        return this.InternalId;
    }
    set internalId(internalId: string) {
        this.InternalId = internalId;
    }

    get isSelected(): boolean {
        return this.IsSelected;
    }
    set isSelected(isSelected: boolean) {
        this.IsSelected = isSelected;
    }

    get order(): number {
        return this.Order;
    }
    set order(order: number) {
        this.Order = order;
    }

    get properties(): {[key: string]: FlowObjectDataProperty} {
        return this.Properties;
    }

    constructor(data?: IFlowObjectData[]) {
        if (data && data[0]) {
            const objectData = data[0];
            this.DeveloperName = objectData.developerName;
            this.InternalId = objectData.internalId;
            this.ExternalId = objectData.externalId;
            this.Order = objectData.order;
            this.IsSelected = objectData.isSelected;

            for (const property of objectData.properties) {
                this.Properties[property.developerName] = new FlowObjectDataProperty(property);
            }
        }
    }

    static newInstance(developerName: string) {

        const data: IFlowObjectData = {
            developerName,
            externalId : null,
            internalId : manywho.utils.guid(),
            isSelected : true,
            order: 0,
            properties : [],
        };
        return new this([data]);
    }

    addProperty(newProperty: FlowObjectDataProperty) {
        this.Properties[newProperty.developerName] = newProperty;
    }

    removeProperty(key: string) {
        delete this.Properties[key];
    }

    iObjectData() {

        const props: IFlowObjectDataProperty[] = [];

        for (const key of Object.keys(this.properties)) {
            props.push(this.properties[key].iFlowObjectDataProperty());
        }

        const objectData: IObjectData = {
            developerName: this.developerName,
            externalId : this.externalId,
            internalId : this.internalId,
            isSelected : this.isSelected,
            order : this.order,
            properties: props,
        };

        return objectData;
    }

    iFlowObjectDataArray(): IFlowObjectData[] {
        const output: IFlowObjectData[] = [];
        output.push(this.iObjectData());
        return output;
    }

}
