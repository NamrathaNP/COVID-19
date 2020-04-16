var width = 500,
  height = 500,
  padding = 1, // separation between same-color nodes
  clusterPadding = 5, // separation between different-color nodes
  maxRadius = 10;
minRadius = 5;
var legendRectSize = 15;                                  // NEW
var legendSpacing = 4;  



d3.json("Patient_Clusters.json", function(data1) {
  //calculate teh maximum group present
  var data=data1[0]
  console.log(data);
  var clusters =[]
  var dataset1 =[];
  for (var key in data)
  clusters.push(key);
   console.log(clusters);
  // m = d3.max(keys, function(d){return d.clusters});
  // //create teh color categories
  // color = d3.scale.category10()
  // .domain(d3.range(m));
  m = clusters.length;
  color = d3.scale.category10()
  .domain(clusters);
  // //make teh clusters array each cluster for each group
  // clusters = new Array(m);
  // console.log(clusters);
  for (var key in data){
    data2=data[key].patients;
    for( var i=0; i< data2.length; i++){
     var fdata={
    clusters: key,
    patient: data2[i],
    highlights: data[key].highlights
   }
   dataset1.push(fdata);
  }
     
    
    }
console.log(dataset1);
  dataset = dataset1.map(function(d) {
    //find teh radius intered in the csv
//   var r = parseInt(d.radius);
// var r = d3.scaleLinear().domain([0, 10]).range([3, maxRadius]);

//   console.log(r);

    var dta = {
      cluster: d.clusters,//group
      name: d.patient,//label
      Highlights: d.highlights,
      radius: 100/(dataset1.length),//radius adjusted by data size ,of the nodes
      x: Math.cos(clusters.indexOf(d.clusters) / m * 2 * Math.PI) * 100 + width / 2 + Math.random(),
      y: Math.sin(clusters.indexOf(d.clusters) / m * 2 * Math.PI) * 100 + height / 2 + Math.random()
    };
    //add the one off the node inside teh cluster
    if (!clusters[d.clusters] ) clusters[d.clusters] = dta;
    return dta;
  });
  //after mapping use that t make the graph
  makeGraph(dataset);


//this will make the grapg from nodes
function makeGraph(nodes) {
  console.log(nodes);
  var force = d3.layout.force()
    .nodes(nodes)
    .size([width, height])
    .gravity(.02)
    .charge(0)
    .on("tick", tick)
    .start();

  var svg = d3.select("#cluster_chart").append("svg:svg")
    .attr("width", width)
    .attr("height", height);

  var node = svg.selectAll("circle")
    .data(nodes)
    .enter().append("g").call(force.drag);


    // var gnodes = svg.selectAll('g.gnode')//('g.gnode')
    // .data(nodes)
    // .enter()
    // .append('g')
    // .classed('gnode', true);
    
    // var labels = nodes.append("text")
    // .text(function(d) { return d.Highlights; })
    // .style("visibility", "hidden");
    node.append("title")
    .text(function(d) { return d.Highlights; });
    
    
  //addcircle to the group
  node.append("circle")
    .style("fill", function(d) {
      return color(d.cluster);
    }).attr("r", function(d) {
      return d.radius
    })
    //add text to the group    
  node.append("text")
    .text(function(d) {
      return d.name;
    })
    .attr("dx", -10)
    .attr("dy", ".35em")
    .text(function(d) {
      return d.name
    })
    .style("stroke", "none");
  //   .on("mouseover", function(d)
  //   {
  //       d3.select([d.Highlights]).style("visibility","visible")
  //   })
  //  .on("mouseout", function(d)
  //   {
  //       d3.select([d.Highlights]).style("visibility","hidden")
  //   });


    var newdata= nodes.sort(function(a, b) {return d3.ascending(a.Highlights, b.Highlights);});
    console.log(newdata);
        var buckets = [...new Set(newdata.map(d => d.Highlights))]
        .map(Highlights=>{
          return{
            Highlights: Highlights,
            cluster:nodes.find(s=> s.Highlights === Highlights).cluster
          }
        });
        console.log(buckets);
        
   
    var legend = svg.selectAll('.legend')                     // NEW
    .data(buckets)                                   // NEW
    .enter()                                                // NEW
    .append('g')                                            // NEW
    .attr('class', 'legend')                                // NEW
    .attr('transform', function(d, i) {                     // NEW
      var height = legendRectSize + legendSpacing;          // NEW
      var offset =  height * buckets.length / 2;     // NEW
      var horz = 5 * legendRectSize;                       // NEW
      var vert = i * height + offset;                       // NEW
      return 'translate(' + horz + ',' + vert + ')';        // NEW
    });                                                     // NEW

  legend.append('rect') 
    .attr('width', legendRectSize)                          // NEW
    .attr('height', legendRectSize)  
    .style('fill', function(d) {
      return color(d.cluster)})                                  // NEW
    .style('stroke', function(d) {
      return color(d.cluster)});                                // NEW
    
  legend.append('text')                                     // NEW
    .attr('x', legendRectSize + legendSpacing)              // NEW
    .attr('y', legendRectSize - legendSpacing)              // NEW
    .text(function(d) { return d.cluster; });                       // NEW



 function tick(e) {
  
    node.each(cluster(10 * e.alpha * e.alpha))
      .each(collide(.5))
      //.attr("transform", functon(d) {});
      .attr("transform", function(d) {
        var k = "translate(" + d.x + "," + d.y + ")";
        return k;
      })

  }

  // Move d to be adjacent to the cluster node.
  function cluster(alpha) {
    return function(d) {
    
      var cluster = clusters[d.cluster];
      if (cluster === d) return;
      var x = d.x - cluster.x,
        y = d.y - cluster.y,
        l = Math.sqrt(x * x + y * y),
        r = d.radius + cluster.radius;
      if (l != r) {
        l = (l - r) / l * alpha;
        d.x -= x *= l;
        d.y -= y *= l;
        cluster.x += x;
        cluster.y += y;
      }
    };
  }

  // Resolves collisions between d and all other circles.
  function collide(alpha) {
    var quadtree = d3.geom.quadtree(nodes);
    return function(d) {
      var r = d.radius + maxRadius + Math.max(padding, clusterPadding),
        nx1 = d.x - r,
        nx2 = d.x + r,
        ny1 = d.y - r,
        ny2 = d.y + r;
      quadtree.visit(function(quad, x1, y1, x2, y2) {
        if (quad.point && (quad.point !== d)) {
          var x = d.x - quad.point.x,
            y = d.y - quad.point.y,
            l = Math.sqrt(x * x + y * y),
            r = d.radius + quad.point.radius + (d.cluster === quad.point.cluster ? padding : clusterPadding);
          if (l < r) {
            l = (l - r) / l * alpha;
            d.x -= x *= l;
            d.y -= y *= l;
            quad.point.x += x;
            quad.point.y += y;
          }
        }
        return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
      });
    };
  }
}
});






