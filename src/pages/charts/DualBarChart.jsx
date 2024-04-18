     
        // var options = {
        //     series: [{
        //     data: [44, 55, 41, 64, 22, 43, 21]
        //   }, {
        //     data: [53, 32, 33, 52, 13, 44, 32]
        //   }],
        //     chart: {
        //     type: 'bar',
        //     height: 430
        //   },
        //   plotOptions: {
        //     bar: {
        //       horizontal: true,
        //       dataLabels: {
        //         position: 'top',
        //       },
        //     }
        //   },
        //   dataLabels: {
        //     enabled: true,
        //     offsetX: -6,
        //     style: {
        //       fontSize: '12px',
        //       colors: ['#fff']
        //     }
        //   },
        //   stroke: {
        //     show: true,
        //     width: 1,
        //     colors: ['#fff']
        //   },
        //   tooltip: {
        //     shared: true,
        //     intersect: false
        //   },
        //   xaxis: {
        //     categories: [2001, 2002, 2003, 2004, 2005, 2006, 2007],
        //   },
        //   };
  
        //   var chart = new ApexCharts(document.querySelector("#chart"), options);
        //   chart.render();

        import React, { Component } from 'react';
import Chart from 'react-apexcharts'; // Assuming you're using ApexCharts for React
import './chart-styles.css'


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
//         height={365}
//       />
//     </body>
//     );
//   }
// }

// export default LineChart;

// class DualBarChart extends Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//         options: {
//             series: [{
//             data: [44, 55, 41, 64, 22, 43, 21]
//             }, {
//             data: [53, 32, 33, 52, 13, 44, 32]
//             }],
//             chart: {
//             type: 'bar',
//             height: 430
//             },
//             plotOptions: {
//             bar: {
//                 horizontal: true,
//                 dataLabels: {
//                 position: 'top',
//                 },
//             }
//             },
//             dataLabels: {
//             enabled: true,
//             offsetX: -6,
//             style: {
//                 fontSize: '12px',
//                 colors: ['#fff']
//             }
//             },
//             stroke: {
//             show: true,
//             width: 1,
//             colors: ['#fff']
//             },
//             tooltip: {
//             shared: true,
//             intersect: false
//             },
//             xaxis: {
//             categories: [2001, 2002, 2003, 2004, 2005, 2006, 2007],
//             },
//         }
//         };
//     }
    
//     render() {
//         return (
//         <Chart
//             style={{margin: 'auto', backgroundColor: 'white', fontSize: '19px', fontFamily: 'Poppins, sans-serif'}}
//             options={this.state.options}
//             series={this.state.series}
//             type="bar"
//             width="100%"
//             height="100%"
//         />
//         );
//     }
//     }

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
                        horizontal: false,
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
                height="100%"
            />
        );
    }
}
