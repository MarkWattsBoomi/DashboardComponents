import React = require('react');

export default class BreadcrumbMore extends React.Component<any, any> {

    constructor(props: any) {
        super(props);
        this.showMore = this.showMore.bind(this);
    }

    showMore() {
        this.props.parent.showMore();
    }

    render() {
        return (
            <span
                className="breadcrumb-more"
                title="More"
                onClick={this.showMore}
            >
                ...
            </span>
        );
    }
}
