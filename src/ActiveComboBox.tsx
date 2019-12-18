
import { FlowComponent, FlowObjectData } from 'flow-component-model';
import * as React from 'react';

declare const manywho: any;

class ActiveComboBox extends FlowComponent {

    context: any;
    select: any;

    constructor(props: any) {
        super(props);
        this.valueChanged = this.valueChanged.bind(this);
    }

    async componentDidMount() {
        await super.componentDidMount();
        this.forceUpdate();
    }

    async valueChanged(e: any) {
        const id: FlowObjectData | undefined = this.select.options[this.select.selectedIndex].attributes['data-object'] ? this.select.options[this.select.selectedIndex].attributes['data-object'].value : undefined;
        let val: any;
        let valA: any;
        if (id) {
            val = this.model.dataSource.getItemWithPropertyValue('id', id);
            valA = val.iFlowObjectDataArray();
        } else {
            val = FlowObjectData.newInstance('getMonths RESPONSE - Month');
            valA = val.iFlowObjectDataArray();
        }

        this.setStateValue(val);
        const outcome: string = this.getAttribute('onChange', '');
        if (outcome.length > 0) {
            await this.triggerOutcome(outcome, valA);
        }

    }

    render() {

        // manywho.log.info(`Rendering Select: ${this.props.id}, ${model.developerName}`);

        let className = manywho.styling.getClasses(
            this.props.parentId,
            this.componentId,
            'select',
            this.flowKey,
        ).join(' ');

        className += ' form-group';

        if (this.model.visible === false) {
            className += ' hidden';
        }

        const style: any = {};
        let widthClassName = null;

        if (this.model.width && this.model.width > 0) {
            style.width = `${this.model.width}px`;
            style.minWidth = style.width;
            widthClassName = 'width-specified';
        }

        let refreshButton: any;

        const options: any = [];

        options.push(
            <option data-object={undefined}>
                {this.model.hintInfo || 'Please select'}
            </option>,
        );
        this.model.dataSource.items.forEach((item: FlowObjectData) => {

            // console.log(item.properties['id'].value + ' ' + item.isSelected);

            let label: string = '';
            this.model.displayColumns.forEach((column: any) => {
                if (label.length > 0) {
                    label += ' ';
                }
                label += item.properties[column.DeveloperName].value;
            });

            if (item.isSelected) {
                this.setStateValue(item);
            }

            options.push(
                <option
                    selected={item.isSelected}
                    data-object={item.properties['id'].value}
                >
                    {label}
                </option>,
            );
        });
        const selectElement = (
            <select
                onChange={(e: any) => {this.valueChanged(e); }}
                ref={(me: any) => {this.select = me; }}
                className="simple-value"
                style={{height: '48px', paddingLeft: '10px', border: '1px solid #ccc', fontSize: '20px', minWidth: '500px'}}
            >
                {options}
            </select>
        );

        return (
            <div
                className={className}
                style={{display: 'inlineBlock', paddingLeft: '15px'}}
                id={this.props.id}
            >
                <label>
                    {this.model.label}
                    {this.model.required ? <span className="input-required"> * </span> : null}
                </label>
                <div style={style} className={widthClassName}>
                    {selectElement}
                    {refreshButton}
                </div>
                <span className="help-block">
                    {this.model.validationMessage}
                </span>
                <span className="help-block">
                    {this.model.helpInfo}
                </span>
            </div >
        );
    }

}

manywho.component.register('ActiveComboBox', ActiveComboBox);

export default ActiveComboBox;
