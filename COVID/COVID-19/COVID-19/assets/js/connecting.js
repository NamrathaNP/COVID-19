
if ($('#connecting_chart').length) {
var width = 1000;
    height = 700;
    radius = 5;
    var legendRectSize = 15;                                  // NEW
var legendSpacing = 4;  



var svg = d3.select("div#connecting_chart").append("svg:svg")
    .attr("width", width)
    .attr("height", height);

var force = d3.layout.force()
    .gravity(.07)
    .distance(30)
    .charge(-19)
    .size([width, height]);

d3.json("p2p.json", function(dataset) {
    console.log(dataset);
  json = dataset.map(function(d) {
                var dta = {
                    Source:d.source,
                   Target:d.patient,
                   State:d.state
                  };
                  return dta;
            });

  //array of nodes
  var nodes = [];
  //array of links
  var links = [];
  var coords ={};
var groups = [];
console.log(json);
var buckets =[];
json.forEach(function(d){
  console.log(d);
  // if (buckets.indexOf(d.Source[0]) <0){
    //sorce node not there so add
    buckets.push(d.Source[1])
  // }
  // if (buckets.indexOf(d.Target[0]) <0){
    //target node not there so add
    buckets.push(d.Target[1])
  // }
});
console.log(json);
  console.log(buckets);
  var buckets1 = [...new Set(buckets.map(d => d))];
      console.log(buckets1);

//   var newdata1= json.sort(function(a, b) {return d3.ascending(a.Source[1], b.Source[1]);});
// console.log(newdata1);
//     var buckets1 = [...new Set(newdata1.map(d => d.Source[1]))];
//     console.log(buckets1);
//     var newdata2= json.sort(function(a, b) {return d3.ascending(a.Target[1], b.Target[1]);});
//     console.log(newdata2);
//         var buckets2 = [...new Set(newdata2.map(d => d.Target[1]))];    
//     console.log(buckets2);
//     var buckets = buckets1.push(buckets2);
// console.log(buckets)

  var color = d3.scale.category10()
  .domain(buckets1);
//   console.log(color);
//   var color = d3.scale.category10();

  json.forEach(function(d){
    
    if (nodes.indexOf(d.Source[0]) <0){
      //sorce node not there so add
      nodes.push(d.Source[0])
    }
    if (nodes.indexOf(d.Target[0]) <0){
      //target node not there so add
      nodes.push(d.Target[0])
    }
  
    links.push({source:nodes.indexOf(d.Source[0]), target:nodes.indexOf(d.Target[0])})
  });

  nodes = nodes.map(function(n){
    data = json.map(function(d) {
        if(n == d.Source[0] ){
           n={ name: n,
            state : d.Source[1]
          }
        }
        if(n == d.Target[0]){
          n={ name: n,
           state : d.Target[1]
                 
          }
       }
        

    });

    return n
  })

console.log(nodes);
console.log(links);
//   var k = Math.sqrt(nodes.length / (width * height));

  force
      .nodes(nodes)
      .links(links)
    //   .linkDistance(function(d){
    //     if(d. == d.state)
    //       return 80;
    //     else 
    //       return 200;
    //   })
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
      
  // node.append("text")
  //     .attr("dx", 0.1)
  //     .attr("dy", ".001em")
  //     .text(function(d) { return d.name });



  // var newdata= nodes.sort(function(a, b) {return d3.ascending(a.Highlights, b.Highlights);});
  // console.log(newdata);
  //     var buckets = [...new Set(newdata.map(d => d.Highlights))]
  //     .map(Highlights=>{
  //       return{
  //         Highlights: Highlights,
  //         cluster:nodes.find(s=> s.Highlights === Highlights).cluster
  //       }
  //     });
  //     console.log(buckets);

  var legend = svg.selectAll('.legend')                     // NEW
  .data(buckets1)                                   // NEW
  .enter()                                                // NEW
  .append('g')                                            // NEW
  .attr('class', 'legend')                                // NEW
  .attr('transform', function(d, i) {                     // NEW
    var height = legendRectSize + legendSpacing;          // NEW
    var offset =  height * buckets1.length / 2;     // NEW
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
    
 
    node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
    // nodes.each(function(d) {
    //     if (groups.indexOf(d.state) == -1 ) {
    //         groups.push(d.state);
    //         coords[d.state] = [];
    //     }
    //     coords[d.state].push({x:d.x,y:d.y});    
    // })
    
    // // get the centroid of each group:
    // var centroids = {};
    
    // for (var group in coords) {
    //     var groupNodes = coords[group];
    //     var n = groupNodes.length;
    //     var cx = 0;
    //     var tx = 0;
    //     var cy = 0;
    //     var ty = 0;
    
    //     groupNodes.forEach(function(d) {
    //         tx += d.x;
    //         ty += d.y;
    //     })
    
    //     cx = tx/n;
    //     cy = ty/n;
    
    //     centroids[state] = {x: cx, y: cy}   
    // }
    // var minDistance = 10;
    
    // // modify the min distance as the force cools:
    // if (alpha < 0.1) {
    //     minDistance = 10 + (1000 * (0.1-alpha))
    // }
    
    // // adjust each point if needed towards group centroid:
    // node.each(function(d) {
    //     var cx = centroids[d.state].x;
    //     var cy = centroids[d.state].y;
    //     var x = d.x;
    //     var y = d.y;
    //     var dx = cx - x;
    //     var dy = cy - y;
    
    //     var r = Math.sqrt(dx*dx+dy*dy)
    
    //     if (r>minDistance) {
    //         d.x = x * 0.9 + cx * 0.1;
    //         d.y = y * 0.9 + cy * 0.1;
    //     }
    // })
    
  
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
});
// }



}