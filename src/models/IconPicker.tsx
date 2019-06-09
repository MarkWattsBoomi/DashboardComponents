import * as React from 'react';
import './css/IconPicker.css';

// Declaration of the component as React Class Component
class IconPicker extends React.Component<any, any> {

    icons: any = {};

    selectedItem: string;

    onchange(e: any) {
        this.selectedItem = e.target.innerText;
        if (this.props.onChange) {
            this.props.onChange(this.selectedItem);
        }
        this.forceUpdate();
    }

    constructor(props: any) {
        super(props);
        this.selectedItem = this.props.onChangeValue;
        this.icons.asterisk = {name: 'asterisk', title: 'Asterisk', code: '&#x2a;'};
        this.icons.plus = {name: 'plus', title: 'Plus', code: '&#x2b;'};
        this.icons.euro = {name: 'euro', title: 'Euro', code: '&#x20ac;'};
        this.icons.minus = {name: 'minus', title: 'Minus', code: '&#x2212;'};
        this.icons.cloud = {name: 'cloud', title: 'Cloud', code: '&#x2601;'};
        this.onchange = this.onchange.bind(this);
    }

    render() {

        const options: JSX.Element[] = [];
        let cls: string;
        for (const opt of Object.keys(this.icons)) {
             const cls = 'glyphicon glyphicon-' + this.icons[opt].name + ' icon-picker-icon';
             options.push(<li onClick={(e) => {this.onchange(e); }}>
                            <span className={cls}></span>
                            {this.icons[opt].name}
                        </li>);
        }

        return (
            <div className="btn-group">
                <button type="button" className="btn btn-default dropdown-toggle" data-toggle="dropdown">
                <span className={'glyphicon glyphicon-' + this.selectedItem}></span><span className="caret"></span>
                </button>
            <ul className="dropdown-menu" role="menu">
                {options}
            </ul>
        </div>

        );

        // <select className="modal-dialog-select" data-show-icon="true" onChange={(e) => {this.itemSelected; }}>
        //    {options}
        // </select>
  }
}

// Export the component to use it in other components.
export default IconPicker;
