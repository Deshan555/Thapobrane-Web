import React, { Component } from 'react';
import Chart from 'react-apexcharts'; // Assuming you're using ApexCharts for React
import './chart-styles.css'

class HorizontalBarChart extends Component {
    constructor(props) {        
        console.log(props);
        super(props);
        this.state = {
        options: {
            colors:props.color || ['#F44336', '#E91E63', '#9C27B0'],
            // colors: ['##9cffff'],
            plotOptions: {
                bar: {
                  columnWidth: '45%',
                  borderRadius: 4,
                  color: props.color || undefined,
                  horizontal: true,
                }
            },
            xaxis: {
            labels: {
                style: {
                fontSize: '12px', 
                fontFamily: 'Poppins, sans-serif', 
                },
            },
            title: {
                text: props.xaxisTitle || "X-Axis Title",
                offsetX: 0,
                offsetY: 0,
                style: {
                color: undefined,
                fontSize: '12px',
                fontFamily: 'Poppins, sans-serif',
                fontWeight: 400,
                cssClass: 'apexcharts-xaxis-title',
                },
            },
            // just show first 3 charcters of data
            categories: props.categories?.map((category) => category.substring(0, 3)) || [],
            },
            yaxis: {
            labels: {
                style: {
                fontSize: '12px',
                fontFamily: 'Helvetica, Arial, sans-serif',
                },
            },
            title: {
                text: props.yaxisTitle || "Y-Axis Title",
                rotate: -90,
                offsetX: 0,
                offsetY: 0,
                style: {
                color: undefined,
                fontSize: '12px',
                fontFamily: 'Poppins, sans-serif',
                fontWeight: 400,
                cssClass: 'apexcharts-yaxis-title',
                },
            },
            },
        },
        series: [{
            data : props.data
        }],
        };
    }
    
    render() {
        return (
        <div className="horizontal-bar-chart">
            <Chart
            style={{margin: 'auto', backgroundColor: 'white'}}
            options={this.state.options}
            series={this.state.series}
            type="bar"
            height={365}
            />
        </div>
        );
    }
}

export default HorizontalBarChart;
