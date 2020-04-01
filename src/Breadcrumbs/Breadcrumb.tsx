import React = require('react');
import { BreadcrumbEvent } from './BreadcrumbEvent';

export default class Breadcrumb extends React.Component<any, any> {

    constructor(props: any) {
        super(props);
        this.gotoBreadcrumb = this.gotoBreadcrumb.bind(this);
    }

    async gotoBreadcrumb() {
        await this.props.parent.gotoBreadcrumb(this.props.breadcrumb);
    }

    render() {

        const bce: BreadcrumbEvent = this.props.breadcrumb;

        const date: Date = new Date(bce.eventTime);

        return (
            <a
                className="breadcrumb"
                onClick={this.gotoBreadcrumb}
                title={date.toLocaleString() + ' - ' + bce.pageElementId}
            >
                {(this.props.breadcrumb as BreadcrumbEvent).pageElementName}
            </a>
        );
    }
}
