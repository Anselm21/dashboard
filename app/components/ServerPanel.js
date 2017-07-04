import React, {Component, PropTypes} from 'react';
import ReactHighcharts from 'react-highcharts';
require('highcharts-more')(ReactHighcharts.Highcharts);
require('highcharts-solid-gauge')(ReactHighcharts.Highcharts);
import {Panel, Glyphicon, Label} from 'react-bootstrap';
import _ from 'lodash';
const config = require('../../config.json');

export default class ServerPanel extends Component {

    static propTypes = {
        stats: PropTypes.object,
        name: PropTypes.string,
        failedServers: PropTypes.number
    };

    renderServers() {
        const {name} = this.props;
        const configuredServersCount = config.clusters_list[name].servers.length;
        const {failedServers} = this.props;
        const servers = [];
        for (let i = 0; i < configuredServersCount - failedServers; i++) {
            servers.push(<div key={i} className="col-md-6 servers-row col-sm-3 col-xs-6"><Label key={i} className="custom-label"><Glyphicon glyph="tasks" /></Label></div>);
        }
        for (let k = 0; k < failedServers; k++) {
            servers.push(<div key={k + 100} className="col-md-6 servers-row col-sm-3 col-xs-6"><Label key={k + 100} className="custom-label" bsStyle="danger"><Glyphicon glyph="tasks" /></Label></div>);
        }
        return servers;
    }

    render() {
        require('../styles/server_panel.scss');
        const {name, stats} = this.props;
        const clusterDescription = config.clusters_list[name].description;
        const memoryTotal = _.get(stats, 'memory_total', undefined);
        const memoryUsed = _.get(stats, 'memory_used', undefined);
        const rxSpeed = _.get(stats, 'rx_speed', 0);
        const txSpeed = _.get(stats, 'tx_speed', 0);
        const gaugeOptions = {

            chart: {
                type: 'solidgauge',
                height: 300,
                spacingTop: -70
            },

            title: null,

            pane: {
                center: ['50%', '85%'],
                size: '100%',
                startAngle: -90,
                endAngle: 90,
                background: {
                    innerRadius: '60%',
                    outerRadius: '100%',
                    shape: 'arc'
                }
            },

            tooltip: {
                enabled: false
            },

            // the value axis
            yAxis: {
                stops: [
                    [0.1, '#55BF3B'], // green
                    [0.5, '#DDDF0D'], // yellow
                    [0.9, '#DF5353'] // red
                ],
                lineWidth: 0,
                minorTickInterval: null,
                tickAmount: 2,
                title: {
                    y: -120
                },
                labels: {
                    y: 16
                }
            },

            plotOptions: {
                solidgauge: {
                    dataLabels: {
                        y: 5,
                        borderWidth: 0,
                        useHTML: true
                    }
                }
            }
        };

        const cpuConfig = _.merge(gaugeOptions, {
            yAxis: {
                min: 0,
                max: 100,
                title: {
                    text: 'CPU Usage',
                    style: {
                        'fontSize': '18px',
                        'color': '#333333'
                    }
                }
            },
            credits: {
                enabled: false
            },
            series: [{
                name: 'Speed',
                data: [stats.cpu_used],
                dataLabels: {
                    format: '<div style="text-align:center"><span style="font-size:40px;color:' +
                    'black ">{y}</span><br/><span style="font-size:25px;color:silver">%</span></div>'},
                points: [45],
                tooltip: {
                    valueSuffix: ' km/h'
                }
            }]
        });

        const memoryConfig = {
            chart: {
                type: 'column',
                height: 300
            },
            credits: {
                enabled: false
            },
            title: {
                text: 'Memory Usage'
            },
            xAxis: {
                categories: ['Memory']
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'GiB'
                }
            },
            tooltip: {
                pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b>GiB<br/>',
                shared: true
            },
            plotOptions: {
                column: {
                    stacking: 'normal'
                }
            },
            series: [{
                name: 'Free',
                data: [Number((memoryTotal - memoryUsed).toFixed(1))]
            }, {
                name: 'Used',
                data: [memoryUsed]
            }]
        };

        return (
            <Panel header={name} key={name}>
                <div key={name} className="row">
                    <div className="col-md-2">
                        <div className="row servers-row">
                            <div className="col-md-12">
                                {clusterDescription}
                            </div>
                        </div>
                        <div className="row align-center servers-row">
                            {this.renderServers()}
                        </div>
                    </div>
                    <div className="col-md-5">
                        <ReactHighcharts config={cpuConfig}/>
                    </div>
                    <div className="col-md-5 align-center">
                        <ReactHighcharts config={memoryConfig}/>
                        <span>Memory Total: {memoryTotal} GiB</span>
                    </div>
                </div>
                <div className="row align-center">
                    <span className="net-param-span"><Glyphicon glyph="arrow-up" className="net-glyph"/>{rxSpeed} Mbps</span>
                    <span className="net-param-span"><Glyphicon glyph="arrow-down" className="net-glyph"/>{txSpeed} Mbps</span>
                </div>
            </Panel>
        );
    }
}
