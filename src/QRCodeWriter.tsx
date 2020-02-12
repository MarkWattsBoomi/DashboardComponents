import { BrowserQRCodeSvgWriter } from '@zxing/library';
import { FlowComponent } from 'flow-component-model';
import * as React from 'react';
import './css/QRCode.css';

declare const manywho: any;

class QRCodeWriter extends FlowComponent {

    writer: BrowserQRCodeSvgWriter = new BrowserQRCodeSvgWriter();

    constructor(props: any) {
        super(props);
    }

    async componentDidMount() {
        await super.componentDidMount();
    }

    render() {
        // const text: string = this.getAttribute('title', '&copy; Boomi Flow - 2019');

        const content: string = this.getStateValue() as string;
        const width: number = this.model.width || 300;
        const height: number = this.model.height || 300;
        const svgElement: any = this.writer.write(content, width, height);

        return (
            <div
                className="barcode-scanner"
            >
            <svg
                style={{width, height}}
                dangerouslySetInnerHTML={{__html: svgElement.innerHTML}} />
            </div>
        );
    }

}

manywho.component.register('QRCodeWriter', QRCodeWriter);

export default QRCodeWriter;
