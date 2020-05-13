import * as React from 'react';
import './PDFViewer.css';

import {eContentType, eLoadingState, FlowComponent, FlowObjectData, FlowObjectDataProperty} from 'flow-component-model';
import { Document, Page, pdfjs  } from 'react-pdf';
import PDFViewerNav from './PDFViewerNav';
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
// import { Document } from 'react-pdf/dist/entry.webpack';

declare const manywho: any;

class PDFViewer extends FlowComponent {
    currentPage: number = 1;
    pageCount: number;

    fileContent: any;
    mimeType: string;
    content: any;
    pageNav: any;
    fileInput: any;
    nav: PDFViewerNav;

    constructor(props: any) {
        super(props);
        this.pdfLoaded = this.pdfLoaded.bind(this);
        this.pdfLoadFailed = this.pdfLoadFailed.bind(this);
        this.loadDocument = this.loadDocument.bind(this);
        this.prepContent = this.prepContent.bind(this);
        this.pickFile = this.pickFile.bind(this);
        this.fileSelected = this.fileSelected.bind(this);
        this.fileReadAsDataURL = this.fileReadAsDataURL.bind(this);
        this.moved = this.moved.bind(this);
    }

    async componentDidMount() {
        (manywho as any).eventManager.addDoneListener(this.moved, this.componentId);
        await super.componentDidMount();
        this.loadDocument();
        this.forceUpdate();
    }

    async componentWillUnmount(): Promise<void> {
        (manywho as any).eventManager.removeBeforeSendListener(this.componentId);
        return Promise.resolve();
    }

    async moved(xhr: XMLHttpRequest, request: any) {
        // this handles the new subflow concept.
        // the flow could have moved to a sub flow and if so we need to reload all data
        if ((xhr as any).invokeType === 'FORWARD') {
            this.loadDocument();
            this.forceUpdate();
        }
    }

    loadDocument() {
        if (this.loadingState === eLoadingState.ready) {
            const file: any = this.getStateValue() as FlowObjectData;

            if (file) {
                if (this.model.contentType === 'ContentString') {
                    // could be a url
                    if ((file as string).startsWith('http')) {
                        this.mimeType = (file as string).substring((file as string).lastIndexOf('.') + 1);
                        this.fileContent = file;
                    } else {
                        this.mimeType = file.substring(file.indexOf(':') + 1, file.indexOf(';'));
                        this.fileContent = file; // .split(',')[1];
                    }

                } else {
                    // assume object
                    this.mimeType = file.properties.MimeType.value;
                    if ((file.properties.Content.value as string).startsWith('http')) {
                        this.fileContent = file.properties.Content.value;
                    } else {
                        this.fileContent = file.properties.Content.value; // .split(',')[1];
                    }
                }
                this.prepContent();
            }

        }
    }

    prepContent() {
        if (this.fileContent && this.fileContent.length > 0) {
            this.content = (
                <div
                    className="pdfv-body-scroller"
                >
                    <Document
                        file={this.fileContent}
                        onLoadSuccess={this.pdfLoaded}
                        onLoadError={console.error}
                    >
                    <Page pageNumber={this.currentPage} />
                    </Document>

                </div>
            );

            this.pageNav = (
                <PDFViewerNav
                    parent={this}
                    ref={(element: PDFViewerNav) => {this.nav = element; }}
                />
            );
        }
    }

    render() {

        const caption: string = this.getAttribute('title') || 'Click to select file';
        const width = (this.model.width > 99 ? this.model.width + 'px' : '100%') ;
        const height = (this.model.height > 99 ? this.model.height  + 'px' : '100%')  ;

        const style: any = {};
        style.width = '100%';
        style.height = height;

        let header: any;

        if (this.model.readOnly === false) {
            header = (
                <div
                    className="pdfv-header"
                    onClick={this.pickFile}
                >
                    <span
                        className="pdfv-header-title"
                    >
                        {caption}
                    </span>
                </div>
            );
        }

        return (
                <div
                    className="pdfv"
                    style={style}
                >
                    <input
                        ref={(ele: any) => {this.fileInput = ele; }}
                        type="file"
                        className="file-file"
                        onChange={this.fileSelected}
                        accept="application/pdf"
                    />
                    {header}
                    {this.pageNav}
                    <div
                        className="pdfv-body"
                    >
                        {this.content}
                    </div>
               </div>
        );
    }

    firstPage() {
        this.currentPage = 1;
        this.prepContent();
        this.forceUpdate();
    }

    previousPage() {
        if (this.currentPage > 0) {
            this.currentPage = this.currentPage - 1;
            this.prepContent();
            this.forceUpdate();
        }
    }

    nextPage() {
        if (this.currentPage < this.pageCount) {
            this.currentPage = this.currentPage + 1;
            this.prepContent();
            this.forceUpdate();
        }
    }

    lastPage() {
        this.currentPage = this.pageCount;
        this.prepContent();
        this.forceUpdate();
    }

    pdfLoaded(pdf: any) {
        this.pageCount = pdf.numPages;
        this.nav.forceUpdate();
    }

    pdfLoadFailed(pdf: any) {
        console.log('error');
    }

    pickFile() {
        this.fileInput.value = '';
        this.fileInput.click();
    }

    async fileSelected(e: any) {
        if (this.fileInput.files && this.fileInput.files.length > 0) {
            const file: File = this.fileInput.files[0];
            const dataURL: string = await this.fileReadAsDataURL(file);
            const fname: string = file.name.lastIndexOf('.') >= 0 ? file.name.substring(0, file.name.lastIndexOf('.')) : file.name;
            const ext: string = file.name.lastIndexOf('.') >= 0 ? file.name.substring(file.name.lastIndexOf('.') + 1).toLowerCase() : '';
            const typ: string = file.type;
            const size: number = file.size;

            let objData: any;

            if (this.model.contentType === 'ContentString') {
                objData = dataURL;
            } else {
                // assume object
                objData = FlowObjectData.newInstance('FileData');
                objData.addProperty(FlowObjectDataProperty.newInstance('FileName', eContentType.ContentString, fname));
                objData.addProperty(FlowObjectDataProperty.newInstance('Extension', eContentType.ContentString, ext));
                objData.addProperty(FlowObjectDataProperty.newInstance('MimeType', eContentType.ContentString, typ));
                objData.addProperty(FlowObjectDataProperty.newInstance('Size', eContentType.ContentNumber, size));
                objData.addProperty(FlowObjectDataProperty.newInstance('Content', eContentType.ContentString, dataURL));
            }

            await this.setStateValue(objData);

            if (this.getAttribute('onSelected', '').length > 0) {
                await this.triggerOutcome(this.getAttribute('onSelected', ''));
            }

            this.fileContent = dataURL;
            this.prepContent();
            this.forceUpdate();
        }
    }

    async fileReadAsDataURL(file: any): Promise<any> {
        const reader = new FileReader();

        return new Promise((resolve, reject) => {
            reader.onerror = () => {
                reader.abort();
                reject(new DOMException('Problem reading file'));
            };
            reader.onload = () => {
                resolve(reader.result);
            };
            reader.readAsDataURL(file);
        });
    }

}

manywho.component.register('PDFViewer', PDFViewer);

export default PDFViewer;
