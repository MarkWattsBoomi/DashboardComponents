import { eLoadingState, eSortOrder, FlowObjectDataArray, FlowPage } from 'flow-component-model';
import * as React from 'react';
import './css/Common.css';
import './css/MenuBar.css';
import { MenuBarItem } from './MenuBarItem';

declare const manywho: any;

export class MenuBar extends FlowPage {

    waitSpinner = 'https://media.giphy.com/media/6Egwsh5J2kvhmXALVu/giphy.gif';

    constructor(props: any) {
        super(props);
        this.openPage = this.openPage.bind(this);
        this.openTab = this.openTab.bind(this);
        this.openOutcome = this.openOutcome.bind(this);
        this.closeApplication = this.closeApplication.bind(this);
        this.executeFunction = this.executeFunction.bind(this);
    }

    async componentDidMount() {
        await super.componentDidMount();
        this.forceUpdate();
    }

    render() {
        if (this.loadingState === eLoadingState.ready) {

            // the datasource tells us the name of the menu items array
            const menuItems: FlowObjectDataArray = this.model.dataSource;

            const tenant = this.tenantId;

            // loop over menu items
            const links: JSX.Element[] = [];
            for (const mi of menuItems.sort(eSortOrder.ascending, 'order')) {
                links.push(<MenuBarItem parent={this} menuItem={mi} />);
            }
            return (
                        <div className="menu-bar">
                            {links}
                        </div>
                    );
        } else {
            return (
                    <div className="menu-bar"/>
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

manywho.component.register('MenuBar', MenuBar);

export default MenuBar;
