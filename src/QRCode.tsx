import { BrowserQRCodeReader, ITFReader, Result } from '@zxing/library';
import { eContentType, FlowComponent, FlowObjectData, FlowObjectDataProperty } from 'flow-component-model';
import * as React from 'react';
import './css/QRCode.css';

declare const manywho: any;
enum eScanStatus {
    init,
    scanning,
    paused,
    detected,
}

class QRCodeReader extends FlowComponent {
    
    reader: BrowserQRCodeReader = new BrowserQRCodeReader();
    video: HTMLVideoElement;
    code: string;
    type: string;
    scanStat: eScanStatus;
    identifySuccess: boolean = false;

    staticImage: boolean = true;
    imageData: ImageData;

    bnf: any = {};

    constructor(props: any) {
        super(props);
        this.startScan = this.startScan.bind(this);
        this.acceptResult = this.acceptResult.bind(this);
        this.startScan = this.startScan.bind(this);
        this.stopScan = this.stopScan.bind(this);
        this.cancel = this.cancel.bind(this);
        this.scanStat = eScanStatus.init;

    }

    async componentDidMount() {
        await super.componentDidMount();
        const video = this.video;
        
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            let stream = await navigator.mediaDevices.getUserMedia({video :  {facingMode: 'environment'}});
            video.srcObject = stream;
            await video.play();
            this.startScan();
            this.forceUpdate();
        } 
        else {

        }
        
      }

    async acceptResult() {
        const acceptOutcome: string = this.getAttribute('acceptOutcome', 'accept');
        // alert(acceptOutcome);
        if (acceptOutcome !== '') {
            // alert('triggering');
            await this.triggerOutcome(acceptOutcome);
        }
    }

    async stopScan() {
        if(this.scanStat !== eScanStatus.scanning)
        {
            console.log("not scanning - can't stop");
            this.forceUpdate();
        }
        else {
            this.reader.stopAsyncDecode();
            this.scanStat = eScanStatus.paused;
            this.forceUpdate();
        }
    }

    async startScan() {
    
        if(this.scanStat === eScanStatus.scanning)
        {
            console.log("already scanning - can't start");
            this.forceUpdate();
        }
        else {

            this.scanStat = eScanStatus.scanning;
            this.forceUpdate();
        
            const result: Result = await this.reader.decodeOnce(this.video);
            
            this.code = result.getText();
            await this.setStateValue(this.code);
            
            console.log("QR=" + this.code);
            this.scanStat = eScanStatus.detected;
            this.forceUpdate();

            //if outcome detected trigger it
            const outcome = this.getAttribute("OnDetect","");
            if(outcome.length> 0) {
                await this.triggerOutcome(outcome);
            }
        }
    }

    async cancel(){
        const outcome = this.getAttribute("OnCancel","");
        if(outcome.length> 0) {
            await this.stopScan();
            await this.triggerOutcome(outcome);
        } 
    }

    render() {
        const text: string = this.getAttribute('title', '&copy; Boomi Flow - 2019');
        let control: any;
        let message: string;
        let buttons: any = [];
        let result: string;

        switch (this.scanStat) {
            case eScanStatus.init:
                message = "Initialising";
                break;

            case eScanStatus.scanning:
                const outcome = this.getAttribute("OnCancel","");
                let cancelAction : any;
                if(outcome.length> 0) {
                    cancelAction = this.cancel;
                }
                else {
                    cancelAction = this.stopScan;
                }
                message = "Scanning"
                buttons.push(
                    <button 
                        className="qr-button" 
                        onClick={cancelAction}
                    >
                        Cancel
                    </button>
                );
                break;
        
            case eScanStatus.paused:
                message = "Paused";
                buttons.push(
                    <button 
                        className="qr-button" 
                        onClick={this.startScan}
                    >
                        Re-Scan
                    </button>
                );
                break;

            case eScanStatus.detected:
                    message = "QR Code Detected";
                    buttons.push(
                        <button 
                            className="qr-button" 
                            onClick={this.startScan}
                        >
                            Re-Scan
                        </button>
                    );
                    result = this.code
                    break;
        }
        
        control = (
            <div 
                style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    height: "100%",
                    width: "100%",
                    zIndex: 1000,
                    display: "flex",
                    flexDirection: "column"
                }}
            >
                <div
                    className="qr-title-bar"
                >
                    <span 
                        className="qr-title"
                    >
                        {message}
                    </span> 
                </div>
                <div
                    className="qr-result-bar"
                >
                    <div
                        style={{
                            margin: "auto"
                        }}
                    >
                        <span 
                        className="qr-result"
                        >
                            {result}
                        </span> 
                    </div>
                    
                </div>
                <div
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        flexGrow: 1
                    }}
                >
                    <div
                        style={{
                            margin: "auto"
                        }}
                    >
                        {buttons}
                    </div>
                    
                </div>             
                
            </div>
        );
        
        
        return (
            <div className="barcode-scanner">
                <video 
                    ref={(me: any) => {this.video = me; }} 
                    autoPlay={true}
                    style={{
                        position: "absolute",
                        left: 0,
                        top: 0,
                        width: "100%"
                    }}
                />
                {control}
            </div>
        );
    }

}

manywho.component.register('QRCodeReader', QRCodeReader);

export default QRCodeReader;

