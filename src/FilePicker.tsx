import * as React from 'react';
import './css/FilePicker.css';

import {FlowComponent} from 'flow-component-model';

declare const manywho: any;

class FilePicker extends FlowComponent {
    selectedItem: string = null;

    text: string = '';
    fileInput: any;

    constructor(props: any) {
        super(props);

        this.fileSelected = this.fileSelected.bind(this);
        this.ResizeBase64Img = this.ResizeBase64Img.bind(this);
        this.clearFile = this.clearFile.bind(this);
        this.pickFile = this.pickFile.bind(this);
        this.getStateImage = this.getStateImage.bind(this);

    }

    async componentDidMount() {
        await super.componentDidMount();
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
            clearButton = (<span className="glyphicon glyphicon-remove file-box-header-button" onClick={this.clearFile}/>);
        }

        return (
                <div className="file-box" style={style} >
                    <div className="file-box-header">
                        <div className="file-box-header-left">
                            <span className="file-box-header-title">{caption}</span>
                        </div>
                        <div className="file-box-header-right">
                            {clearButton}
                        </div>

                    </div>
                    <div className="file-box-body" onClick={filePick}>
                        <img ref="img" className="file-image" src={this.getStateImage()}/>
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

    getStateImage(): string {
        return this.getStateValue() as string;
    }

    clearFile() {
        this.forceUpdate();
    }

    pickFile() {
        this.fileInput.click();
    }

    fileSelected() {
        if (this.fileInput.files && this.fileInput.files.length > 0) {
            const reader = new FileReader();
            reader.onload = (e: any) => {
                this.ResizeBase64Img(e.target.result, 400);
                reader.onload = null;
            };

            reader.readAsDataURL(this.fileInput.files[0]);

        }
    }

    ResizeBase64Img(base64: string, width: number) {

        const img = new Image();

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

            this.setStateValue(resized);
            img.src = resized;
            img.onload = null;
            this.forceUpdate();
        };
        img.src = base64;
    }
}

manywho.component.register('FilePicker', FilePicker);

export default FilePicker;
