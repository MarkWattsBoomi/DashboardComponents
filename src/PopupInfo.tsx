
declare var manywho: any;

import { FlowComponent, ModalDialog, modalDialogButton } from 'flow-component-model';
import * as React from 'react';
import './css/PopupInfo.css';

class PopupInfo extends FlowComponent {
    dialogVisible: boolean = false;
    dialogTitle: string = '';
    dialogButtons: any = [];
    dialogContent: any;
    dialogOnClose: any;
    dialogForm: any;

    constructor(props: any) {
        super(props);

        this.showPopup = this.showPopup.bind(this);
        this.showDialog = this.showDialog.bind(this);
        this.hideDialog = this.hideDialog.bind(this);
    }

    async componentDidMount() {
        await super.componentDidMount;
        this.forceUpdate();
    }

    showPopup() {

        const popupTitle: string = this.getAttribute('PopupTitle') || '';
        const popupCancel: string = this.getAttribute('PopupCancelButton') || 'Close';
        const messageContent: string = this.getStateValue() as string;

        const content: any = [];

        content.push(
            <div dangerouslySetInnerHTML={{__html: messageContent}}/>,
        );

        const buttons: modalDialogButton[] = [];
        buttons.push(new modalDialogButton(popupCancel, this.hideDialog));

        this.showDialog(popupTitle, content, this.hideDialog, buttons);
    }

    async showDialog(title: string, content: any, onClose: any, buttons: modalDialogButton[]) {
        this.dialogVisible = true;
        this.dialogTitle = title;
        this.dialogContent = content;
        this.dialogOnClose = onClose;
        this.dialogButtons = buttons;
        return this.forceUpdate();
    }

    async hideDialog() {
        this.dialogVisible = false;
        this.dialogTitle = '';
        this.dialogContent = undefined;
        this.dialogOnClose = undefined;
        this.dialogButtons = [];
        this.dialogForm = undefined;
        return this.forceUpdate();
    }

    render() {

        const icon: string = this.getAttribute('Icon') || 'wrench';
        const iconPointSize: number = parseInt(this.getAttribute('IconFontSizePoints') || '18');
        const iconTooltip: string = this.getAttribute('IconTooltip') || 'Click';
        const iconColour: string = this.getAttribute('IconColour') || '#000000';

        let popup: any;
        if (this.dialogVisible) {
            popup = (
                <ModalDialog
                    title={this.dialogTitle}
                    buttons={this.dialogButtons}
                    onClose={this.dialogOnClose}
                >
                    {this.dialogContent}
                </ModalDialog>
            );

        }

        const iconClass = 'glyphicon glyphicon-' + icon + ' popup-info-icon';
        const iconStyle = {'font-size': iconPointSize , 'color': iconColour};
        return <div className="popup-info">
                   <span
                        className={iconClass}
                        style={iconStyle}
                        title={iconTooltip}
                        onClick={this.showPopup}
                    />
                    {popup}
               </div>;
    }

}

manywho.component.register('PopupInfo', PopupInfo);

export default PopupInfo;
