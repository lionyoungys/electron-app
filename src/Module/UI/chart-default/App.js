/**
 * 自定义折线图组件
 * @author yangyunlong
 */
import React from 'react';
import Highcharts from 'highcharts';
//折线图组件    current = 当前月的数组记录    previous = 上月的数组记录
export default class extends React.Component{
    constructor(props) {
        super(props);
        this.data = this.data.bind(this);
    }

    data(container) {
        if (null === container) return;
        Highcharts.chart(container, {
                title: {text: ''},
                yAxis: {title: {text: ''}},
                xAxis:{allowDecimals: false},
                legend: {
                    layout: 'vertical',
                    align: 'right',
                    verticalAlign: 'middle'
                },
                plotOptions: {
                    series: {
                        label: {
                            connectorAllowed: false
                        },
                        pointStart: 1
                    }
                },
            
                series: [{
                    name: '本月',
                    color: '#0bb1a7',
                    data: this.props.current
                }, {
                    name: '上月',
                    color: '#eb6304',
                    data: this.props.previous
                }],
            
                responsive: {
                    rules: [{
                        condition: {},
                        chartOptions: {
                            legend: {
                                layout: 'horizontal',
                                align: 'center',
                                verticalAlign: 'bottom'
                            }
                        }
                    }]
                }
            
            });
    }

    render() {return (<div ref={container => this.data(container)}></div>);}
}