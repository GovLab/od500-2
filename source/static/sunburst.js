$(document).ready(function(){
  var width = 600,
    height = 700,
    radius = Math.min(width, height) / 2;

var x = d3.scale.linear()
    .range([0, 2 * Math.PI]);

// var y = d3.scale.linear()
//     .range([0, radius]);
var y = d3.scale.sqrt()
      .range([0, radius]);
var color = d3.scale.category20c();

var svg = d3.select(".sunburst-chart").append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(" + width / 2 + "," + (height / 2 + 10) + ")");

var partition = d3.layout.partition()
    .value(function(d) { return 1; });

var arc = d3.svg.arc()
    .startAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x))); })
    .endAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x + d.dx))); })
    .innerRadius(function(d) { return Math.max(0, y(d.y)); })
    .outerRadius(function(d) { return Math.max(0, y(d.y + d.dy)); });

var tooltips = d3.select(".sunburst-chart")
  .append("div")
  .attr("class", "tooltips")


function format_description(d) {
  // console.log(d)
  var name = d;
      return  '<span class="section_name">' + name + '</span>';
}

d3.json("sunburst-no-data.json", function(error, root) {
  var g = svg.selectAll("g")
      .data(partition.nodes(root))
    .enter().append("g");

  var path = g.append("path")
    .attr("d", arc)
    .attr("class", function(d) { return "layer-" + d["depth"]} ) //Add depth to layers

    // .style("fill", function(d) { return color((d.children ? d : d.parent).name); })
    .on("click", click)
    .on("mouseover", function(d) {
      tooltips.html(function() {
        var name = format_description(d.name);
        return name;
      });
      return tooltips.transition()
       .duration(50)
       .style("opacity", 0.9);
      })
     .on("mousemove", function(d) {
       return tooltips
         .style("top", (d3.event.pageY-10)+"px")
         .style("left", (d3.event.pageX+10)+"px");
     })
     .on("mouseout", function(){return tooltips.style("opacity", 0);});
     
// REPLACE WITH ACTUAL LINKS
  function renderLink(d) {
    console.log(d.name + ".html")
    window.location = "list-page.html";
    return
  }
// END RENDERLINK

  var maxDepth = 3;

  function click(d) {
    if (d.depth == maxDepth) {
      renderLink(d)
    } else {
      var active_layer = d3.select(this).datum().depth;
      console.log(active_layer);
      d3.selectAll(".layer-" + active_layer)
     .classed("active-layer", true);
      d3.selectAll(".layer-" + (active_layer + 1))
     .classed("active-layer", true);
        // fade out all text elements
        // text.transition().attr("opacity", 0);
        path.transition()
          .duration(750)
          .attrTween("d", arcTween(d))
          .each("end", function(e, i) {
              // check if the animated element's data e lies within the visible angle span given in d
              if (e.x >= d.x && e.x < (d.x + d.dx)) {
                // get a selection of the associated text element
                var arcText = d3.select(this.parentNode).select("text");
                // fade in the text element and recalculate positions
                arcText.transition().duration(750)
                  .attr("opacity", 1)
                  .attr("transform", function() { return "rotate(" + computeTextRotation(e) + ")" })
                  .attr("x", function(d) { return y(d.y); });
              }
          });
      }
      
    }
});

d3.select(self.frameElement).style("height", height + "px");

// Interpolate the scales!
function arcTween(d) {
  var xd = d3.interpolate(x.domain(), [d.x, d.x + d.dx]),
      yd = d3.interpolate(y.domain(), [d.y, 1]),
      yr = d3.interpolate(y.range(), [d.y ? 20 : 0, radius]);
  return function(d, i) {
    return i
        ? function(t) { return arc(d); }
        : function(t) { x.domain(xd(t)); y.domain(yd(t)).range(yr(t)); return arc(d); };
  };
}

function computeTextRotation(d) {
  return (x(d.x + d.dx / 2) - Math.PI / 2) / Math.PI * 180;
}
})