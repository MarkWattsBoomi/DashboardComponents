import { eLoadingState, eSortOrder, FlowObjectDataArray, FlowPage } from 'flow-component-model';

import * as React from 'react';
// import { calculateValue } from './common-functions';
import './css/Common.css';
import './css/NavigationMenu.css';
import { NavigationMenuItem } from './NavigationMenuItem';

declare const manywho: any;

export class NavigationMenu extends FlowPage {

    waitSpinner = 'https://media.giphy.com/media/6Egwsh5J2kvhmXALVu/giphy.gif';

    constructor(props: any) {
        super(props);
        this.openPage = this.openPage.bind(this);
        this.openTab = this.openTab.bind(this);
        this.openOutcome = this.openOutcome.bind(this);
        this.closeApplication = this.closeApplication.bind(this);
        this.executeFunction = this.executeFunction.bind(this);
        this.move = this.move.bind(this);
    }

    async componentDidMount() {
        await super.componentDidMount();
        this.forceUpdate();
    }

    render() {
        if (this.loadingState === eLoadingState.ready) {

            // the datasource tells us the name of the menu items array

            const menuItems: FlowObjectDataArray = this.model.dataSource;
            const logo: string = this.calculateValue(this.getAttribute('logo', ''));
            const title: string = this.calculateValue(this.getAttribute('title', ''));
            const hideUserAnonymous: boolean = this.calculateValue(this.getAttribute('hide-user-anonymous', 'false')).toLowerCase() === 'true' ? true : false;
            const hideUser: boolean = this.calculateValue(this.getAttribute('hide-user', 'false')).toLowerCase() === 'true' ? true : false;
            const hideUserText: boolean = this.calculateValue(this.getAttribute('hide-user-text', 'false')).toLowerCase() === 'true' ? true : false;
            const subTitle: string = ''; // this.getAttribute('sub-title', '');

            const userName: string = this.user.firstName + ' ' + this.user.lastName;
            const userId: string = this.user.email;
            const userSummary: string = this.user.userName;
            let avatar: string = '';

            const tenant = this.tenantId;
            avatar = 'https://files-manywho-com.s3.amazonaws.com/' + tenant + '/' + userId + '.jpg';

            const logos: any[] = [];
            const logoBits = logo.split(/[ ,;]+/);
            logoBits.forEach((logoBit: string) => {
                if (logoBit.trim().length > 0) {
                    logos.push(<img className="nav-header-icon-img" src={logoBit.trim()} />);
                }
            });

            let userTextBlock: any;
            let userText: string;

            /*
            <div style={{marginTop: 'auto', marginBottom: 'auto'}}>
                    <span className="user-name">{'Anonymous'}</span><br/>
                    <span className="user-summary">{'Unknown'}</span>
                </div>
                */
            if (!hideUserText) {
                userTextBlock = (
                <div style={{marginTop: 'auto', marginBottom: 'auto'}}>
                    <span className="user-name">{userName.trim().length > 0 ? userName.trim() : 'Anonymous'}</span><br/>
                    <span className="user-summary">{userSummary}</span>
                </div>
                );
            }

            userText = userName.trim().length > 0 ? userName.trim() : 'Anonymous' + ' ' + userSummary;

            let userElement: JSX.Element;
            if (hideUser === false) {
                if (!hideUserAnonymous) {
                    userElement = (
                        <div className="nav-header-user">
                            <div style={{marginTop: 'auto', marginBottom: 'auto', marginRight: '10px'}}>
                                <img
                                    className="nav-header-avatar"
                                    src={avatar}
                                    width="48"
                                    height="48"
                                    title={userText}
                                />
                            </div>
                            {userTextBlock}
                        </div>
                    );
                }
            }

            // loop over menu items
            const links: JSX.Element[] = [];
            for (const mi of menuItems.sort(eSortOrder.ascending, 'order')) {
                links.push(
                <NavigationMenuItem 
                    parent={this} 
                    menuItem={mi} 
                    currentPage={'work-queues'}/>
                );
            }
            return (
                        <div className="nav-header">
                            <div className="nav-header-icon">
                                {logos}
                            </div>
                            <div className="nav-header-title">
                                <div style={{marginTop: 'auto', marginBottom: 'auto'}}>
                                    <span className="nav-header-text">{title}</span><br/>
                                    <span className="nav-header-sub-text">{subTitle}</span>
                                </div>
                            </div>
                            {userElement}
                            <div className="nav-header-controls">
                                {links}
                            </div>
                        </div>
                    );
        } else {
            return (
                    <div className="nav"/>
                );
        }
    }
    async openPage(page: string) {
        window.location.href = page;
    }

    async openTab(page: string) {
        window.open(page, '_blank');
    }

    async openOutcome(outcome: string) {
        await this.triggerOutcome(outcome);
    }

    async move(targetElement: string) {
        console.log('move to : ' + targetElement);

        const baseUrl = manywho.settings.global('platform.uri') || window.location.origin || 'https://flow.manywho.com';
        const invokeurl = `${baseUrl}/api/run/1/state/${this.stateId}`;

        const info = manywho.state.getState(this.flowKey);
         ///  api/run/1/state/{stateId}
        const request: any = {};
        request.currentMapElementId = info.currentMapElementId;
        request.invokeType = 'NAVIGATE';
        request.mapElementInvokeRequest = {};
        request.mapElementInvokeRequest.selectedOutcomeId = null;
        request.pageRequest = {
            pageComponentInputResponses: [
              { pageComponentId: this.componentId, contentValue: null, objectData: null},
            ],
        };
        request.selectedMapElementId = targetElement; // '63573014-69a5-490c-a988-57809e4bf3f0';
        request.stateId = this.stateId;
        request.stateToken = info.token;

        await manywho.connection.request(this, null, invokeurl , 'POST', this.tenantId, this.stateId, manywho.state.getAuthenticationToken(this.flowKey), request);
        // await manywho.engine.sync(this.flowKey);
        // manywho.engine.ping(this.flowKey);

        return Promise.resolve();
    }

    executeFunction(operation: string) {
        switch (operation.toUpperCase()) {
            case 'QUIT':
            case 'EXIT':
            case 'CLOSE':
                this.closeApplication();
                break;

            default:
                console.log('unknown method ' + operation);
                break;
        }
    }

    closeApplication() {
        window.close();
        // this.props.triggerOutcome();
    }

}

manywho.component.register('NavigationMenu', NavigationMenu);

export default NavigationMenu;
