import * as React from 'react';

import {eContentType, eLoadingState, FlowComponent, FlowField, FlowObjectData, FlowObjectDataArray, FlowObjectDataProperty} from 'flow-component-model';
import './SectionRepeater.css';
declare const manywho: any;

export default class SectionRepeater extends FlowComponent {

    repeaterItems: any[];
    comments: Map<number, any[]> = new Map();

    constructor(props: any) {
        super(props);
    }

    async componentDidMount() {
        await super.componentDidMount();

        // this.repeaterItems = this.datasource.objectData;
        const commentsField: string = this.getAttribute('CommentsField', '');
        if (commentsField.length > 0) {
            const field: FlowField =  await this.loadValue(commentsField) as FlowField;
            (field.value as FlowObjectDataArray).items.forEach((item: FlowObjectData) => {
                const approvalId: number = item.properties['approvalid'].value as number;
                if (!this.comments.has(approvalId)) {
                    this.comments.set(approvalId, []);
                    this.comments.get(approvalId).push(item);
                }
            });
        }
        this.forceUpdate();
    }

    render() {

        // const caption: string = this.getAttribute('title') || 'Click to select file';
        // const width = (this.model.width > 99 ? this.model.width + 'px' : '100%') ;
        // const height = (this.model.height > 99 ? this.model.height  + 'px' : '100%')  ;

        const style: any = {};
        style.width = '100%';
        // style.height = height;

        let header: any;

        const repeatedElements: any[] = [];

        if (this.loadingState === eLoadingState.ready) {
            this.model.dataSource.items.forEach((item: FlowObjectData) => {
                const appDate: Date = new Date(item.properties.approval_date.value as string);
                const appName: string = item.properties.approver.value as string;
                const appEmail: string = item.properties.approver_email.value as string;
                const appResult: string = item.properties.approval_result.value as string;
                const appId: number = item.properties.approvalid.value as number;

                let appIcon: any;
                if (appResult.toUpperCase() === 'A') {
                    appIcon = (<span className="srep-header-result glyphicon glyphicon-ok" style={{color: '#90c590'}}/>);
                } else {
                    appIcon = (<span className="srep-header-result glyphicon glyphicon-remove" style={{color: '#ff7373'}}/>);
                }

                // get comments
                const comments: any[] = [];
                if (this.comments.get(appId)) {
                    this.comments.get(appId).forEach((comment: FlowObjectData) => {
                        comments.push(
                            <div
                                className="srep-comment"
                            >
                                {comment.properties.comment_text.value}
                            </div>,
                        );
                    });
                }

                repeatedElements.push(
                    <div
                        className="srep-item"
                        style={style}
                    >
                        <div
                            className="srep-header"
                        >
                            <span
                                className="srep-header-date"
                            >
                            {appDate.toLocaleString()}
                            </span>
                            <span
                                className="srep-header-approver"
                            >
                                {appName + '( ' + appEmail + ' )'}
                            </span>
                            {appIcon}
                        </div>
                        <div
                            className="srep-body"
                        >
                            {comments}
                        </div>
                </div>,
                );
            });
        }

        return (
                <div
                    className="srep"
                    style={style}
                >
                    {repeatedElements}
               </div>
        );
    }

}

manywho.component.register('SectionRepeater', SectionRepeater);
