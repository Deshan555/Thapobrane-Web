import React, { Component } from 'react';
import Chart from 'react-apexcharts';
import './chart-styles.css'
import { map } from 'lodash';
import style from 'react-syntax-highlighter/dist/esm/styles/hljs/a11y-dark';


/*
var options = {
  chart: {
    id: 'apex',
    parentHeightOffset: 0,
    toolbar: {
      show: false,
    },
    zoom: {
      enabled: false,
    },
  },
  // axises
  xaxis: {
    type: 'datetime',
    labels: {
      format: 'MMM dd',
      style: {
        color: '#666',
        fontSize: '11px',
      },
    },
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: true,
    },
    crosshairs: {
      show: true,
      width: 1,
      position: 'front',
      stroke: {
        color: '#825ebb',
        width: 1,
        dashArray: 0,
      },
    },
    tooltip: {
      enabled: false,
    },
  },
  yaxis: {
    tickAmount: 1,
    forceNiceScale: true,
    decimalsInFloat: false,
    labels: {
      show: true,
      align: 'right',
      minWidth: 0,
      // maxWidth: 160,
      style: {
        color: '#666',
        fontSize: '11px',
      },
      formatter: val => {
        return val.toFixed(0);
      },
    },
  },
  // data label (value on marker)
  dataLabels: {
    enabled: false,
  },
  // point marker
  markers: {
    size: 0,
    colors: ['#825ebb'],
    strokeColors: 'white',
    strokeWidth: 3,
    strokeOpacity: 1,
    fillOpacity: 1,
    discrete: [],
    shape: 'circle',
    radius: 8,
    offsetX: 0,
    offsetY: 0,
    hover: {
      sizeOffset: 8,
    },
  },
  // grid
  grid: {
    show: true,
    borderColor: '#eee',
    strokeDashArray: 0,
    position: 'back',
    xaxis: {
      lines: {
        show: false,
      },
    },
  },
  // base color
  colors: ['#825ebb'],
  // chart line stroke
  stroke: {
    show: true,
    curve: 'smooth',
    lineCap: 'round',
    colors: ['#825ebb'],
    width: 2,
    dashArray: 0,
  },
  // chart area
  fill: {
    type: 'solid',
    colors: ['#825eeb'],
  },
  // tooltip
  tooltip: {
    x: {
      format: 'MMM dd, yyyy',
    },
    followCursor: true,
    custom: ({ ctx, series, seriesIndex, dataPointIndex, w }) => {
      const xVal = ctx.series.filteredSeriesX()[seriesIndex][dataPointIndex];
      return `
      <div class="tooltip">
        <div class="tooltip__x">
          ${ctx.formatters.xLabelFormat(null, xVal)}
        </div>
        <div class="tooltip__serie">
          ${w.globals.seriesNames[seriesIndex]}
        </div>
        <div class="tooltip__y">${series[seriesIndex][dataPointIndex]}</div>
      </div>`;
    },
  },
  series: [{
    data: [{x: "2019-07-19", y: 0}, {x: "2019-07-20", y: 0}, {x: "2019-07-21", y: 0}, {x: "2019-07-22", y: 0}, {x: "2019-07-23", y: 0}, {x: "2019-07-24", y: 120}, {x: "2019-07-25", y: 598}, {x: "2019-07-26", y: 313}, {x: "2019-07-27", y: 0}, {x: "2019-07-28", y: 19}, {x: "2019-07-29", y: 472}, {x: "2019-07-30", y: 305}, {x: "2019-07-31", y: 0}, {x: "2019-08-01", y: 0}, {x: "2019-08-02", y: 0}]
  }]
};

var chart = new ApexCharts(document.querySelector("#chart"), options);

chart.render();
*/
class AreaChart extends Component {

  constructor(props) {
    super(props);
    this.state = {

      series: [{
        name: "Desktops",
        data: props?.data?.map((item) => (
          {
            x: props.xInfo === 'DATE' ?  item.x.toLocaleDateString('en-US', { day: 'numeric' }) : item?.x,
            y: item?.y
          }
        )),
      }],

      options: {
        chart: {
          height: 350,
          type: 'line',
          zoom: {
            enabled: false
          }
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          curve: 'straight'
        },
        title: {
          text: 'Product Trends by Month',
          align: 'left'
        },
        grid: {
          row: {
            colors: ['#f3f3f3', 'transparent'], 
            opacity: 0.0
          },
        },
        xaxis: {
          style: {
            fontSize: '12px',
            fontFamily: 'Poppins, sans-serif',
          },
        },
        markers: {
          size: 7,
          colors: undefined,
          strokeColors: '#fff',
          strokeWidth: 2,
          strokeOpacity: 0.9,
          strokeDashArray: 0,
          fillOpacity: 1,
          discrete: [],
          shape: "circle",
          radius: 2,
          offsetX: 0,
          offsetY: 0,
          onClick: undefined,
          onDblClick: undefined,
          showNullDataPoints: true,
          hover: {
            size: undefined,
            sizeOffset: 3
          }
        }
      },


    };
  }

  render() {
    return (
        <Chart
        style={{margin: 'auto', backgroundColor: 'white', fontSize: '19px', fontFamily: 'Poppins, sans-serif'}}
          options={this.state.options}
          series={this.state.series}
          type="line"
          width="100%"
          height="100%"
        />
    );
  }
}

export default AreaChart;
