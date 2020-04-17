/**
 * ---------------------------------------
 * This demo was created using amCharts 4.
 *
 * For more information visit:
 * https://www.amcharts.com/
 *
 * Documentation is available at:
 * https://www.amcharts.com/docs/v4/
 * ---------------------------------------
 */

// Themes begin
am4core.useTheme(am4themes_animated);
// Themes end

var chart = am4core.create("chartdiv", am4charts.XYChart);
chart.padding(40, 40, 40, 40);

chart.numberFormatter.bigNumberPrefixes = [
  { "number": 1e+3, "suffix": "K" },
  { "number": 1e+6, "suffix": "M" },
  { "number": 1e+9, "suffix": "B" }
];

var label = chart.plotContainer.createChild(am4core.Label);
label.x = am4core.percent(97);
label.y = am4core.percent(95);
label.horizontalCenter = "right";
label.verticalCenter = "middle";
label.dx = -15;
label.fontSize = 50;

var playButton = chart.plotContainer.createChild(am4core.PlayButton);
playButton.x = am4core.percent(97);
playButton.y = am4core.percent(95);
playButton.dy = -2;
playButton.verticalCenter = "middle";
playButton.events.on("toggled", function(event) {
  if (event.target.isActive) {
    play();
  }
  else {
    stop();
  }
})

var stepDuration = 4000;

var categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
categoryAxis.renderer.grid.template.location = 0;
categoryAxis.dataFields.category = "network";
categoryAxis.renderer.minGridDistance = 1;
categoryAxis.renderer.inversed = true;
categoryAxis.renderer.grid.template.disabled = true;

var valueAxis = chart.xAxes.push(new am4charts.ValueAxis());
valueAxis.min = 0;
valueAxis.rangeChangeEasing = am4core.ease.linear;
valueAxis.rangeChangeDuration = stepDuration;
valueAxis.extraMax = 0.1;

var series = chart.series.push(new am4charts.ColumnSeries());
series.dataFields.categoryY = "network";
series.dataFields.valueX = "MAU";
series.tooltipText = "{valueX.value}"
series.columns.template.strokeOpacity = 0;
series.columns.template.column.cornerRadiusBottomRight = 5;
series.columns.template.column.cornerRadiusTopRight = 5;
series.interpolationDuration = stepDuration;
series.interpolationEasing = am4core.ease.linear;

var labelBullet = series.bullets.push(new am4charts.LabelBullet())
labelBullet.label.horizontalCenter = "right";
labelBullet.label.text = "{values.valueX.workingValue.formatNumber('#.0as')}";
labelBullet.label.textAlign = "end";
labelBullet.label.dx = -10;

chart.zoomOutButton.disabled = true;

// as by default columns of the same series are of the same color, we add adapter which takes colors from chart.colors color set
series.columns.template.adapter.add("fill", function(fill, target){
  return chart.colors.getIndex(target.dataItem.index);
});



categoryAxis.sortBySeries = series;

// var allData = {
//   "2003": [
//     {
//       "network": "Facebook",
//       "MAU": 0
//     },
//     {
//       "network": "Flickr",
//       "MAU": 0
//     },
//     {
//       "network": "Google Buzz",
//       "MAU": 0
//     },
//
//     {
//       "network": "Friendster",
//       "MAU": 4470000
//     },
//     {
//       "network": "Google+",
//       "MAU": 0
//     },
//     {
//       "network": "Hi5",
//       "MAU": 0
//     },
//     {
//       "network": "Instagram",
//       "MAU": 0
//     },
//     {
//       "network": "MySpace",
//       "MAU": 0
//     },
//     {
//       "network": "Orkut",
//       "MAU": 0
//     },
//     {
//       "network": "Pinterest",
//       "MAU": 0
//     },
//     {
//       "network": "Reddit",
//       "MAU": 0
//     },
//     {
//       "network": "Snapchat",
//       "MAU": 0
//     },
//     {
//       "network": "TikTok",
//       "MAU": 0
//     },
//     {
//       "network": "Tumblr",
//       "MAU": 0
//     },
//     {
//       "network": "Twitter",
//       "MAU": 0
//     },
//     {
//       "network": "WeChat",
//       "MAU": 0
//     },
//     {
//       "network": "Weibo",
//       "MAU": 0
//     },
//     {
//       "network": "Whatsapp",
//       "MAU": 0
//     },
//     {
//       "network": "YouTube",
//       "MAU": 0
//     }
//   ],
//   "2004": [
//     {
//       "network": "Facebook",
//       "MAU": 0
//     },
//     {
//       "network": "Flickr",
//       "MAU": 3675135
//     },
//     {
//       "network": "Friendster",
//       "MAU": 5970054
//     },
//     {
//       "network": "Google Buzz",
//       "MAU": 0
//     },
//     {
//       "network": "Google+",
//       "MAU": 0
//     },
//     {
//       "network": "Hi5",
//       "MAU": 0
//     },
//     {
//       "network": "Instagram",
//       "MAU": 0
//     },
//     {
//       "network": "MySpace",
//       "MAU": 980036
//     },
//     {
//       "network": "Orkut",
//       "MAU": 4900180
//     },
//     {
//       "network": "Pinterest",
//       "MAU": 0
//     },
//     {
//       "network": "Reddit",
//       "MAU": 0
//     },
//     {
//       "network": "Snapchat",
//       "MAU": 0
//     },
//     {
//       "network": "TikTok",
//       "MAU": 0
//     },
//     {
//       "network": "Tumblr",
//       "MAU": 0
//     },
//     {
//       "network": "Twitter",
//       "MAU": 0
//     },
//     {
//       "network": "WeChat",
//       "MAU": 0
//     },
//     {
//       "network": "Weibo",
//       "MAU": 0
//     },
//     {
//       "network": "Whatsapp",
//       "MAU": 0
//     },
//     {
//       "network": "YouTube",
//       "MAU": 0
//     }
//   ]
// }

var rawData = {
  "actual_values": [
    {"date": "26-03-2020", "confirmed": 3, "state": "Andhra"},
    {"date": "26-03-2020", "confirmed": 0, "state": "Karnat"},
    {"date": "27-03-2020", "confirmed": 5, "state": "Andhra"},
    {"date": "27-03-2020", "confirmed": 7, "state": "Karnat"},
    {"date": "28-03-2020", "confirmed": 17, "state": "Andhra"},
    {"date": "28-03-2020", "confirmed": 28, "state": "Karnat"},
    {"date": "29-03-2020", "confirmed": 35, "state": "Andhra"},
    {"date": "29-03-2020", "confirmed": 57, "state": "Karnat"}
  ]
};

var allData = {}, allDates = [], allStates = [];
rawData.actual_values.forEach(obj => {
  if ( !allData.hasOwnProperty(obj.date) ) {

    allData[obj.date] = [];

    allDates.push(new Date(obj.date.split("-").reverse().join("-")));
  }

  allData[obj.date].push({
    "network": obj.state,
    "MAU": obj.confirmed
  });

});

allDates.sort((a,b) => a.getTime() - b.getTime());

function getDateStr(date) {
  var dateStr = ("0" + date.getDate()).slice(-2) + "-" + ("0" + (date.getMonth() + 1)).slice(-2) + "-" + date.getFullYear();
  return dateStr;
}

var fd = allDates[0], ld = allDates[-1], index = 0, maxInd = allDates.length - 1;
var year = getDateStr(fd);
label.text = year.toString();

var interval;

function play() {
  interval = setInterval(function(){
    nextYear();
  }, stepDuration)
  nextYear();
}

function stop() {
  if (interval) {
    clearInterval(interval);
  }
}

function nextYear() {
  if ( index < maxInd ) {
    year = getDateStr(allDates[++index]);
  } else {
    year = getDateStr(allDates[0]);
    index = 0;
  }

  // if (year > 2018) {
  //   year = 2003;
  // }

  var newData = allData[year];
  var itemsWithNonZero = 0;
  for (var i = 0; i < chart.data.length; i++) {
    chart.data[i].MAU = newData[i].MAU;
    if (chart.data[i].MAU > 0) {
      itemsWithNonZero++;
    }
  }

  if (year == 2003) {
    series.interpolationDuration = stepDuration / 4;
    valueAxis.rangeChangeDuration = stepDuration / 4;
  }
  else {
    series.interpolationDuration = stepDuration;
    valueAxis.rangeChangeDuration = stepDuration;
  }

  chart.invalidateRawData();
  label.text = year.toString();

  categoryAxis.zoom({ start: 0, end: itemsWithNonZero / categoryAxis.dataItems.length });
}



chart.data = JSON.parse(JSON.stringify(allData[year]));
categoryAxis.zoom({ start: 0, end: 1 / chart.data.length });

series.events.on("inited", function() {
  setTimeout(function() {
    playButton.isActive = true; // this starts interval
  }, 2000)
})
