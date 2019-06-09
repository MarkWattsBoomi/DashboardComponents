import * as React from 'react';
import './css/NavigationMenu.css';
import { FlowBaseComponent } from './models/FlowBaseComponent';
import { FlowObjectDataArray } from './models/FlowObjectDataArray';

export class NavigationMenuItem extends React.Component<any, any> {

    subMenu: string = null;

    constructor(props: any) {
        super(props);
        this.openMenu = this.openMenu.bind(this);
        this.closeMenu = this.closeMenu.bind(this);
        this.triggerMenuItem = this.triggerMenuItem.bind(this);
    }

    // if the menuName key has a field name then it will be shown
    openMenu(fieldName: string) {
        this.subMenu = fieldName;
        this.forceUpdate();
    }

    closeMenu() {
        this.subMenu = null;
        this.forceUpdate();
    }

    triggerMenuItem(tenant: string, flow_id: string, player: string, interactive: boolean) {
        if (interactive && interactive === true) {
            (this.props.parent as FlowBaseComponent).launchFlowTab(tenant, flow_id, player, null);
        } else {
            (this.props.parent as FlowBaseComponent).launchFlowSilent(tenant, flow_id, player, null);
        }
        this.closeMenu();
    }

    render() {
        let action: Function;
        let menuIcon: string = 'glyphicon glyphicon-triangle-bottom';

        switch (this.props.menuItem.properties.type.value.toUpperCase()) {
            case 'NAVIGATE':
                action = this.props.parent.openPage;
                break;

            case 'OPEN':
                action = this.props.parent.openTab;
                break;

            case 'FUNCTION':
                action = this.props.parent.executeFunction;
                break;

            case 'OUTCOME':
                action = this.props.parent.openOutcome;
                break;

            case 'MENU':
                action = this.openMenu;
                if (this.subMenu !== null) {
                    menuIcon = 'glyphicon glyphicon-triangle-top';
                    action = this.closeMenu;
                }
                break;

        }

        // prep any shown menus
        const SubMenus: JSX.Element[] = [];
        if (this.subMenu !== null) {
            const subMenuItems: FlowObjectDataArray = this.props.parent.fields[this.props.menuItem.properties.value.value].value;
            for (const item of subMenuItems.items) {
                SubMenus.push(<div
                                className="nav-sub-menu">
                                <span className={'glyphicon glyphicon-' + item.properties.icon.value}></span>
                                <span
                                    className={'nav-menu'}
                                    title={item.properties.caption.value as string}
                                    onClick={() => this.triggerMenuItem(item.properties.tenant.value as string,
                                        item.properties.flow_id.value as string,
                                        item.properties.player.value as string,
                                        item.properties.interactive.value as boolean)}
                                >
                                    {item.properties.caption.value}
                                </span>
                            </div>);
            }
        }

        const hot = this.props.menuItem.properties.name.value === this.props.currentPage ? ' hot ' : '';
        let span: JSX.Element;
        switch (this.props.menuItem.properties.type.value.toUpperCase()) {
            case 'IMAGE':
                    span = (
                        <img className="nav-header-controls-image" src={this.props.menuItem.properties.value.value}></img>
                        );
                    break;

            case 'MENU':
                    span = (
                        <div>
                            <div
                                onClick={() => action(this.props.menuItem.properties.value.value)}
                                style={{whiteSpace: 'nowrap'}}>
                                <span className={menuIcon} style={{color: '#ccc'}}></span>
                                <span
                                    className={'nav-menu' + hot}
                                    title={this.props.menuItem.properties.label.value}>
                                    {this.props.menuItem.properties.label.value}
                                </span>
                            </div>
                            <div style={{position: 'absolute', zIndex: 1000, marginTop: '10px'}}>
                                {SubMenus}
                            </div>

                        </div>
                    );
                    break;

            case 'OUTCOME':
            case 'FUNCTION':
                    if (this.props.menuItem.properties.icon.value && this.props.menuItem.properties.icon.value.length > 0) {
                        span = (
                            <span
                                className={'glyphicon glyphicon-' + this.props.menuItem.properties.icon.value + hot + ' nav-header-controls-button'}
                                title={this.props.menuItem.properties.label.value}
                                onClick={() => action(this.props.menuItem.properties.value.value)}>
                            </span>
                            );
                    } else {
                        span = (
                            <span
                                className={'nav-header-link' + hot} title={this.props.menuItem.properties.label.value}
                                onClick={() => action(this.props.menuItem.properties.value.value)}>
                                {this.props.menuItem.properties.label.value}
                            </span>
                            );
                    }
                    break;

            default:
                span = <span></span>;
        }
        return span;
    }

}
