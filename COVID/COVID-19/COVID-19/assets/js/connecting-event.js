
if ($('#event_chart').length) {
var width = 960;
    height = 900;
    radius = 5;
    var legendRectSize = 15;                                  // NEW
var legendSpacing = 4;  



var svg = d3.select("div#event_chart").append("svg:svg")
    .attr("width", width)
    .attr("height", height);

var force = d3.layout.force()
    .gravity(.05)
    .distance(60)
    .charge(0)
    .size([width, height]);


d3.json("E2p.json", function(dataset) {
  console.log(dataset);
  json = dataset.map(function(d) {
                var dta = {
                    Source:d.event,
                   Target:d.patient,
                   State:d.status
                  };
                  return dta;
            });
// console.log(json);
  //array of nodes
  var nodes = [];
  //array of links
  var links = [];

  var newdata= json.sort(function(a, b) {return d3.ascending(a.State, b.State);});
console.log(newdata);
    var buckets = [...new Set(newdata.map(d => d.State))];
    console.log(buckets);
  var color = d3.scale.category10()
  .domain(buckets);
  // console.log(color);
  // var color = d3.scale.category10();
  

  json.forEach(function(d){
    
    if (nodes.indexOf(d.Source) <0){
      //sorce node not there so add
      nodes.push(d.Source)
    }
    if (nodes.indexOf(d.Target) <0){
      //target node not there so add
      nodes.push(d.Target)
    }
  
    links.push({source:nodes.indexOf(d.Source), target:nodes.indexOf(d.Target)})
  });
  nodes = nodes.map(function(n){
    data = json.map(function(d) {
        if(n == d.Source ||n == d.Target){
           n={ name: n,
            state : d.State
           }
        }

    });

    return n
  })
  var k = Math.sqrt(nodes.length / (width * height)/2);

 
  force
      .nodes(nodes)
      .links(links)
      .charge(-7 / k)
      .gravity(100 * k)
      .start(); 
  

  var link = svg.selectAll(".link")
      .data(links)
    .enter().append("line")
      .attr("class", "link")
    .style("stroke-width", function(d) { return 1; });

  var node = svg.selectAll(".node")
      .data(nodes)
    .enter().append("g")
      .attr("class", "node")
      .call(force.drag);

  node.append("circle")
    .style("fill", function(d){return color(d.state)})
      .attr("r","5");
  node.append("title")
  .text(function(d) { return d.name; });
  
  node.append("text")
      .attr("dx", 0.1)
      .attr("dy", ".001em")
      .text(function(d) { return d.name });


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
        return color(d)})                                  // NEW
      .style('stroke', function(d) {
        return color(d)});                                // NEW
      
    legend.append('text')                                     // NEW
      .attr('x', legendRectSize + legendSpacing)              // NEW
      .attr('y', legendRectSize - legendSpacing)              // NEW
      .text(function(d) { return d; });    
    

  force.on("tick", function() {
    link.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });
    // node.attr("cx", function(d) { return d.x = Math.max(radius, Math.min(width - radius, d.x)); })
    // .attr("cy", function(d) { return d.y = Math.max(radius, Math.min(height - radius, d.y)); });    

    node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
    // d3.forceCenter(width , height);
    
  });


//     console.log(e);
//     node.each(cluster(10 * e.alpha * e.alpha))
//       .each(collide(.5))
//       //.attr("transform", functon(d) {});
//     });

//   function cluster(alpha) {
//     return function(d) {
//       var cluster = clusters[d.cluster];
//       if (cluster === d) return;
//       var x = d.x - cluster.x,
//         y = d.y - cluster.y,
//         l = Math.sqrt(x * x + y * y),
//         r = d.radius + cluster.radius;
//       if (l != r) {
//         l = (l - r) / l * alpha;
//         d.x -= x *= l;
//         d.y -= y *= l;
//         cluster.x += x;
//         cluster.y += y;
//       }
//     };
//   }

//   // Resolves collisions between d and all other circles.
//   function collide(alpha) {
//     var quadtree = d3.geom.quadtree(nodes);
//     return function(d) {
//       var r = d.radius + maxRadius + Math.max(padding, clusterPadding),
//         nx1 = d.x - r,
//         nx2 = d.x + r,
//         ny1 = d.y - r,
//         ny2 = d.y + r;
//       quadtree.visit(function(quad, x1, y1, x2, y2) {
//         if (quad.point && (quad.point !== d)) {
//           var x = d.x - quad.point.x,
//             y = d.y - quad.point.y,
//             l = Math.sqrt(x * x + y * y),
//             r = d.radius + quad.point.radius + (d.cluster === quad.point.cluster ? padding : clusterPadding);
//           if (l < r) {
//             l = (l - r) / l * alpha;
//             d.x -= x *= l;
//             d.y -= y *= l;
//             quad.point.x += x;
//             quad.point.y += y;
//           }
//         }
//         return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
//       });
//     };
//   }




//     console.log(e);
//     node.each(cluster(10 * e.alpha * e.alpha))
//       .each(collide(.5))
//       //.attr("transform", functon(d) {});
//     });

//   function cluster(alpha) {
//     return function(d) {
//       var cluster = clusters[d.cluster];
//       if (cluster === d) return;
//       var x = d.x - cluster.x,
//         y = d.y - cluster.y,
//         l = Math.sqrt(x * x + y * y),
//         r = d.radius + cluster.radius;
//       if (l != r) {
//         l = (l - r) / l * alpha;
//         d.x -= x *= l;
//         d.y -= y *= l;
//         cluster.x += x;
//         cluster.y += y;
//       }
//     };
//   }

//   // Resolves collisions between d and all other circles.
//   function collide(alpha) {
//     var quadtree = d3.geom.quadtree(nodes);
//     return function(d) {
//       var r = d.radius + maxRadius + Math.max(padding, clusterPadding),
//         nx1 = d.x - r,
//         nx2 = d.x + r,
//         ny1 = d.y - r,
//         ny2 = d.y + r;
//       quadtree.visit(function(quad, x1, y1, x2, y2) {
//         if (quad.point && (quad.point !== d)) {
//           var x = d.x - quad.point.x,
//             y = d.y - quad.point.y,
//             l = Math.sqrt(x * x + y * y),
//             r = d.radius + quad.point.radius + (d.cluster === quad.point.cluster ? padding : clusterPadding);
//           if (l < r) {
//             l = (l - r) / l * alpha;
//             d.x -= x *= l;
//             d.y -= y *= l;
//             quad.point.x += x;
//             quad.point.y += y;
//           }
//         }
//         return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
//       });
//     };
//   }
});
}
