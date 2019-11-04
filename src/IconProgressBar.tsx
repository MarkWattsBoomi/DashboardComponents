
import * as React from 'react';
import './css/IconProgressBar.css';
import { eLoadingState } from '/Operational Data/Flow UI Custom Components/2019 Version/FlowComponentModel/src/FlowBaseComponent';
import { FlowComponent } from '/Operational Data/Flow UI Custom Components/2019 Version/FlowComponentModel/src/FlowComponent';
import { FlowObjectData } from '/Operational Data/Flow UI Custom Components/2019 Version/FlowComponentModel/src/FlowObjectData';
import { IManywho } from '/Operational Data/Flow UI Custom Components/2019 Version/FlowComponentModel/src/interfaces';

declare const manywho: IManywho;

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

                if (this.getAttribute('IconSize')) {
                    style['font-size'] = this.getAttribute('IconSize') + 'pt';
                }

                if (parseInt(d.key) < status) {
                    if (this.getAttribute('CompleteColour')) {
                        style.color = this.getAttribute('CompleteColour');
                    } else {
                        cls += ' icon-progress-bar-icon-complete';
                    }
                } else if (parseInt(d.key) === status) {
                    if (this.getAttribute('ActiveColour')) {
                        style.color = this.getAttribute('ActiveColour');
                    } else {
                        cls += ' icon-progress-bar-icon-active';
                    }

                } else {
                    if (this.getAttribute('IncompleteColour')) {
                        style.color = this.getAttribute('IncompleteColour');
                    } else {
                        cls += ' icon-progress-bar-icon-incomplete';
                    }

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
