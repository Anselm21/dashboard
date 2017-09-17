import React, {Component, PropTypes} from 'react';
import ReactHighcharts from 'react-highcharts';
require('highcharts-more')(ReactHighcharts.Highcharts);
require('highcharts-solid-gauge')(ReactHighcharts.Highcharts);
import {Panel, Glyphicon, Label, Alert} from 'react-bootstrap';
import _ from 'lodash';
const config = require('../../config.json');

export default class ServerPanel extends Component {

    static propTypes = {
        stats: PropTypes.object,
        name: PropTypes.string,
        description: PropTypes.string,
        error: PropTypes.string
    };

    renderServers() {
        const {stats, error} = this.props;
        const servers = [];
        let i = 0;
        _.forEach(stats, (value, key)=> {
            i++;
            if (value.status && value.status === 200 && !error) {
                servers.push(
                    <div key={i} className="col-md-6 servers-row col-sm-3 col-xs-6">
                        <Label title={key} key={i} className="custom-label">
                            <Glyphicon glyph="tasks"/>
                        </Label>
                    </div>);
            } else {
                servers.push(
                    <div key={i} className="col-md-6 servers-row col-sm-3 col-xs-6">
                        <Label title={key} key={i} className="custom-label" bsStyle="danger">
                            <Glyphicon glyph="tasks"/>
                        </Label>
                    </div>);
            }
        });
        return servers;
    }

    calcClusterStats(stats) {
        const result = {
            cpuLoad: 0,
            memoryTotal: 0,
            memoryUsed: 0,
            txSpeed: 0,
            rxSpeed: 0
        };
        let liveServersNumber = 0;
        _.forEach(stats, (value)=> {
            if (value.status && value.status === 200) {
                result.cpuLoad += _.get(value, 'data.cpu_used', 0);
                result.memoryTotal += _.get(value, 'data.memory_total', 0);
                result.memoryUsed += _.get(value, 'data.memory_used', 0);
                result.txSpeed += _.get(value, 'data.tx_speed', 0);
                result.rxSpeed += _.get(value, 'data.rx_speed', 0);
                liveServersNumber++;
            }
        });
        if (liveServersNumber > 0) {
            result.cpuLoad = Number((result.cpuLoad / liveServersNumber).toFixed(1));
        }
        return result;
    }

    render() {
        require('../styles/server_panel.scss');
        const {name, stats, description, error} = this.props;
        const resultStats = this.calcClusterStats(stats);
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
                name: 'CPU',
                data: [resultStats.cpuLoad],
                dataLabels: {
                    format: '<div style="text-align:center"><span style="font-size:30px;color:' +
                    'black ">{y}</span><br/><span style="font-size:20px;color:silver">%</span></div>'},
                tooltip: {
                    valueSuffix: ' %'
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
                data: [Number((resultStats.memoryTotal - resultStats.memoryUsed).toFixed(1))]
            }, {
                name: 'Used',
                data: [resultStats.memoryUsed]
            }]
        };

        return (
            <Panel header={name} key={name}>
                {error && (
                    <Alert bsStyle="danger">
                        <h4>Error: Lost connection to master-sysinfo script</h4>
                        <p>{error}</p>
                    </Alert>
                )}
                <div key={name} className="row">
                    <div className="col-md-2">
                        <div className="row servers-row">
                            <div className="col-md-12">
                                {description}
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
                        <span>Memory Total: {resultStats.memoryTotal} GiB</span>
                    </div>
                </div>
                <div className="row align-center">
                    <span className="net-param-span"><Glyphicon glyph="arrow-up"
                                                                className="net-glyph"/>{resultStats.rxSpeed} Mbps</span>
                    <span className="net-param-span"><Glyphicon glyph="arrow-down"
                                                                className="net-glyph"/>{resultStats.txSpeed} Mbps</span>
                </div>
            </Panel>
        );
    }
}
