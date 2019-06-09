import * as React from 'react';
import './css/NavigationMenu.css';
import { eSortOrder, FlowObjectDataArray } from './models/FlowObjectDataArray';
import { FlowPage } from './models/FlowPage';
import { IManywho } from './models/interfaces';
import { NavigationMenuItem } from './NavigationMenuItem';

declare const manywho: IManywho;

class NavigationMenu extends FlowPage {

    waitSpinner = 'https://media.giphy.com/media/6Egwsh5J2kvhmXALVu/giphy.gif';

    constructor(props: any) {
        super(props);
        this.openPage = this.openPage.bind(this);
        this.openTab = this.openTab.bind(this);
        this.openOutcome = this.openOutcome.bind(this);
        this.closeApplication = this.closeApplication.bind(this);
        this.executeFunction = this.executeFunction.bind(this);
    }

    render() {
        if (this.loadingState !== 'initial') {

            // the datasource tells us the name of the menu items array

            const menuItems: FlowObjectDataArray = this.model.dataSource;
            const logo: string = this.getAttribute('logo', '');
            const title: string = this.getAttribute('title', '');
            const hideUserAnonymous: boolean = this.getAttribute('hide-user-anonymous', 'false') === 'true' ? true : false;
            const hideUser: boolean = this.getAttribute('hide-user', 'false') === 'true' ? true : false;
            const subTitle: string = ''; // this.getAttribute('sub-title', '');

            const username: string = this.user.firstName + ' ' + this.user.lastName;
            const userid: string = this.user.email;
            const userSummary: string = 'Flow Developer';
            let avatar: string = '';

            let userElement: JSX.Element;
            if (hideUser === false) {
                if (username.trim() === '') {
                    if (!hideUserAnonymous) {
                        userElement = (
                            <div className="nav-header-user">
                                <div style={{marginTop: 'auto', marginBottom: 'auto', marginRight: '10px'}}>
                                    <img className="nav-header-avatar" src={avatar} width="48" height="48"/>
                                </div>
                                <div style={{marginTop: 'auto', marginBottom: 'auto'}}>
                                    <span className="user-name">{'Anonymous'}</span><br/>
                                    <span className="user-summary">{'Unknown'}</span>
                                </div>
                            </div>
                        );
                    }
                } else {
                    userElement = (<div className="nav-header-user">
                                    <div style={{marginTop: 'auto', marginBottom: 'auto', marginRight: '10px'}}>
                                        <img className="nav-header-avatar" src={avatar} width="48" height="48"/>
                                    </div>
                                    <div style={{marginTop: 'auto', marginBottom: 'auto'}}>
                                        <span className="user-name">{username}</span><br/>
                                        <span className="user-summary">{userSummary}</span>
                                    </div>
                                </div>);
                }
            }
            const tenant = this.tenantId;

            avatar = 'https://files-manywho-com.s3.amazonaws.com/' + tenant + '/' + userid + '.jpg';

            // loop over menu items
            const links: JSX.Element[] = [];
            for (const mi of menuItems.sort(eSortOrder.ascending, 'order')) {
                links.push(<NavigationMenuItem parent={this} menuItem={mi} currentPage={'work-queues'}/>);
            }
            return (
                        <div className="nav-header">
                            <div className="nav-header-icon">
                                <img className="nav-header-icon-img" src={logo} width="3vw"/>
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
