$(document).ready(function(){
  var width = 700,
    height = 700,
    radius = Math.min(width, height) / 2;

  var x = d3.scale.linear()
      .range([0, 2 * Math.PI]);

  var y = d3.scale.sqrt()
        .range([0, radius]);

  var svg = d3.select(".sunburst-chart").append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", "translate(" + width / 2 + "," + (height / 2) + ")rotate(-45)");

  var partition = d3.layout.partition()
      .value(function(d) { return 1; });

  var arc = d3.svg.arc()
      .startAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x))); })
      .endAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x + d.dx))); })
      .innerRadius(function(d) { return Math.max(0, y(d.y)); })
      .outerRadius(function(d) { return Math.max(0, y(d.y + d.dy)); });

  var tooltips = d3.select(".sunburst-panel")
    .append("div")
    .attr("class", "tooltips")

  var trail = d3.select(".sunburst-trail")

  function format_description(d) {
    var html = '<div class="center-info">'
    if (d.usedBy_count) {
      html += '<div class="tooltip-used-by">'+ d.usedBy_count + '</div>'
    }
    if (d.sourceCount) {
      html+= '<div class="tooltip-source-count">' + d.sourceCount + '</div>'
    }
    if (d.total_agencies) {
      html += '<div class="tooltip-total-agencies">' + d.total_agencies + '</div>'
    }
    if (d.total_companies) {
      html += '<div class="tooltip-total-companies">' + d.total_companies + '</div>'
    }

    html += '</div><div class="side-info">'


    html += '<div class="tooltip-title">' + d.name  + '</div>'
    
    if (d.companyCategory) {
      html += '<div class="tooltip-company-category">' + d.companyCategory + '</div><p class="tooltip__more-info">'
    }

    if (d.companyType) {
      html += '<span class="tooltip-company-type">' + d.companyType + '</span>'
    }

    if (d.city && d.state) {
      html += '<span class="tooltip-location">'+ d.city + ', '+ d.state + '</span>'
    }

    html += '</p>'

    
    
    // if (d.fte) {
    //   html += '<div class="tooltip-fte">' + d.fte + '</div>'
    // }
    // if (d.businessModel && (d.businessModel.length !== 0)) {
    //   html += '<div class="tooltip-business-model">' + d.businessModel.join(", ") + '</div>'
    // }
    if (d.subagencies && (d.subagencies.length !== 0 )) {
      html += '<div class="tooltip-subagencies"><span>' + d.subagencies.join("</span><span>") + '</span></div>'
    }

    
    html += '</div></div>'
    return  html;
  }

d3.json("sunburst-no-data-new.json", function(error, root) {
  var g = svg.selectAll("g")
      .data(partition.nodes(root))
    .enter().append("g");

  var path = g.append("path")
    .attr("d", arc)
    .attr("class", function(d) { return "layer-" + d.depth } )
    .on("click", click)
    .on("mouseover", function(d) {
      highlightSequence(d)
      tooltips.html(function() {
        var name = format_description(d);
        return name;
      });
    return tooltips.transition()
     .duration(50);
    })
    .on("mousemove", function(d) {
    })
    .on("mouseout", function(){
    });

  d3.selectAll("path").on("mouseleave", function() {
    clearAncestorsPath()
    tooltips.html("")
    trail.html("")
  });

  function highlightSequence(d) {
    var sequenceArray = getAncestors(d)
    updateBreadcrumbs(sequenceArray);
    trail.html(formatTrail(sequenceArray));
    d3.selectAll("path")
      .filter(function(node) {
        return (sequenceArray.indexOf(node) >= 0);
      })
      .classed("ancestor", true)
      d3.selectAll(".ancestor").each(function(a,i) {
        d3.select(this).classed("ancestor-" + (i - zoomLevel),"true");
      });
  }


  function renderLink(d) {
    window.location = "list-page.html";
    return
  }

  $('.layer-0').on("click", function() {
      zoom = false;
  })
 
  function clearAncestorsPath() {
    d3.selectAll(".ancestor")
      .classed("ancestor",false)
      .classed("ancestor-0",false)
      .classed("ancestor-1",false)
      .classed("ancestor-2",false)
  }

  var maxDepth = 3;
  var previous = '';
  var zoom = false;
  var zoomLevel = 0;

  function click(d) {
    zoom = true
    zoomLevel = d.depth
    if (d3.select(this).classed("current_root")) {
      zoomLevel -= 1
      var parent = d3.select(d.parent)
      path.transition()
        .duration(750)
        .attrTween("d", arcTween(parent.node()))
      d3.select(this).classed("current_root",false)
    } else {
      d3.selectAll(".current_root").classed("current_root",false)
      d3.select(this).classed("current_root",true)
      var sequence = getAncestors(d)
      d3.selectAll("path")
        .filter(function(node){
          return sequence.indexOf(node) == 0;
        })
        .classed("current_root",true)
      if (d.depth == maxDepth) {
        renderLink(d)
      } else if (previous = d){
        path.transition()
          .duration(750)
          .attrTween("d", arcTween(d))
        previous = d;
      } else if ((getAncestors(previous).indexOf(d) >=  0)) {
        d3.selectAll("path")
          .filter(function(node){
            return sequence.indexOf(node) == 0;
          })
          .classed("current_root",true)
        d3.select(this).classed("current_root",false)
        var parent = d3.select(d.parent)
        path.transition()
          .duration(750)
          .attrTween("d", arcTween(parent.node()))
        previous = ''
        } 
      }
    }
});


  d3.select(self.frameElement).style("height", height + "px");

  function getAncestors(node) {
    var path = [];
    var current = node;
    while (current.parent) {
      path.unshift(current);
      current = current.parent;
      }
    return path;
  }

  function updateBreadcrumbs(nodeArray) {
    d3.selectAll("#ancestor").attr("id","")
  }

  function formatTrail(array) {
    var html = ""
    array.forEach(function(item){
      html += '<span class="trail-item">' + item.name  + '</span>'
    })
    return html;
  }

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
})