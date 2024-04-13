import React, { Component } from 'react';
import Chart from 'react-apexcharts';
import './chart-styles.css'

class AreaChart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      options: {
        xaxis: {
          type: props.xValues
        },
        title: {
          text: 'Chart Title', 
        },
      },
      series: [{
        data : props.data
      }],
    };
  }

  render() {
    return (
      <div className="chart-container"> {/* Add a container with a class */}
        <h2 className="chart-title">Chart Title</h2> {/* Example title */}
        <Chart
          className='chart-x-axis-labels'
          options={this.state.options}
          series={this.state.series}
          type="area"
          width="100%"
        />
      </div>
    );
  }
}

export default AreaChart;
