
import { eLoadingState, FlowComponent, FlowObjectData } from 'flow-component-model';
import * as React from 'react';
import './css/IconProgressBar.css';

declare const manywho: any;

export class IconProgressBar extends FlowComponent {

    selectedItem: string = null;
    text: string = '';

    sortByKey(array: any, key: string) {
        return array.sort(function(a: any, b: any) {
            const x = a[key];
            const y = b[key];
            return ((x < y) ? -1 : ((x > y) ? 1 : 0));
        });
    }

    async componentDidMount() {
        await super.componentDidMount();
        this.forceUpdate();
    }

    render() {

        const status: number = parseInt(this.getStateValue() as string);

        if (this.loadingState === eLoadingState.ready) {

            // load the icon array
            let data: any[] = [];

            if (this.model.dataSource && this.model.dataSource.items.length > 0) {
                this.model.dataSource.items.forEach((item: FlowObjectData) => {
                    const icon: any = {};
                    icon.key = item.properties['key'].value;
                    icon.tooltip = item.properties['tooltip'].value;
                    icon.name = item.properties['name'].value;
                    icon.icon = item.properties['icon'].value;
                    data.push(icon);
                });
            }

            data = this.sortByKey(data, 'key');

            const icons = [];
            let cls = '';

            for (let dPos = 0 ; dPos < data.length ; dPos++) {
                const d = data[dPos];
                cls = 'glyphicon glyphicon-' + d.icon + ' icon-progress-bar-icon ';

                const style: any = {};
                style['font-size'] = this.getAttribute('iconPointSize', '20') + 'pt';

                if (parseInt(d.key) < status) {
                    style.color = this.getAttribute('completeColour', '#3797ff');
                } else if (parseInt(d.key) === status) {
                    style.color = this.getAttribute('activeColour', '#fefefe');
                } else {
                   style.color = this.getAttribute('incompleteColour', '#bbbbb');
                }
                const span = (
                    <span
                        className={cls}
                        style={style}
                        title={d.tooltip}
                    />
                );
                icons.push(span);
            }

            // var width = flowModel.width;
            // var height = flowModel.height;

            // var controlStyle = {"width" : width };

            return (
                <div className="icon-progress-bar">
                    <div className="icon-progress-bar-inner">
                        {icons}
                    </div>
                </div>
            );
        } else {
            return(
                <div className="icon-progress-bar"/>
            );
        }
    }
}

manywho.component.register('IconProgressBar', IconProgressBar);
