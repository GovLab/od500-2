/* Based on the Social Innovation Simulation Tutorial Available at http://socialinnovationsimulation.com/2013/07/11/tutorial-making-maps-on-d3/ */

$(document).ready(function(){

  var w = 800;
  var h = 800;
  active = d3.select(null);
  var svg = d3.select("#map")
    .append("svg")
    .attr("width", w)
    .attr("height", h)
    
  var projection = d3.geo.azimuthalEqualArea()
    .rotate([100, -45])
    .center([5, 20])
    .scale(800)
    .translate([w/2, h/2]);
    
  var path = d3.geo.path()
    .projection(projection);

  var div = d3.select("body")
          .append("div")   
          .attr("class", "map-tooltip");               
           
  d3.json("https://raw.githubusercontent.com/mdgnkm/SIG-Map/master/canada.json", function(canada) {

    svg.selectAll("append")
      .data(canada.features)
      .enter()
      .append("path")
      .attr("d", path)
      .attr("class", "path")

    d3.csv("./companies.csv", function(data) {

        svg.selectAll("circle")
                .data(data)
                .enter()
                .append("circle")
                .attr("class", "circle")
                .attr("cx", function(d) {
                    return projection([d.LON, d.LAT])[0];
                })
                .attr("cy", function(d) {
                    return projection([d.LON, d.LAT])[1];
                })
                .attr("r", function(d) {
                    return Math.sqrt(d.PNUMBER)*15;
                })

                // I DON'T THINK THERE SHOULD BE TOOLTIPS. I THINK A BETTER IDEA WOULD BE TO HAVE A DIV UNDER THE MAP SAYING THE PROVINCE AND NUMBER OF COMPANIES.
                
                .on("mouseover", function(d) {      
                      div.transition()        
                        .duration(200)      
                        .style("opacity", 1)
                        .style("left", (d3.event.pageX + 30) + "px")     
                        .style("top", (d3.event.pageY - 30) + "px")         
                        if (d.PNUMBER==1) { 
                            div.html(d.PROVINCE + "<br>" + d.PNUMBER + " company")
                        }
                        else { 
                            div.html(d.PROVINCE + "<br>" + d.PNUMBER + " companies")
                        }
                      d3.select(this)
                        .transition()            
                        .delay(0)            
                        .duration(750)
                        .attr("r", function(d) {
                            return Math.sqrt(d.PNUMBER) * 20;
                        })
                    })
    
                .on("mouseout", function(d) {       
                    div.transition()        
                       .duration(500)      
                       .style("opacity", 0) 
                    d3.select(this)
                        .transition()
                        .duration(750)
                        .attr("r", function(d) {
                            return Math.sqrt(d.PNUMBER) * 15;
                        }) 
                })

                .on("click", clicked)

                svg.selectAll("text")
                 .data(data)
                 .enter()
                 .append("text")
                   .attr("x", function(d) {
                     return projection([d.LON, d.LAT])[0];
                   })
                   .attr("y", function(d) {
                     return projection([d.LON, d.LAT])[1];
                   })
                   .attr("dy", ".32em")
                   .attr("dx", function(d){
                      if (d.PNUMBER == 1) { return "-.2em" }
                      else if (d.PNUMBER < 4) { return "-.23em" }
                      else if (d.PNUMBER == 6) { return "-.3em" }
                      else { return "-.6em" }
                   })
                   .text(function(d) { return d.PNUMBER; })
                   .attr("class", "number")

                function clicked() {
                      if (active.node() === this) return reset();
                      active.classed("active", false);
                      active = d3.select(this).classed("active", true);
                }

                function reset() { 
                      active.classed("active", false);
                      active = d3.select(null);                
                }   

                // .on("mouseover", expand)
                // .on("mouseout", contract)

                // function expand(){
                //       d3.select(this)
                //           .transition()            
                //           .delay(0)            
                //           .duration(750)
                //           .attr("r", function(d) {
                //               return Math.sqrt(d.PNUMBER) * 15;
                //           })
                // }

                // function contract(){
                //       d3.select(this)
                //           .transition()
                //           .duration(750)
                //           .attr("r", function(d) {
                //               return Math.sqrt(d.PNUMBER) * 10;
                //           }) 
                // }             

    });


  });

});

