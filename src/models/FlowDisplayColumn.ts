export interface IFlowDisplayColumn {

    componentType: string;
    contentFormat: string;
    contentType: string;
    developerName: string;
    isDisplayValue: boolean;
    isEditable: boolean;
    label: string;
    order: number;
    typeElementPropertyId: string;
    typeElememtPropertyToDisplayId: string;
}

export class FlowDisplayColumn {
    private ComponentType: string;
    private ContentFormat: string;
    private ContentType: string;
    private DeveloperName: string;
    private Visible: boolean;
    private ReadOnly: boolean;
    private Label: string;
    private DisplayOrder: number;
    private TypeElementPropertyId: string;
    private TypeElememtPropertyToDisplayId: string;
    private Column: IFlowDisplayColumn;

    get componentType(): string {
        return this.ComponentType;
    }
    get contentFormat(): string {
        return this.ContentFormat;
    }
    get contentType(): string {
        return this.ContentType;
    }
    get developerName(): string {
        return this.DeveloperName;
    }
    get visible(): boolean {
        return this.Visible;
    }
    get readOnly(): boolean {
        return this.ReadOnly;
    }

    get label(): string {
        return this.Label;
    }

    get displayOrder(): number {
        return this.DisplayOrder;
    }

    get typeElementPropertyId(): string {
        return this.TypeElementPropertyId;
    }

    get typeElememtPropertyToDisplayId(): string {
        return this.TypeElememtPropertyToDisplayId;
    }

    constructor(column: IFlowDisplayColumn) {
        this.Column = column;
        this.ComponentType = column.componentType;
        this.ContentFormat = column.contentFormat;
        this.ContentType = column.contentType;
        this.DeveloperName = column.developerName;
        this.DisplayOrder = column.order;
        this.Label = column.label;
        this.ReadOnly = !column.isEditable;
        this.TypeElememtPropertyToDisplayId = column.typeElememtPropertyToDisplayId;
        this.TypeElementPropertyId = column.typeElementPropertyId;
        this.Visible = column.isDisplayValue;

    }

    iFlowDisplayColumn() {
        return this.Column;
    }
}
