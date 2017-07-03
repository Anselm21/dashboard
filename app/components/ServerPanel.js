import React, {Component, PropTypes} from 'react';
import ReactHighcharts from 'react-highcharts';
import {Panel, Glyphicon, Label} from 'react-bootstrap';
import _ from 'lodash';
const config = require('../../config.json');

export default class ServerPanel extends Component {

    static propTypes = {
        stats: PropTypes.array,
        name: PropTypes.string,
        failedServers: PropTypes.number
    };

    componentWillMount() {
        console.log(this.props.stats);
    }

    getTimeAxis() {
        return this.props.stats.map((el)=> {
            return el.time;
        });
    }

    getCPUAxis() {
        return this.props.stats.map((el)=> {
            return el.cpu_used;
        });
    }

    getMemoryAxis() {
        return this.props.stats.map((el)=> {
            console.log(el.memory_used);
            return el.memory_used;
        });
    }

    renderServers() {
        const {name} = this.props;
        const configuredServersCount = config.clusters_list[name].servers.length;
        const {failedServers} = this.props;
        const servers = [];
        for (let i = 0; i < configuredServersCount - failedServers; i++) {
            servers.push(<Label key={i} className="custom-label"><Glyphicon glyph="tasks" /></Label>);
        }
        for (let k = 0; k < failedServers; k++) {
            servers.push(<Label key={k + 100} className="custom-label" bsStyle="danger"><Glyphicon glyph="tasks" /></Label>);
        }
        return servers;
    }

    render() {
        require('../styles/server_panel.scss');
        const {name, stats} = this.props;
        const clusterDescription = config.clusters_list[name].description;
        const memoryTotal = _.get(stats[stats.length - 1], 'memory_total', undefined);
        const rxSpeed = _.get(stats[stats.length - 1], 'rx_speed', 0);
        const txSpeed = _.get(stats[stats.length - 1], 'tx_speed', 0);
        const cpuConfig = {
            xAxis: {
                categories: this.getTimeAxis()
            },
            series: [{
                data: this.getCPUAxis(),
                name: 'CPU Load'
            }],
            chart: {
                type: 'area'
            },
            tooltip: {
                valueSuffix: '%',
            },
            yAxis: {
                title: {
                    text: 'CPU Load, %'
                },
                min: 0,
                max: 100
            },
            plotOptions: {
                series: {
                    animation: {
                        duration: 0,
                    }
                }
            },
            title: {
                text: 'CPU LOAD'
            },
            credits: {
                enabled: false
            }
        };
        const memoryConfig = {
            xAxis: {
                categories: this.getTimeAxis()
            },
            series: [{
                data: this.getMemoryAxis(),
                name: 'Memory Used'
            }],
            chart: {
                type: 'line'
            },
            tooltip: {
                valueSuffix: ' GiB',
            },
            yAxis: {
                title: {
                    text: 'Memory Used, GiB'
                },
                min: 0,
                max: memoryTotal
            },
            plotOptions: {
                series: {
                    animation: {
                        duration: 0,
                    }
                }
            },
            title: {
                text: 'MEMORY USED'
            },
            credits: {
                enabled: false
            }
        };
        return (
            <Panel header={name} key={name}>
                <div key={name} className="row">
                    <div className="col-md-6">
                        <ReactHighcharts config={cpuConfig}/>
                    </div>
                    <div className="col-md-6 align-center">
                        <ReactHighcharts config={memoryConfig}/>
                        <span>Memory Total: {memoryTotal} GiB</span>
                    </div>
                </div>
                <div className="row align-center servers-row">
                    {clusterDescription}
                </div>
                <div className="row align-center servers-row">
                    {this.renderServers()}
                </div>
                <div className="row align-center custom-row">
                    <span className="net-param-span"><Glyphicon glyph="arrow-up" className="net-glyph"/>{rxSpeed} Mbps</span>
                    <span className="net-param-span"><Glyphicon glyph="arrow-down" className="net-glyph"/>{txSpeed} Mbps</span>
                </div>
            </Panel>
        );
    }
}
