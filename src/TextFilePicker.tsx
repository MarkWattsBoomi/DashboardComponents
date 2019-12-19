
import {FlowComponent} from 'flow-component-model';
import * as React from 'react';
import './css/FilePicker.css';
declare const manywho: any;

class TextFilePicker extends FlowComponent {

    fileInput: any;
    selectedItem: string;

    constructor(props: any) {
        super(props);

        this.fileSelected = this.fileSelected.bind(this);
        this.clearFile = this.clearFile.bind(this);
        this.pickFile = this.pickFile.bind(this);

    }

    async componentDidMount() {
        await super.componentDidMount();
    }

    render() {

        let filePick: any;
        const caption: string = this.getAttribute('title') || 'Select File';
        const width = this.model.width + 'px';
        const height = this.model.height + 'px';

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
                    <span>{this.selectedItem}</span>
                    <input ref={(e: any) => {this.fileInput = e; }} type="file" className="file-file" onChange={this.fileSelected}/>
                </div>
            </div>
        );
    }

    clearFile() {
        // implement one day
    }

    pickFile() {
        this.fileInput.click();
    }

    fileSelected() {

        if (this.fileInput.files && this.fileInput.files.length > 0) {
            const reader = new FileReader();
            reader.onload = (e: any) => {
                const fileData = btoa(e.target.result);
                this.setStateValue(fileData);
            };
            this.selectedItem = this.fileInput.files[0].name;
            this.forceUpdate();
            reader.readAsBinaryString(this.fileInput.files[0]);

        }
    }

}

manywho.component.register('TextFilePicker', TextFilePicker);

export default TextFilePicker;
