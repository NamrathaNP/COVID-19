Highcharts.chart('multiaxis', {
  chart: {
    zoomType: 'xy'
  },
  title: {
    text: ''
  },
  subtitle: {
    text: ''
  },
  xAxis: [{
    categories: ['10-Apr', '11-Apr', '12-Apr', '13-Apr', '14-Apr', '15-Apr',
      '16-Apr', '17-Apr', '18-Apr', '19-Apr', '20-Apr', '21-Apr'],
    crosshair: true
  }],
  yAxis: [{ // Primary yAxis
    labels: {
      format: '{value}M',
      style: {
        color: Highcharts.getOptions().colors[6]
      }
    },
    title: {
      text: 'Susceptibles',
      style: {
        color: Highcharts.getOptions().colors[6]
      }
    }
  }, { // Secondary yAxis
    title: {
      text: 'Infected',
      style: {
        color: Highcharts.getOptions().colors[3]
      }
    },
    labels: {
      format: '{value}K',
      style: {
        color: Highcharts.getOptions().colors[3]
      }
    },
    opposite: true
  }, {
    // Ternary yAxis
    title: {
      text: 'Recovered',
      style: {
        color: Highcharts.getOptions().colors[2]
      }
    },
    labels: {
      format: '{value} ',
      style: {
        color: Highcharts.getOptions().colors[2]
      }
    },
    opposite: true
  }],
  tooltip: {
    shared: true
  },
  legend: {
    layout: 'vertical',
    align: 'left',
    x: 120,
    verticalAlign: 'top',
    y: 100,
    floating: true,
    backgroundColor:
      Highcharts.defaultOptions.legend.backgroundColor || // theme
      'rgba(255,255,255,0.25)'
  },
  series: [
    {
      name: 'Susceptibles',
      type: 'spline',
      yAxis: 0,
      color: Highcharts.getOptions().colors[6],
      data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5],
      tooltip: {
        valueSuffix: 'M'
      }
    },
    {
      name: 'Infected',
      type: 'spline',
      yAxis: 1,
      color: Highcharts.getOptions().colors[3],
      data: [49.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5],
      tooltip: {
        valueSuffix: ' K'
      }
    },
    {
      name: 'Recovered',
      type: 'spline',
      yAxis: 2,
      color: Highcharts.getOptions().colors[2],
      data: [10, 20, 30, 40, 50, 60, 70, 80],
      tooltip: {
        valueSuffix: ''
      }
    },
    {
      name: '',
      type: 'spline',
      yAxis: 0,
      showInLegend: false,
      enableMouseTracking: false,
      color: Highcharts.getOptions().colors[6],
      dashStyle: 'Dash',
      data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 37.3, 49.1, 53.4, 64.3],
      tooltip: {
        valueSuffix: 'M'
      }
    },
    {
      name: '',
      type: 'spline',
      yAxis: 1,
      showInLegend: false,
      enableMouseTracking: false,
      color: Highcharts.getOptions().colors[3],
      dashStyle: 'Dash',
      data: [49.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4],
      tooltip: {
        valueSuffix: ' K'
      }
    },
    {
      name: '',
      type: 'spline',
      yAxis: 2,
      showInLegend: false,
      enableMouseTracking: false,
      color: Highcharts.getOptions().colors[2],
      dashStyle: 'Dash',
      data: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120],
      tooltip: {
        valueSuffix: ''
      }
    }
  ]
});
