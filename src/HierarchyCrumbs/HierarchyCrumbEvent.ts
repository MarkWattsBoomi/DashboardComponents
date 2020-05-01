export class HierarchyCrumbEvent {

    public static fromStorage(storage: any): HierarchyCrumbEvent {
        const hce: HierarchyCrumbEvent = new HierarchyCrumbEvent(
            storage.pageElementId,
            storage.pageElementName,
            storage.eventTime,
            storage.eventType,
            storage.stateId,
            storage.stateToken,
            storage.runUri,
        );
        if (storage.child) {
            hce.child = HierarchyCrumbEvent.fromStorage(storage.child);
        }
        return hce;
    }

    public pageElementId: string;
    public pageElementName: string;
    public eventTime: Date;
    public eventType: string;
    public stateId: string;
    public stateToken: string;
    public runUri: string;
    public child: HierarchyCrumbEvent;

    constructor(
        pageElementId: string,
        pageElementName: string,
        eventTime: Date,
        eventType: string,
        stateId: string,
        stateToken: string,
        runUri: string,
    ) {
        this.pageElementId = pageElementId;
        this.pageElementName = pageElementName;
        this.eventTime = eventTime;
        this.eventType = eventType;
        this.stateId = stateId;
        this.stateToken = stateToken;
        this.runUri = runUri;
    }

    public spliceCrumb(child: HierarchyCrumbEvent) {
        if (!this.child) {
            this.child = child;
        } else {
            if (this.child.pageElementId === child.pageElementId) {
                // i moved up - ignore
            } else {
                this.child.spliceCrumb(child);
            }
        }
    }

    public sliceCrumb(child: HierarchyCrumbEvent) {
        if (this.child.pageElementId === child.pageElementId) {
            this.child = null;
        } else {
            this.child.sliceCrumb(child);
        }
    }
}
