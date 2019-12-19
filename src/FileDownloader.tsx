
import { eLoadingState, FlowComponent } from 'flow-component-model';
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

     const dataUri: string = 'data:binary/octet-stream;base64,' + this.getStateValue() as string;

     const caption: string = this.getAttribute('title', 'File Downloader');
     const icon: string = this.getAttribute('icon', 'envelope');
     const className: string = 'glyphicon glyphicon-' + icon + ' icon-button';
     const iconSize: number = parseInt(this.getAttribute('pointSize', '24'));
     const outcome: string = this.getAttribute('onClickOutcome', '');
     const iconStyle: React.CSSProperties = { fontSize: iconSize + 'pt' };

     return (
        <div className="file-box" >
            <div className="file-box-body">
                <a
                    download="file"
                    href={dataUri}
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
