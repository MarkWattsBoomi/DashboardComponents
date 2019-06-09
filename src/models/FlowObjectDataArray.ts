import { string } from 'prop-types';
import { eContentType } from './FlowField';
import { FlowObjectData , IFlowObjectData} from './FlowObjectData';
import { FlowObjectDataProperty } from './FlowObjectDataProperty';

export enum eSortOrder {
    ascending,
    descending,
}

export class FlowObjectDataArray {

    private Items: FlowObjectData[];

    get items(): FlowObjectData[] {
        return this.Items;
    }

    sort(ascending: eSortOrder = eSortOrder.ascending, fieldName?: string): FlowObjectData[] {

        if (ascending === eSortOrder.ascending) {
            if (fieldName) {
                return this.Items.sort((a, b) => {

                    let valA: any;
                    let valB: any;
                    switch (a.properties[fieldName].contentType) {
                        case  eContentType.ContentNumber:
                            valA = parseFloat(a.properties[fieldName].value as string);
                            valB = parseFloat(b.properties[fieldName].value as string);
                            break;

                        case  eContentType.ContentDateTime:
                            valA = new Date(a.properties[fieldName].value as string);
                            valB = new Date(b.properties[fieldName].value as string);
                            break;

                        default:
                            valA = a.properties[fieldName].value;
                            valB = b.properties[fieldName].value;
                            break;

                    }

                    switch (true) {
                        case valA < valB:
                            return -1;

                        case valA > valB:
                            return 1;

                        default:
                            return 0;

                    }

                });
            } else {
                return this.Items.sort((a, b) => a.order - b.order);
            }
        } else {
            if (fieldName) {
                return this.Items.sort((a, b) => {
                    switch (true) {
                        case a.properties[fieldName].value < b.properties[fieldName].value:
                            return 1;

                        case a.properties[fieldName].value > b.properties[fieldName].value:
                            return -1;

                        default:
                            return 0;

                    }

                });
            } else {
                return this.Items.sort((a, b) => a.order - b.order);
            }
        }
    }

    constructor(array: IFlowObjectData[]) {
        this.Items = [];
        for (const item of array || []) {
            this.Items.push(new FlowObjectData([item]));
        }

    }

    addItem(item: FlowObjectData) {
        this.Items.push(item);
    }

    clearItems() {
        this.Items = [];
    }

    iFlowObjectDataArray(): IFlowObjectData[] {
        const output: IFlowObjectData[] = [];
        for (const od of this.Items) {
            output.push(od.iObjectData());
        }
        return output;
    }

    getItemWithPropertyName(findProperty: string, withValue: any, returnProperty: string): FlowObjectDataProperty {
        for (const item of this.Items) {
            if (item.properties[findProperty] && item.properties[findProperty].value) {

                let value = item.properties[findProperty].value;
                let compareTo = withValue;

                switch (item.properties[findProperty].contentType) {
                    case eContentType.ContentString:
                        value = (value as string).toLowerCase();
                        compareTo = compareTo.toLowerCase();
                        break;

                    case eContentType.ContentNumber:
                        value = value;
                        compareTo = parseFloat(compareTo.toLowerCase());
                        break;

                    case eContentType.ContentBoolean:
                        value = value;
                        compareTo = new String(compareTo).toLowerCase() === 'true';
                        break;

                    default:
                        break;
                }

                if (value  === compareTo) {
                    return item.properties[returnProperty];
                }
            }
        }
        return null;
    }

	   getItemWithPropertyValue(findProperty: string, withValue: any): FlowObjectData {
        for (const item of this.Items) {
            if (item.properties[findProperty] && item.properties[findProperty].value) {
                    let value = item.properties[findProperty].value;
                    let compareTo = withValue;

                    switch (item.properties[findProperty].contentType) {
                        case eContentType.ContentString:
                            value = (value as string).toLowerCase();
                            compareTo = compareTo.toLowerCase();
                            break;

                        case eContentType.ContentNumber:
                            value = value;
                            compareTo = parseFloat(compareTo.toLowerCase());
                            break;

                        case eContentType.ContentBoolean:
                            value = value;
                            compareTo = new String(compareTo).toLowerCase() === 'true';
                            break;

                        default:
                            break;
                    }

                    if (value === compareTo) {
                        return item;
                    }

            }
        }
    }
}
