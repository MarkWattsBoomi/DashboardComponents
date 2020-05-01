import React = require('react');
import { HierarchyCrumbEvent } from './HierarchyCrumbEvent';

export default class HierarchyCrumb extends React.Component<any, any> {

    constructor(props: any) {
        super(props);
        this.gotoHierarchyCrumb = this.gotoHierarchyCrumb.bind(this);
    }

    async gotoHierarchyCrumb() {
        await this.props.parent.gotoBreadcrumb(this.props.crumb);
    }

    render() {

        const bce: HierarchyCrumbEvent = this.props.crumb;

        const date: Date = new Date(bce.eventTime);

        return (
            <a
                className="hc-crumb"
                onClick={this.gotoHierarchyCrumb}
                title={date.toLocaleString() + ' - ' + bce.pageElementId}
            >
                {bce.pageElementName}
            </a>
        );
    }
}
