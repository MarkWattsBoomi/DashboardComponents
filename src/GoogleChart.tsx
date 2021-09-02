declare var manywho: any;
// declare var google:any;

import { eLoadingState, FlowComponent, FlowDisplayColumn, FlowObjectData, FlowObjectDataArray, FlowObjectDataProperty, FlowOutcome } from 'flow-component-model';
import * as React from 'react';
import {Chart} from 'react-google-charts';

class GoogleChart extends FlowComponent {

    chart: any;

    constructor(props: any) {
       super(props);
    }

    /*
    getInitialState() {
        const ret: any = {};
        ret.selectedRows = [];
        ret.windowWidth = window.innerWidth,
        ret.sortByOrder = 'ASC',
        ret.lastOrderBy = '',
        ret.objectData = null;
        return ret;
    }
*/
    async componentDidMount() {
        await super.componentDidMount();
        this.forceUpdate();

    }

    render() {
        if (this.loadingState !== eLoadingState.ready) {
            return (<div/>);
        }
        manywho.log.info('Rendering Google Chart: ' + this.componentId);

        const classNames: any = [];

        if (this.model.visible == false) {
                classNames.push('hidden');
        } else {
            // classNames = classNames.concat(manywho.styling.getClasses(this.props.parentId, this.props.id, 'google-chart', this.props.flowKey));

            const contentItems: any = [];
            // contentItems.push(this.renderHeader(null, null, this.props.flowKey, false, this.onSearchChanged, this.onSearchEnter, this.search, (model.objectDataRequest || model.fileDataRequest), this.refresh, this.props.isDesignTime, model));
            contentItems.push(this.renderHeader());
            contentItems.push(this.renderChart());
            // contentItems.push(this.renderFooter(state.page || 1, hasMoreResults, this.onNext, this.onPrev, this.props.isDesignTime));
            // contentItems.push(this.renderWait());

            return  <div className={classNames}>
                        <div className="panel panel-default">
                            <div className="panel-heading">
                                <div className="panel-body">
                                    {contentItems}
                                </div>
                            </div>
                        </div>
                    </div>;
        }
    }

    renderHeader() {
        const data: any = [];
        const headerElements: any = [];
        // add the display columns to the columns array
        const columns: any = [];
        if (this.model.displayColumns != null &&  this.model.displayColumns.length > 0) {
            this.model.displayColumns.forEach((column: FlowDisplayColumn) => {
                columns.push(column.label);
            });
        }
        data.push(columns);

        return  (
            <div
                className="table-header clearfix"
            >
                        {headerElements}
            </div>
        );
    }

    renderFooter(pageIndex: number, hasMoreResults: boolean, onNext: any, onPrev: any, isDesignTime: boolean) {

        const footerElements = [];

        if (pageIndex > 1 || hasMoreResults) {

            footerElements.push(React.createElement(manywho.component.getByName('pagination'),
                {
                    pageIndex,
                    hasMoreResults,
                    containerClasses: 'pull-right',
                    onNext,
                    onPrev,
                    isDesignTime,
                },
            ));

        }

        if (footerElements.length > 0) {
            return  <div className="table-footer clearfix">
                        {footerElements}
                    </div>;
        } else {
            return null;
        }

    }

    renderChart() {

        const width = '100%';
        const height = '100%';

        const data: any = [];

        // add the display columns to the columns array
        const columns: any = [];
        if (this.model.displayColumns != null &&  this.model.displayColumns.length > 0) {
            this.model.displayColumns.forEach((column: FlowDisplayColumn) => {
                columns.push(column.label);
            });
        }
        data.push(columns);

        // add the values to the data
        const rows: any = [];
        const objectData: FlowObjectDataArray = this.model.dataSource as FlowObjectDataArray;
        if (objectData != null && objectData.items && objectData.items.length > 0) {
            objectData.items.forEach((item: FlowObjectData) => {
                const row: any = [];

                this.model.displayColumns.forEach((column: FlowDisplayColumn) => {
                    const prop: FlowObjectDataProperty = item.properties[column.developerName];
                    row.push(parseFloat((prop.value as number).toFixed(2)));
                });

                rows.push(row);
            });

        }

        const chartType: any = this.chartNameToType(this.getAttribute('chartType', 'pie'), columns, rows);

        return (
            <div
                style={{width: '100%', height: '100%'}}
            >
                <Chart
                    ref={(element: any) => {this.chart = element; }}
                    chartType={chartType.name}
                    width="100%"
                    height="100%"
                    legendToggle={true}
                    data={chartType.data}
                    options={chartType.options}
                />
            </div>
        );
    }

    prepNormalData(columns: string[], rows: [[]]): any[] {
        // make object

        const op: any = [];
        op.push(columns);
        op.push(rows);

        return op;
    }

    prepDispersionData(min: number, max: number, interval: number, column: string, values: number[]): any[] {
        // make object
        const result: any = {};

        for (let pos = min; pos <= max; pos += interval) {
            result[pos] = 0;
        }

        values.forEach((value: any) => {
            const key: any = value[0];
            result[key] += 1;
        });

        const op: any = [];
        op.push([column, 'count']);
        Object.keys(result).forEach((key: string) => {
            op.push([0 + parseInt(key), result[key]]);
        });

        return op;
    }

    chartNameToType(name: string, columns: any, rows: any) {
        const result: any = {name : '', options: {}, data: []};
        result.data = this.prepNormalData(columns, rows);
        switch (name.toLowerCase()) {
            case 'annotationchart': result.name = 'AnnotationChart'; break;
            case 'areachart': result.name =  'AreaChart'; break;
            case 'barchart': result.name =  'BarChart'; break;
            case 'bubblechart': result.name =  'BubbleChart'; break;
            case 'calendar': result.name =  'Calendar'; break;
            case 'candlestickchart': result.name =  'CandlestickChart'; break;
            case 'columnchart': result.name =  'ColumnChart';  break;
            case 'gantt': result.name =  'Gannt'; break;
            case 'gauge': result.name =  'Gauge'; break;
            case 'geochart': result.name =  'GeoChart'; break;
            case 'linechart':
                result.name =  'LineChart';
                result.options.curveType = 'function';
                break;
            case 'dispersion':
                    result.name =  'ScatterChart';
                    result.data = this.prepDispersionData(0, 100, 1, columns[0], rows);
                    break;
            case 'orgchart': result.name =  'OrgChart'; break;
            case 'piechart': result.name =  'PieChart'; break;
            case 'sankey': result.name =  'Sankey'; break;
            case 'scatterchart': result.name =  'ScatterChart'; break;
            case 'steppedareachart': result.name =  'SteppedAreaChart'; break;
            case 'tablechart': result.name = 'Table'; break;
            case 'timelineschart': result.name =  'TimeLine'; break;
            case 'treemapchart': result.name =  'TreeMap'; break;
            case 'trendchart':
                result.options.trendlines = { 0: {} };
                result.name =  'ScatterChart';
                break;
            case 'wordtree':
                result.options.wordtree = {format: 'implicit', word: 'cats' };
                result.name =  'WordTree';
                break;
            default: result.name =  'PieChart';
                     break;
        }
        return result;
    }

    /*
    onSearchChanged(e: any) {
        // if (this.props.isDesignTime)  return;

        // manywho.state.setComponent(this.props.id, { search: e.target.value }, this.props.flowKey, true);
        // this.forceUpdate();
    }

    onSearchEnter(e: any) {
        if (e.keyCode == 13 && !this.props.isDesignTime) {
            e.stopPropagation();
            this.search();
        }
    }

    search() {
        if (this.props.isDesignTime) { return; }

        const model = manywho.model.getComponent(this.props.id, this.props.flowKey);
        const state = manywho.state.getComponent(this.props.id, this.props.flowKey);

        this.clearSelection();

        if (model.objectDataRequest) {
            manywho.engine.objectDataRequest(this.props.id, model.objectDataRequest, this.props.flowKey, manywho.settings.global('paging.table'), state.search, null, null, state.page);
        } else {
            const displayColumns = (manywho.component.getDisplayColumns(model.columns) || []).map(function(column: any) {
                return column.typeElementPropertyId.toLowerCase();
            });

            this.setState({
                objectData: model.objectData.filter(function(objectData: any) {

                    return objectData.properties.filter(function(property: any) {

                        return displayColumns.indexOf(property.typeElementPropertyId) != -1 && property.contentValue.toLowerCase().indexOf(state.search.toLowerCase()) != -1;

                    }).length > 0;

                }),
            });

            state.page = 1;
            manywho.state.setComponent(this.props.id, state, this.props.flowKey, true);

        }
    }

    refresh() {
        if (this.props.isDesignTime) { return; }

        manywho.state.setComponent(this.props.id, { search: '' }, this.props.flowKey, true);

        this.search();

    }

    clearSelection() {
        this.setState({ selectedRows: [] });
        manywho.state.setComponent(this.props.id, { objectData: [] }, this.props.flowKey, true);
    }

    onRowClicked(e: any) {
        let selectedRows = this.state.selectedRows;

        const model = manywho.model.getComponent(this.props.id, this.props.flowKey);

        if (selectedRows.indexOf(e.currentTarget.id) == -1) {
            model.isMultiSelect ? selectedRows.push(e.currentTarget.id) : selectedRows = [e.currentTarget.id];
        } else {
            selectedRows.splice(selectedRows.indexOf(e.currentTarget.id), 1);
        }

        this.setState({ selectedRows });
        manywho.state.setComponent(this.props.id, { objectData: manywho.component.getSelectedRows(model, selectedRows) }, this.props.flowKey, true);
    }

    onNext() {
        const model = manywho.model.getComponent(this.props.id, this.props.flowKey);
        const state = manywho.state.getComponent(this.props.id, this.props.flowKey);

        if (!state.page) {
            state.page = 1;
        }

        state.page++;
        manywho.state.setComponent(this.props.id, state, this.props.flowKey, true);

        if (model.objectDataRequest || model.fileDataRequest) {
            this.search();
        } else if (model.attributes.pagination && manywho.utils.isEqual(model.attributes.pagination, 'true', true)) {
            this.forceUpdate();
        }

    }

    onPrev() {
        const model = manywho.model.getComponent(this.props.id, this.props.flowKey);
        const state = manywho.state.getComponent(this.props.id, this.props.flowKey);
        state.page--;

        manywho.state.setComponent(this.props.id, state, this.props.flowKey, true);

        if (model.objectDataRequest || model.fileDataRequest) {
            this.search();
        } else if (model.attributes.pagination && manywho.utils.isEqual(model.attributes.pagination, 'true', true)) {
            this.forceUpdate();
        }

    }
    */

}

manywho.component.register('GoogleChart', GoogleChart);

export default GoogleChart;
