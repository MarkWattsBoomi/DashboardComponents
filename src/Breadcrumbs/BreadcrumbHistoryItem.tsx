import React = require('react');
import { BreadcrumbEvent } from './BreadcrumbEvent';

export default class BreadcrumbHistoryItem extends React.Component<any, any> {

    constructor(props: any) {
        super(props);
        this.gotoBreadcrumb = this.gotoBreadcrumb.bind(this);
    }

    async gotoBreadcrumb() {
        await this.props.parent.gotoBreadcrumb(this.props.breadcrumb);
    }

    render() {
        const date: Date = new Date((this.props.breadcrumb as BreadcrumbEvent).eventTime);
        return (
            <a
                className="breadcrumb-history-item"
                onClick={this.gotoBreadcrumb}
                title={date.toLocaleString()}
            >
                {(this.props.breadcrumb as BreadcrumbEvent).pageElementName + ' ' + date.toLocaleString()}
            </a>
        );
    }
}
