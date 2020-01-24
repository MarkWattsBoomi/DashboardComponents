import * as React from 'react';
import './css/ImageDisplay.css';

import {eLoadingState, FlowComponent, FlowObjectData} from 'flow-component-model';
import { HTMLProps } from 'react';

declare const manywho: any;

class ImageDisplay extends FlowComponent {
    selectedItem: string = null;
    imgDiv: any;
    img: any;
    text: string = '';
    fileInput: any;

    constructor(props: any) {
        super(props);
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
                <div className="image-display"
                    style={{width}}
                >
                    {content}
               </div>
        );
    }

    rescaleImage(e: any) {
        const width: number = this.img.width;
        const height: number = this.img.height;
        if (width >= height) {
            this.img.style.width = '100%';
            this.img.style.height = 'auto';
            this.imgDiv.style.flexDirection = 'column';
        } else {
            this.img.style.width = 'auto';
            this.img.style.height = '100%';
            this.imgDiv.style.flexDirection = 'row';
        }
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
}

manywho.component.register('ImageDisplay', ImageDisplay);

export default ImageDisplay;
