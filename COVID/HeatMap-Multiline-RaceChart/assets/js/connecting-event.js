if ($('#event_chart').length) {
var width = 960;
    height = 900;
    radius = 5;
    var legendRectSize = 15;                                  // NEW
var legendSpacing = 4;  
var border=1;
var bordercolor='black'; 


var svg = d3.select("div#event_chart").append("svg:svg")
    .attr("width", width)
    .attr("height", height);




var force = d3.layout.force()
    .gravity(.25)
    .distance(25)
    .charge(-20)
    .size([width, height]);


d3.json("E2p.json", function(data) {
  var dataset= data;
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
  // var color = d3.scale
  // .domain(datacolor);
  var color = d3.scale.ordinal() // D3 Version 4
  .domain(["Diseased", "Hospitalized", "Recovered","Infected", ""])
  .range(["#FF0000", "#FFA500" , "#008000", "#0000FF", "#808080"]);
  // console.log(color);
  // var color = d3.scale.category10();
  var events = [...new Set(json.map(d => d.Source))];
  console.log(events);
  

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
      // .size([nodes.length, nodes.length])
      // .charge(-7 / k)
      // .gravity(100 * k)
      .start(); 

      var zoom = d3.behavior.zoom()
      .scaleExtent([0.1, 1.5])
      .on("zoom", zoomed);
      
      function zoomed() {
       
          
          var scale = d3.event.scale,
            translation = d3.event.translate,
            tbound = -height * scale,
            bbound = height * scale,
            lbound = (-width) * scale,
            rbound = (width) * scale;
          // limit translation to thresholds
          translation = [
            Math.max(Math.min(translation[0], rbound), lbound),
            Math.max(Math.min(translation[1], bbound), tbound)
          ];
          svg.attr("transform", "translate(" + translation + ")scale(" + scale + ")")
          .attr("width", width)
            .attr("height", height);
            // nodes.forEach(function(node) {
            //   node.r = 1 * Math.pow(d3.event.transform.k,0.3);
            //   node.collided = false;
            //   node.x = node.x1;
            //   node.y = node.y1;
            //  })
      // force
      //   .gravity(.07)
      //   .distance(35)
      //   .charge(-20)
      force.tick();
            // svg.transition()
            // .duration(750)
            // .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + scale + ")translate(" + -d.x + "," + -d.y + ")");   
        // node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
      }

  svg.attr({
    "width": width,
    "height": height 
  })
  .attr({
    "width": "100%",
    "height": "100%"
  })
  .attr("viewBox", "0 0 " + width + " " + height )
  .attr("preserveAspectRatio", "xMidYMid meet")
  .attr("pointer-events", "all");

// .call(zoom);

    
  var borderPath = svg.append("rect")
  .attr("x", 0)
  .attr("y", 0)
  .attr("height", height)
  .attr("width", width)
  .style("stroke", bordercolor)
  .style("fill", "none")
  .style("stroke-width", border);

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
      .text(function(d) {
        return (d.name in events) ?d.name:''
        });


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
  // svg.append("text")      // text label for the x axis
  // .attr("x",width/4 )
  // .attr("y", 0 )
  // .style("text-anchor", "middle")
  // .text("E2P Transmission Network");
    

  force.on("tick", function() {
    link.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });
    // node.attr("cx", function(d) { return d.x = Math.max(radius, Math.min(width - radius, d.x)); })
    // .attr("cy", function(d) { return d.y = Math.max(radius, Math.min(height - radius, d.y)); });    

    node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
    // .call(zoom);
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
