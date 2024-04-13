// import React, { Component } from 'react';
// import Chart from 'react-apexcharts'; // Assuming you're using ApexCharts for React
// import './chart-styles.css'


// class LineChart extends Component {
//   constructor(props) {
//     console.log(props);
//     super(props);
//     this.state = {
//       options: {
//         xaxis: {
//           labels: {
//             style: {
//               fontSize: '12px', 
//               fontFamily: 'Poppins, sans-serif', 
//             },
//           },
//           title: {
//             text: "Date",
//             offsetX: 0,
//             offsetY: 0,
//             style: {
//               color: undefined,
//               fontSize: '12px',
//               fontFamily: 'Poppins, sans-serif',
//               fontWeight: 400,
//               cssClass: 'apexcharts-xaxis-title',
//             },
//           },
//           type: props.xValues
//         },
//         yaxis: {
//           labels: {
//             style: {
//               fontSize: '12px',
//               fontFamily: 'Helvetica, Arial, sans-serif',
//             },
//           },
//           title: {
//             text: "Tea Collection In Kilo Grams",
//             rotate: -90,
//             offsetX: 0,
//             offsetY: 0,
//             style: {
//               color: undefined,
//               fontSize: '12px',
//               fontFamily: 'Poppins, sans-serif',
//               fontWeight: 400,
//               cssClass: 'apexcharts-yaxis-title',
//             },
//           },
//         },
//       },
//       series: [{
//         data : props.data
//       }],
//     };
//   }

//   render() {
//     return (
//     <body>
//       <Chart
//         style={{margin: 'auto', backgroundColor: 'white'}}
//         options={this.state.options}
//         series={this.state.series}
//         type="area"
//       />
//     </body>
//     );
//   }
// }

// export default LineChart;

      
        // var options = {
        //     series: [{
        //     name: 'Series 1',
        //     data: [20, 100, 40, 30, 50, 80, 33],
        //   }],
        //     chart: {
        //     height: 350,
        //     type: 'radar',
        //   },
        //   dataLabels: {
        //     enabled: true
        //   },
        //   plotOptions: {
        //     radar: {
        //       size: 140,
        //       polygons: {
        //         strokeColors: '#e9e9e9',
        //         fill: {
        //           colors: ['#f8f8f8', '#fff']
        //         }
        //       }
        //     }
        //   },
        //   title: {
        //     text: 'Radar with Polygon Fill'
        //   },
        //   colors: ['#FF4560'],
        //   markers: {
        //     size: 4,
        //     colors: ['#fff'],
        //     strokeColor: '#FF4560',
        //     strokeWidth: 2,
        //   },
        //   tooltip: {
        //     y: {
        //       formatter: function(val) {
        //         return val
        //       }
        //     }
        //   },
        //   xaxis: {
        //     categories: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
        //   },
        //   yaxis: {
        //     tickAmount: 7,
        //     labels: {
        //       formatter: function(val, i) {
        //         if (i % 2 === 0) {
        //           return val
        //         } else {
        //           return ''
        //         }
        //       }
        //     }
        //   }
        //   };
  
        //   var chart = new ApexCharts(document.querySelector("#chart"), options);
        //   chart.render();
        

import React, { Component } from 'react';
import Chart from 'react-apexcharts';
import './chart-styles.css'


class RadarChart extends Component {
  constructor(props) {
    console.log(props);
    super(props);
    this.state = {
      options: {
        series: [{
          name: 'Series 1',
          data: props.data
        }],
        chart: {
          height: 350,
          type: 'radar',
        },
        dataLabels: {
          enabled: true
        },
        plotOptions: {
          radar: {
            size: 100,
            polygons: {
              strokeColors: '#e9e9e9',
              fill: {
                colors: ['#f8f8f8', '#fff']
              }
            }
          }
        },
        colors: ['#FF4560'],
        markers: {
          size: 4,
          colors: ['#fff'],
          strokeColor: '#FF4560',
          strokeWidth: 2,
        },
        tooltip: {
          y: {
            formatter: function(val) {
              return val
            }
          }
        },
        xaxis: {
          categories: props.categories
        },
        yaxis: {
          tickAmount: 7,
          labels: {
            formatter: function(val, i) {
              if (i % 2 === 0) {
                return val
              } else {
                return ''
              }
            }
          }
        }
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
            type="radar"
            height="390px"
        />
        </body>
        );
    }

}

export default RadarChart;