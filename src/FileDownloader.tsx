
import { eLoadingState, FlowComponent, FlowObjectData } from 'flow-component-model';
import * as React from 'react';
import './css/FileDownloader.css';

declare const manywho: any;

class FileDownloader extends FlowComponent {

    async componentDidMount() {
        await super.componentDidMount();
        this.forceUpdate();
    }

    render() {
        if (this.loadingState !== eLoadingState.ready) {
            return <div className="file-box"/>;
        }

        const od: FlowObjectData = (this.getStateValue() as unknown) as FlowObjectData;

        let fileName: string;
        let extension: string;
        let size: number = 0;
        let mimeType: string;
        let base64: string;

        // = 'data:binary/octet-stream;base64,';

        if (od) {
            fileName = od.properties.FileName.value as string;
            extension = od.properties.Extension.value as string;
            size = od.properties.Size.value as number;
            mimeType = od.properties.MimeType.value as string;
            base64 = (od.properties.Content.value as string).split(',')[1];
        }

        const byteString = atob(base64);

        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        const blob = new Blob([ab], {type: mimeType});

        const objectURL = URL.createObjectURL(blob);

        const caption: string = this.getAttribute('title', 'File Downloader');
        const icon: string = this.getAttribute('icon', 'envelope');
        const className: string = 'glyphicon glyphicon-' + icon + ' icon-button';
        const iconSize: number = parseInt(this.getAttribute('pointSize', '24'));
        const iconStyle: React.CSSProperties = { fontSize: iconSize + 'pt' };
        const outcome: string = this.getAttribute('onClickOutcome', '');

        const download = fileName + (extension.length > 0 ? '.' + extension : '');

        return (
        <div className="file-box"  >
            <div className="file-box-body">
                <a
                    download={download}
                    href={objectURL}
                    onClick={async (e: any) => {if (outcome.length > 0) {await this.triggerOutcome(outcome); }}}
                >
                    <span className={className} style={iconStyle} title={caption}/>
                </a>
            </div>
        </div>
        );
    }

}

manywho.component.register('FileDownloader', FileDownloader);

export default FileDownloader;
