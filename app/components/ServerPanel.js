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
        const {name, stats, description, error} = this.props;
        const resultStats = this.calcClusterStats(stats);
        const darkTheme = {
            colors: ['#2b908f', '#90ee7e', '#f45b5b', '#7798BF', '#aaeeee', '#ff0066', '#eeaaee',
                '#55BF3B', '#DF5353', '#7798BF', '#aaeeee'],
            chart: {
                backgroundColor: 'rgba(255, 255, 255, 0)',
                style: {
                    fontFamily: '\'Unica One\', sans-serif'
                },
                plotBorderColor: '#606063'
            },
            title: {
                style: {
                    color: '#E0E0E3',
                    textTransform: 'uppercase',
                    fontSize: '20px'
                }
            },
            subtitle: {
                style: {
                    color: '#E0E0E3',
                    textTransform: 'uppercase'
                }
            },
            xAxis: {
                gridLineColor: '#707073',
                labels: {
                    style: {
                        color: '#E0E0E3'
                    }
                },
                lineColor: '#707073',
                minorGridLineColor: '#505053',
                tickColor: '#707073',
                title: {
                    style: {
                        color: '#A0A0A3'

                    }
                }
            },
            yAxis: {
                gridLineColor: '#707073',
                labels: {
                    style: {
                        color: '#E0E0E3'
                    }
                },
                lineColor: '#707073',
                minorGridLineColor: '#505053',
                tickColor: '#707073',
                tickWidth: 1,
                title: {
                    style: {
                        color: '#A0A0A3'
                    }
                }
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.85)',
                style: {
                    color: '#F0F0F0'
                }
            },
            plotOptions: {
                series: {
                    dataLabels: {
                        color: '#B0B0B3'
                    },
                    marker: {
                        lineColor: '#333'
                    }
                },
                boxplot: {
                    fillColor: '#505053'
                },
                candlestick: {
                    lineColor: 'white'
                },
                errorbar: {
                    color: 'white'
                }
            },
            legend: {
                itemStyle: {
                    color: '#E0E0E3'
                },
                itemHoverStyle: {
                    color: '#FFF'
                },
                itemHiddenStyle: {
                    color: '#606063'
                }
            },
            credits: {
                style: {
                    color: '#666'
                }
            },
            labels: {
                style: {
                    color: '#707073'
                }
            },

            drilldown: {
                activeAxisLabelStyle: {
                    color: '#F0F0F3'
                },
                activeDataLabelStyle: {
                    color: '#F0F0F3'
                }
            },

            navigation: {
                buttonOptions: {
                    symbolStroke: '#DDDDDD',
                    theme: {
                        fill: '#505053'
                    }
                }
            },

            // scroll charts
            rangeSelector: {
                buttonTheme: {
                    fill: '#505053',
                    stroke: '#000000',
                    style: {
                        color: '#CCC'
                    },
                    states: {
                        hover: {
                            fill: '#707073',
                            stroke: '#000000',
                            style: {
                                color: 'white'
                            }
                        },
                        select: {
                            fill: '#000003',
                            stroke: '#000000',
                            style: {
                                color: 'white'
                            }
                        }
                    }
                },
                inputBoxBorderColor: '#505053',
                inputStyle: {
                    backgroundColor: '#333',
                    color: 'silver'
                },
                labelStyle: {
                    color: 'silver'
                }
            },

            navigator: {
                handles: {
                    backgroundColor: '#666',
                    borderColor: '#AAA'
                },
                outlineColor: '#CCC',
                maskFill: 'rgba(255,255,255,0.1)',
                series: {
                    color: '#7798BF',
                    lineColor: '#A6C7ED'
                },
                xAxis: {
                    gridLineColor: '#505053'
                }
            },

            scrollbar: {
                barBackgroundColor: '#808083',
                barBorderColor: '#808083',
                buttonArrowColor: '#CCC',
                buttonBackgroundColor: '#606063',
                buttonBorderColor: '#606063',
                rifleColor: '#FFF',
                trackBackgroundColor: '#404043',
                trackBorderColor: '#404043'
            },

            // special colors for some of the
            legendBackgroundColor: 'rgba(0, 0, 0, 0.5)',
            background2: '#505053',
            dataLabelsColor: '#B0B0B3',
            textColor: '#C0C0C0',
            contrastTextColor: '#F0F0F3',
            maskColor: 'rgba(255,255,255,0.3)'
        };
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
                    backgroundColor: darkTheme.background2,
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
                    [0.1, '#90ee7e'], // green
                    [0.5, '#DDDF0D'], // yellow
                    [0.9, '#f45b5b'] // red
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

        const cpuConfig = _.merge(gaugeOptions, darkTheme, {
            title: {
                margin: -18
            },
            yAxis: {
                min: 0,
                max: 100,
                title: {
                    text: 'CPU USAGE',
                    style: {
                        'fontSize': '20px',
                        'color': '#E0E0E3'
                    },
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
                    'white ">{y}</span><br/><span style="font-size:20px;color:silver">%</span></div>'},
                tooltip: {
                    valueSuffix: ' %'
                }
            }]
        });

        const memoryConfig = _.merge(darkTheme, {
            chart: {
                type: 'column',
                height: 300
            },
            credits: {
                enabled: false
            },
            title: {
                text: 'Memory Usage',
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
        });

        return (
            <Panel header={name} key={name} className="serverPanel">
                {error && (
                    <Alert bsStyle="danger">
                        <h4>Error: Lost connection to master-sysinfo script</h4>
                        <p>{error}</p>
                    </Alert>
                )}
                <div key={name} className="row">
                    <div className="col-md-2">
                        <div className="row servers-row">
                            <div className="col-md-12 mainTextColor">
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
                        <span className="net-param-span" id="memoryTotal">Memory Total: {resultStats.memoryTotal} GiB</span>
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
