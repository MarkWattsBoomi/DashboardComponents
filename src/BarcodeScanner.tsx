const Quagga = require('quagga');
import * as React from 'react';
// import { Text, View, StyleSheet,Alert,TouchableOpacity, Image } from 'react-native';
// import Camera from 'react-native-camera';
import './css/BarcodeScanner.css';
import {FlowComponent} from '/Operational Data/Flow UI Custom Components/2019 Version/FlowComponentModel/src/FlowComponent';
import { eContentType } from '/Operational Data/Flow UI Custom Components/2019 Version/FlowComponentModel/src/FlowField';
import { FlowObjectData } from '/Operational Data/Flow UI Custom Components/2019 Version/FlowComponentModel/src/FlowObjectData';
import { FlowObjectDataProperty } from '/Operational Data/Flow UI Custom Components/2019 Version/FlowComponentModel/src/FlowObjectDataProperty';
import { IManywho } from '/Operational Data/Flow UI Custom Components/2019 Version/FlowComponentModel/src/interfaces';

declare const manywho: IManywho;

class BNFEntry {
    name: string;
    manufacturer: string;
    ean: string;
    mg: number;

    constructor(item: FlowObjectData) {
        this.name = item.properties['name'].value as string;
    }
}

class BarcodeScanner extends FlowComponent {

    video: any;
    code: string;
    type: string;
    scanning: boolean = false;
    identifySuccess: boolean = false;

    bnf: any = {};

    constructor(props: any) {
        super(props);
        this.onBarCodeRead = this.onBarCodeRead.bind(this);
        this.startScan = this.startScan.bind(this);
        this.acceptResult = this.acceptResult.bind(this);
        this.addToBNF = this.addToBNF.bind(this);
        this.loadBNF = this.loadBNF.bind(this);
        this.lookupBarcode = this.lookupBarcode.bind(this);
    }

    async componentDidMount() {
        await super.componentDidMount();
        const video = this.video;
        const self = this;
        this.loadBNF();
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({video :  {facingMode: 'environment'}})
            .then(function(stream: any) {
                video.srcObject = stream;
                video.play();
                self.startScan();
            });
        } else {

        }
    }

    loadBNF() {
        for (const medicine of this.model.dataSource.items) {
            this.bnf[medicine.properties['ean'].value as string] = medicine;
        }
    }

    lookupBarcode(barcode: string): FlowObjectData {
        if (this.bnf[barcode]) {
            return this.bnf[barcode];
        }
        return null;
    }

    async acceptResult() {
        const acceptOutcome: string = this.getAttribute('acceptOutcome', 'accept');
        // alert(acceptOutcome);
        if (acceptOutcome !== '') {
            // alert('triggering');
            await this.triggerOutcome(acceptOutcome);
        }
    }

    async addToBNF() {
        const addOutcome: string = this.getAttribute('addOutcome', 'add');
        // alert(acceptOutcome);
        if (addOutcome !== '') {
            // alert('triggering');
            await this.triggerOutcome(addOutcome);
        }
    }

    startScan() {
        this.code = '';
        this.type = '';
        this.forceUpdate();
        const video = this.video;
        const self = this;
        this.identifySuccess = false;
        Quagga.init(
            {
                halfSample: false,
                numOfWorkers: 0,
                debug: {
                    showCanvas: true,
                    drawBoundingBox: true,
                    showFrequency: true,
                    drawScanline: true,
                    showPattern: true,
                },
                inputStream: {
                    name: 'live',
                    type: 'LiveStream',
                    target: video,
                },
                decoder: {
                    readers: [
                        'ean_reader',
                        // 'code_128_reader',
                        // 'ean_8_reader',
                        // 'code_39_reader',
                        // 'code_39_vin_reader',
                        // 'codabar_reader',
                        // 'upc_reader',
                        // 'upc_e_reader',
                        // 'i2of5_reader',
                        // '2of5_reader',
                        // 'code_93_reader',
                    ],
                },
            },
            function(err: any) {
                if (err) {
                    console.log(err);
                    return;
                } else {
                    self.scanning = true;
                    console.log('reading');
                    self.forceUpdate();
                    Quagga.onDetected(self.onBarCodeRead);
                    Quagga.start();
                }
            },
            );
    }

    onBarCodeRead = (data: any) => {
        const medicine: FlowObjectData = this.lookupBarcode(data.codeResult.code);

        if (medicine && medicine !== null) {
            const taken: FlowObjectData = FlowObjectData.newInstance('TakenMedicine');
            taken.addProperty(FlowObjectDataProperty.newInstance('Name', eContentType.ContentString, medicine.properties['Name'].value));
            taken.addProperty(FlowObjectDataProperty.newInstance('Dose', eContentType.ContentNumber, medicine.properties['DosageMg'].value));
            taken.addProperty(FlowObjectDataProperty.newInstance('MedicineId', eContentType.ContentString, medicine.properties['ean'].value));
            taken.addProperty(FlowObjectDataProperty.newInstance('WhenTaken', eContentType.ContentDateTime, new Date().toISOString()));
            taken.isSelected = false;

            this.setStateValue(taken);
            this.code = (medicine.properties['Name'].value as string) + ' ' + (medicine.properties['DosageMg'].value as string) + 'mg ' + (medicine.properties['manufacturer'].value as string);

            this.identifySuccess = true;
        } else {
            const taken: FlowObjectData = FlowObjectData.newInstance('TakenMedicine');
            taken.addProperty(FlowObjectDataProperty.newInstance('Name', eContentType.ContentString, data.codeResult.code));
            taken.addProperty(FlowObjectDataProperty.newInstance('Dose', eContentType.ContentNumber, 0));
            taken.addProperty(FlowObjectDataProperty.newInstance('MedicineId', eContentType.ContentString, data.codeResult.code));
            taken.addProperty(FlowObjectDataProperty.newInstance('WhenTaken', eContentType.ContentDateTime, new Date().toISOString()));
            taken.isSelected = false;

            this.setStateValue(taken);
            this.code = data.codeResult.code;
            this.type = data.codeResult.format;
            this.identifySuccess = false;
        }

        Quagga.stop();
        this.scanning = false;
        this.forceUpdate();
        }

    fake = () => {
        this.onBarCodeRead({codeResult: {code: '9999999999999'}});
            }

    render() {
        const text: string = this.getAttribute('title', '&copy; Boomi Flow - 2019');
        let control: any;
        let result: any;

        if (this.scanning === true) {
            control = (
                <div className="barcode-scanner-control-box">
                    <span className="barcode-scanner-message" onDoubleClick={this.fake}>scanning</span>
                    </div>
            );
        }
        /*
        else {
            control = (
                <div className="barcode-scanner-control-box">
                    <button className="barcode-scanner-button" onClick={this.startScan}>Scan</button>
                    <button className="barcode-scanner-button" onClick={this.acceptResult}>Accept</button>
                </div>
            );
        }*/
        let actionButton: any;
        if (this.identifySuccess === true) {
            actionButton = (
                <button className="barcode-scanner-button" onClick={this.acceptResult}>Accept</button>
            );
        } else {
            actionButton = (
                <button className="barcode-scanner-button" onClick={this.addToBNF}>Add to BNF</button>
            );
        }

        if (this.code  && this.code.length > 0) {
            result = (
            <div className="barcode-scanner-result-box">
                <div className="barcode-scanner-result-box-client">
                    <div className="barcode-scanner-result-row">
                        <span className="barcode-scanner-result">{this.code}</span>
                    </div>
                    <div className="barcode-scanner-result-row">
                        <span className="barcode-scanner-button-bar">
                            <button className="barcode-scanner-button" onClick={this.startScan}>Scan</button>
                            {actionButton}
                        </span>
                    </div>
                </div>
            </div>
            );
        }
        return (
            <div className="barcode-scanner">
                <video ref={(me: any) => {this.video = me; }} className="barcode-scanner-canvas" autoPlay={true}>
                </video>
                {control}
                {result}
            </div>
                );
    }

}

manywho.component.register('BarcodeScanner', BarcodeScanner);

export default BarcodeScanner;
