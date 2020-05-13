import * as React from 'react';
import PDFViewer from './PDFViewer';
import './PDFViewer.css';

export default class PDFViewerNav extends React.Component<any, any> {

    constructor(props: any) {
        super(props);
        this.firstPage = this.firstPage.bind(this);
        this.previousPage = this.previousPage.bind(this);
        this.nextPage = this.nextPage.bind(this);
        this.lastPage = this.lastPage.bind(this);
    }

    async firstPage() {
        const parent: PDFViewer = this.props.parent;
        parent.firstPage();
    }

    async previousPage() {
        const parent: PDFViewer = this.props.parent;
        parent.previousPage();
    }

    async nextPage() {
        const parent: PDFViewer = this.props.parent;
        parent.nextPage();
    }

    async lastPage() {
        const parent: PDFViewer = this.props.parent;
        parent.lastPage();
    }

    render() {
        const parent: PDFViewer = this.props.parent;
        const navLeft: string = '';
        const navRight: string = '';

        return (
            <div
                className="pdfv-nav"
            >
                <div
                    className="pdfv-nav-floater"
                >
                    <span
                        className={'glyphicon glyphicon-step-backward pdfv-nav-button ' + navLeft}
                        onClick={this.firstPage}
                    />
                    <span
                        className={'glyphicon glyphicon-triangle-left pdfv-nav-button ' + navLeft}
                        onClick={this.previousPage}
                    />
                    <span
                        className="pdfv-nav-label"
                    >
                        Page {parent.currentPage} of {parent.pageCount}
                    </span>
                    <span
                        className={'glyphicon glyphicon-triangle-right pdfv-nav-button ' + navRight}
                        onClick={this.nextPage}
                    />
                    <span
                        className={'glyphicon glyphicon-step-forward pdfv-nav-button ' + navRight}
                        onClick={this.lastPage}
                    />
                </div>
            </div>
        );
    }
}
