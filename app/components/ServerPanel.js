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
        const gaugeOptions = {

            chart: {
                type: 'solidgauge'
            },

            title: null,

            pane: {
                center: ['50%', '85%'],
                size: '140%',
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
                    y: -70
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
                max: 200,
                title: {
                    text: 'Speed'
                }
            },
            credits: {
                enabled: false
            },
            series: [{
                name: 'Speed',
                data: [80],
                dataLabels: {
                    format: '<div style="text-align:center"><span style="font-size:50px;color:' +
                    'black ">{y}</span><br/><span style="font-size:25px;color:silver">%</span></div>'},
                points: [45],
                tooltip: {
                    valueSuffix: ' km/h'
                }
            }]
        });

        console.log(cpuConfig);

        return (
            <Panel header={name} key={name}>
                <div key={name} className="row">
                    <div className="col-md-6">
                        <ReactHighcharts config={cpuConfig}/>
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
