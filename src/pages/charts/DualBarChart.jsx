import React, { Component } from 'react';
import Chart from 'react-apexcharts'; // Assuming you're using ApexCharts for React
import './chart-styles.css'


export default class DualBarChart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            options: {
                series: [{
                    data: [44, 55, 41, 64, 22, 43, 21]
                }, {
                    data: [53, 32, 33, 52, 13, 44, 32]
                }],
                chart: {
                    type: 'bar',
                    height: 430
                },
                plotOptions: {
                    bar: {
                        horizontal: props?.horizontalx ? props?.horizontalx : false,
                        borderRadius: 4,
                        dataLabels: {
                            position: 'top',
                        },
                    }
                },
                dataLabels: {
                    enabled: true,
                    offsetX: -6,
                    style: {
                        fontSize: '12px',
                        colors: ['#fff']
                    }
                },
                stroke: {
                    show: true,
                    width: 1,
                    colors: ['#fff']
                },
                tooltip: {
                    shared: true,
                    intersect: false
                },
                xaxis: {
                    categories: props?.categories,
                    title: {
                        text: props?.xTitle ? props?.xTitle : 'X-Axis'
                    },
                },
                yaxis: {
                    title: {
                        text: props?.yTitle ? props?.yTitle : 'Y-Axis'
                    }
                },
            },
            series: [{
                data: props?.collectioX
            }, {
                data: props?.collectioY
            }] 
        };
    }

    render() {
        return (
            <Chart
                style={{ margin: 'auto', backgroundColor: 'white', fontSize: '19px', fontFamily: 'Poppins, sans-serif' }}
                options={this.state.options}
                series={this.state.series}
                type="bar"
                width="100%"
                height="350px"
            />
        );
    }
}
