import React = require('react');
import { BreadcrumbEvent } from './BreadcrumbEvent';
import BreadcrumbHistoryItem from './BreadcrumbHistoryItem';

export default class BreadcrumbHistory extends React.Component<any, any> {

    expanded: boolean = false;
    constructor(props: any) {
        super(props);
        this.gotoBreadcrumb = this.gotoBreadcrumb.bind(this);
        this.toggleExpand = this.toggleExpand.bind(this);
    }

    showMore() {
        this.expanded = !this.expanded;
        this.forceUpdate();
    }

    toggleExpand() {
        this.expanded = !this.expanded;
        this.forceUpdate();
    }

    async gotoBreadcrumb(breadcrumb: BreadcrumbEvent) {
        this.toggleExpand();
        await this.props.parent.gotoBreadcrumb(breadcrumb);
    }

    render() {
        // const date: Date = new Date((this.props.breadcrumb as BreadcrumbEvent).eventTime);
        let content: any;
        let popout: any;

        if (this.expanded === false) {
            content = (
                <span
                className="breadcrumbs-history-elipse glyphicon glyphicon-option-vertical"
                onClick={this.toggleExpand}
                title="History"
                />
            );
        } else {
            content = (
                <span
                className="breadcrumbs-history-elipse glyphicon glyphicon-option-horizontal"
                onClick={this.toggleExpand}
                title="History"
                />
            );

            const historyItems: any[] = [];
            (this.props.breadcrumbs as BreadcrumbEvent[]).forEach((breadcrumb: BreadcrumbEvent) => {
                if (breadcrumb.eventType === 'ARRIVE') {
                historyItems.push(
                    <BreadcrumbHistoryItem
                        parent={this}
                        breadcrumb={breadcrumb}
                    />,
                );
                }
            });
            popout = (
                <div
                    className="breadcrumbs-history-popout"
                >
                    {historyItems}
                </div>
            );
        }
        return (
            <div
                style={{display: 'flex', position: 'relative'}}
            >
                {content}
                {popout}
            </div>

        );
    }
}
