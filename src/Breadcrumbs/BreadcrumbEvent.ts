export class BreadcrumbEvent {
    public pageElementId: string;
    public pageElementName: string;
    public eventTime: Date;
    public eventType: string;

    constructor(pageElementId: string, pageElementName: string, eventType: string) {
        this.pageElementId = pageElementId;
        this.pageElementName = pageElementName;
        this.eventTime = new Date();
        this.eventType = eventType;
    }
}
