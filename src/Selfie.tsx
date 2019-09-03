import * as React from 'react';
import './css/Selfie.css';
import { FlowComponent } from '/Operational Data/Flow UI Custom Components/2019 Version/FlowComponentModel/src/FlowComponent';
import { IManywho } from '/Operational Data/Flow UI Custom Components/2019 Version/FlowComponentModel/src/interfaces';

declare const manywho: IManywho;

class Selfie extends FlowComponent {

    context: any;
    video: any;
    image: any;

    imageData: string;

    capturing: boolean = true;

    async componentDidMount() {
        await super.componentDidMount();
        this.captureVideo(1);
    }

    takePhoto(e: any) {
        const canvas = document.createElement('canvas');
        canvas.height = this.video.videoHeight;
        canvas.width = this.video.videoWidth;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(this.video, 0, 0, canvas.width, canvas.height);
        this.imageData =  canvas.toDataURL();
        this.setStateValue(this.imageData);

        this.capturing = false;
        this.forceUpdate();
    }

    async captureVideo(e: any) {
        this.capturing = true;
        await this.forceUpdate();
        const video = this.video;
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({video :  {facingMode: 'environment'}})
            .then(function(stream: any) {
                video.srcObject = stream;
                video.play();
            });
        } else {

        }

    }

    render() {

        // const width: number = this.model.width || 100;
        const height: number = this.model.height || 100;

        let content: any;

        if (this.capturing === true) {
            content = (
            <div
                className="selfie-inner"
            >
                <video
                    ref={(me: any) => {this.video = me; }}
                    className="selfie-video"
                    autoPlay={true}
                    onClick={(e: any) => {this.takePhoto(e); }}
                />
                <svg
                    className="selfie-svg"
                    viewBox="0 0 100 100"
                >
                    <circle cx="50" cy="50" r="40" stroke="green" stroke-width="2" fill="none" />
                </svg>
            </div>

            );
        } else {
            content = (
                <div
                    className="selfie-inner"
                >
                    <img
                        className="selfie-image"
                        ref={(me: any) => {this.image = me; }}
                        src={this.imageData}
                        onClick={(e: any) => {this.captureVideo(e); }}
                    />
                    <svg
                        className="selfie-svg"
                        viewBox="0 0 100 100"
                    >
                        <circle cx="50" cy="50" r="40" stroke="green" stroke-width="2" fill="none" />
                    </svg>

                </div>

            );
        }

        return (
        <div
            className="selfie"
        >
            {content}
        </div>
        );
    }
}

manywho.component.register('Selfie', Selfie);

export default Selfie;
