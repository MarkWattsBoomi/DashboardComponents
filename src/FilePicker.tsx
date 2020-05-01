import * as React from 'react';
import './css/FilePicker.css';

import {eContentType, eLoadingState, FlowComponent, FlowObjectData, FlowObjectDataProperty} from 'flow-component-model';
import { HTMLProps } from 'react';

declare const manywho: any;

class FilePicker extends FlowComponent {
    selectedItem: string = null;
    imgDiv: any;
    img: any;
    text: string = '';
    fileInput: any;

    constructor(props: any) {
        super(props);
        this.fileSelected = this.fileSelected.bind(this);
        this.fileReadAsDataURL = this.fileReadAsDataURL.bind(this);
        this.ResizeBase64Img = this.ResizeBase64Img.bind(this);
        this.clearFile = this.clearFile.bind(this);
        this.pickFile = this.pickFile.bind(this);
        this.isImage = this.isImage.bind(this);
        this.rescaleImage = this.rescaleImage.bind(this);

    }

    async componentDidMount() {
        await super.componentDidMount();
        this.forceUpdate();
    }

    render() {

        let filePick: any;
        const caption: string = this.getAttribute('title') || 'Select File';
        const width = (this.model.width > 99 ? this.model.width : 100) + 'px';
        const height = (this.model.height > 99 ? this.model.height : 100)  + 'px';

        const style: any = {};
        style.width = width;
        style.height = height;

        let clearButton: any;

        if (this.model.readOnly === false) {
            filePick = this.pickFile;
            clearButton = (<span className="glyphicon glyphicon-remove file-picker-header-button" onClick={this.clearFile}/>);
        }

        let file: any;
        let mimeType: string;
        let fileContent: string;
        let content: any;
        if (this.loadingState === eLoadingState.ready) {
            file = this.getStateValue() as FlowObjectData;

            if (file) {
                if (this.model.contentType === 'ContentString') {
                    mimeType = file.substring(file.indexOf(':') + 1, file.indexOf(';'));
                    fileContent = file;
                } else {
                    // assume object
                    mimeType = file.properties.MimeType.value;
                    fileContent = file.properties.Content.value as string;
                }
                if (this.isImage(mimeType)) {
                    content = (
                        <img
                            style={{
                                maxHeight: '100%',
                                maxWidth: '100%',
                                width: 'auto',
                                height: 'auto',
                            }}
                            ref={(element: HTMLImageElement) => {this.img = element; }}
                            className="file-picker-image"
                            src={fileContent}
                            onLoad={this.rescaleImage}
                        />
                    );
                } else {
                    content = (
                        <span
                            className="file-picker-file-name"
                        >
                            {file.properties.FileName.value + '.' + file.properties.Extension.value}
                        </span>
                    );
                }
            }

        }

        return (
                <div className="file-picker"
                    style={{width}}
                >
                    <div className="file-picker-header">
                        <div className="file-picker-header-left">
                            <span className="file-picker-header-title">{caption}</span>
                        </div>
                        <div className="file-picker-header-right">
                            {clearButton}
                        </div>

                    </div>
                    <div
                        className="file-picker-body"
                        onClick={filePick}
                        ref={(element: any) => {this.imgDiv = element; }}
                        style={style}
                    >
                        {content}
                        <input
                            ref={(ele: any) => {this.fileInput = ele; }}
                            type="file"
                            className="file-file"
                            onChange={this.fileSelected}
                        />
                    </div>
               </div>
        );
    }

    rescaleImage(e: any) {
        const width: number = this.img.width;
        const height: number = this.img.height;

        // need to check on IE compatibility here - i think aspect ration is wrong in IE
        if (width >= height) {
            // this.img.style.width = '100%';
            // this.img.style.height = 'auto';
            // this.imgDiv.style.flexDirection = 'column';
        } else {
            // this.img.style.width = 'auto';
            // this.img.style.height = '100%';
            // this.imgDiv.style.flexDirection = 'row';
        }
    }

    clearFile() {
        this.forceUpdate();
    }

    pickFile() {
        this.fileInput.value = '';
        this.fileInput.click();
    }

    isImage(mimeType: string): boolean {
        switch (mimeType) {
            case 'image/jpg':
            case 'image/jpeg':
            case 'image/bmp':
            case 'image/gif':
            case 'image/giff':
            case 'image/png':
                return true;

            default:
                return false;
        }
    }

    async fileSelected(e: any) {
        if (this.fileInput.files && this.fileInput.files.length > 0) {
            const file: File = this.fileInput.files[0];
            let dataURL: string = await this.fileReadAsDataURL(file);
            const fname: string = file.name.lastIndexOf('.') >= 0 ? file.name.substring(0, file.name.lastIndexOf('.')) : file.name;
            const ext: string = file.name.lastIndexOf('.') >= 0 ? file.name.substring(file.name.lastIndexOf('.') + 1).toLowerCase() : '';
            const typ: string = file.type;
            const size: number = file.size;

            if (this.isImage(typ) && parseInt(this.getAttribute('imageSize', '0')) > 0) {
                dataURL = await this.ResizeBase64Img(dataURL, parseInt(this.getAttribute('imageSize', '0')));
            }

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

    async ResizeBase64Img(base64: string, width: number): Promise<any> {

        const img = new Image();
        return new Promise((resolve, reject) => {
            img.onload = () => {
                const aspectRatio = img.height / img.width;
                const canvas = document.createElement('canvas');

                canvas.width = width;
                canvas.height = width * aspectRatio;

                const context = canvas.getContext('2d');

                const reductionFactor = width / img.width;
                context.scale(canvas.width / img.width , canvas.height / img.height);

                context.drawImage(img, 0 , 0);
                const resized = canvas.toDataURL();
                resolve(resized);
            };
            img.onerror = () => {
                reject(new DOMException('Problem loading image file'));
            };
            img.src = base64;
        });
    }

}

manywho.component.register('FilePicker', FilePicker);

export default FilePicker;
