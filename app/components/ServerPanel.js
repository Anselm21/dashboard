import React, {Component, PropTypes} from 'react';
import ReactHighcharts from 'react-highcharts';

export default class ServerPanel extends Component {

    static propTypes = {
        stats: PropTypes.array,
        name: PropTypes.string
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

    render() {
        const config = {
            xAxis: {
                categories: this.getTimeAxis()
            },
            series: [{
                data: this.getCPUAxis()
            }],
            chart: {
                type: 'area'
            }
        };
        const {stats, name} = this.props;
        return (
            <div key={name}>
                <ReactHighcharts config={config} ref={name}/>
            </div>);
    }
}
