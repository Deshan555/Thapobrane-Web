import React, { Component } from 'react';
import Chart from 'react-apexcharts';
import './chart-styles.css'

class DonutChart extends Component{
    constructor(props){
        super(props);
        const t = this.props.data;
        this.state = {
            options: {
            labels: t[0] ? props?.categories : [],
            legend: {
                show: true,
                showForSingleSeries: false,
                showForNullSeries: true,
                showForZeroSeries: true,
                position: 'bottom',
                horizontalAlign: 'center', 
                floating: false,
                fontSize: '12px',
                fontFamily: 'Poppins, sans-serif',
                fontWeight: 400,
                formatter: undefined,
                inverseOrder: false,
                width: undefined,
                height: undefined,
                tooltipHoverFormatter: undefined,
                customLegendItems: [],
                offsetX: 0,
                offsetY: 0,
                labels: {
                colors: undefined,
                useSeriesColors: false
                },
                markers: {
                width: 12,
                height: 12,
                strokeWidth: 0,
                strokeColor: '#fff',
                fillColors: undefined,
                radius: 12,
                customHTML: undefined,
                onClick: undefined,
                offsetX: 0,
                offsetY: 0
                },
                itemMargin: {
                horizontal: 5,
                vertical: 0
                },
                onItemClick: {
                toggleDataSeries: true
                },
                onItemHover: {
                highlightDataSeries: true
                },
            },              
            responsive: [{
                breakpoint: 480,
                options: {
                  chart: {
                width: 300
                  },
                  legend: {
                show: false,
                position: 'bottom'
                  }
                }
              }]
            },
            title: {
                text: 'Product Trends by Month',
                align: 'left'
              },
            toolbar: {
            show: true,
            tools: {
              download: true,
              selection: true,
              zoom: true,
              zoomin: true,
              zoomout: true,
              pan: true,
              reset: true,
              customIcons: []
            },
            autoSelected: 'zoom' 
            },
            series: t,
        }
    }
    render(){
        return(
            <Chart
                style={{ backgroundColor: 'white' }}
                options={this.state.options}
                series={this.state.series}
                type="donut"
                height={350}
                width={350}
            />
        );
    }
}

export default DonutChart;