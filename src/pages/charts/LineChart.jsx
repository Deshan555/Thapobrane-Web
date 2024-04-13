import React, { Component } from 'react';
import Chart from 'react-apexcharts'; // Assuming you're using ApexCharts for React
import './chart-styles.css'


class LineChart extends Component {
  constructor(props) {
    console.log(props);
    super(props);
    this.state = {
      options: {
        xaxis: {
          labels: {
            style: {
              fontSize: '12px', 
              fontFamily: 'Poppins, sans-serif', 
            },
          },
          title: {
            text: "Date",
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
          type: props.xValues
        },
        yaxis: {
          labels: {
            style: {
              fontSize: '12px',
              fontFamily: 'Helvetica, Arial, sans-serif',
            },
          },
          title: {
            text: "Tea Collection In Kilo Grams",
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
    <body>
      <Chart
        style={{margin: 'auto', backgroundColor: 'white'}}
        options={this.state.options}
        series={this.state.series}
        type="area"
        height={365}
      />
    </body>
    );
  }
}

export default LineChart;
