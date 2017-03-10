// 10288880
// AS Wittebrood

var svg = d3.select("svg"),
    margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = svg.attr("width") - margin.left - margin.right,
    height = svg.attr("height") - margin.top - margin.bottom,
    g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var parsedTime = d3.timeParse("%Y%m%d");
	

// sets range for width and height and gives dynamic color choosing
var x = d3.scaleTime().range([0, width]),
    y = d3.scaleLinear().range([height, 0]),
    z = d3.scaleOrdinal(d3.schemeCategory10);

// draws a line 
var line = d3.line()
    .curve(d3.curveBasis)
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.temperature); });
 

// initial graph 
d3.json("2015knmidata.json", function(error, d){
  if (error) throw error;
  makeGraph(d);
});



// handle on click event
var dropdown = d3.select("#json_sources")
  .on('click', function (){ 
    source = dropdown.node().options[dropdown.node().selectedIndex].value;

    // HET LUKT NIET OM de oude grafiek weg te halen en een nieuwe te tekenen!
    d3.json(source, function(error, d){ 
    // d3.select("svg")
    //   .select("g").remove
    makeGraph(d);
    //   
    });
  });


function makeGraph(d){
  // parses all data 
  d.forEach(function(element) {
      dataparser(element);
  });
  // creates columns for data
  d.columns = ["date","TG","TN","TX"];

// map() to map / loop over the data, slices first columns
  var temperatures = d.columns.slice(1).map(function(id) {
      return {
          id: id,
          values: d.map(function(d) {
            return {date: d.date, temperature: d[id]};
          })
      };
  });

  //  x-axis 
  x.domain(d3.extent(d, function(d) { return d.date; })); 

// gives min and max values for size of y-axis
  y.domain([
      d3.min(temperatures,function(c){ return d3.min(c.values, function(d) { return d.temperature; }); }),
      d3.max(temperatures,function(c){ return d3.max(c.values, function(d) { return d.temperature; }); })
  ]);

  // color ID
  z.domain(temperatures.map(function(c) { return c.id; }));



  // creates X-axis 
  g.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x))
  .select(".domain")
      .remove();

// fills y-axis
  g.append("g")
      .call(d3.axisLeft(y))
      .append("text")
      .attr("fill", "#000")
      .attr("transform", "rotate(-90)")
      .attr("y", 0)
      .attr("dy", "0.71em")
      .attr("text-anchor", "end")
      .text("Temperature");


  /// fills data
  var temperature = g.selectAll(".temperature")
      .data(temperatures)
      .enter().append("g")
          .attr("class", "temperature");

  temperature.append("path")
      .attr("class", "line")
      .attr("d", function(d) { return line(d.values); })
      .attr("stroke-width", 1.5)
      .style("stroke", function(d) { return z(d.id);  })
      .style("fill","none");

  temperature.append("text")
    .datum(function(d) { return {id: d.id, value: d.values[d.values.length - 1]}; })
    .attr("transform", function(d) { return "translate(" + x(d.value.date) + "," + y(d.value.temperature) + ")"; })
    .attr("x", 3)
    .attr("dy", "0.35em")
    .style("font", "10px sans-serif")
    .text(function(d) { return d.id; });

  // interactive mouse
  var mouseG = svg.append("g")
    .attr("class", "mouse-over-effects")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  mouseG.append("path") // this is the black vertical line to follow mouse
    .attr("class", "mouse-line")
    .style("stroke", "black")
    .style("stroke-width", "1px")
    .style("opacity", "0");
     
  var lines = document.getElementsByClassName('line');

  var mousePerLine = mouseG.selectAll('.mouse-per-line')
    .data(temperatures)
    .enter()
    .append("g")
    .attr("class", "mouse-per-line");

  mousePerLine.append("circle")
    .attr("r", 7)
    .style("stroke", function(d) {
      return z(d.id);
    })
    .style("fill", "none")
    .style("stroke-width", "1px")
    .style("opacity", "0");

  mousePerLine.append("text")
    .attr("transform", "translate(10,3)");

  mouseG.append('svg:rect') // append a rect to catch mouse movements on canvas
    .attr('width', width) // can't catch mouse events on a g element
    .attr('height', height)
    .attr('fill', 'none')
    .attr('pointer-events', 'all')
    .on('mouseout', function() { // on mouse out hide line, circles and text
      d3.select(".mouse-line")
        .style("opacity", "0");
      d3.selectAll(".mouse-per-line circle")
        .style("opacity", "0");
      d3.selectAll(".mouse-per-line text")
        .style("opacity", "0");
    })
  .on('mouseover', function() { // on mouse in show line, circles and text
      d3.select(".mouse-line")
        .style("opacity", "1");
      d3.selectAll(".mouse-per-line circle")
        .style("opacity", "1");
      d3.selectAll(".mouse-per-line text")
        .style("opacity", "1");
    })
  .on('mousemove', function() { // mouse moving over canvas
      var mouse = d3.mouse(this);
      d3.select(".mouse-line")
        .attr("d", function() {
          var d = "M" + mouse[0] + "," + height;
          d += " " + mouse[0] + "," + 0;
          return d;
        });

      d3.selectAll(".mouse-per-line")
          .attr("transform", function(d, i) {
          // console.log(width/mouse[0])
          var xDate = x.invert(mouse[0]),
              bisect = d3.bisector(function(d) { return d.date; }).right;
              idx = bisect(d.values, xDate);
           
          var beginning = 0,
              end = lines[i].getTotalLength(),
              target = null;

          while (true){
            target = Math.floor((beginning + end) / 2);
            pos = lines[i].getPointAtLength(target);
            if ((target === end || target === beginning) && pos.x !== mouse[0]) {
                break;
            }
            if (pos.x > mouse[0])      end = target;
            else if (pos.x < mouse[0]) beginning = target;
            else break; //position found
          }
           
          d3.select(this).select('text')
            .text(y.invert(pos.y).toFixed(2));
             
          return "translate(" + mouse[0] + "," + pos.y +")";
      });  

  }); 
}

// string to number 
function dataparser(d) {
	d.date = parsedTime(d.date);
	d.TG = +d.TG / 10;
	d.TN = +d.TN / 10;
	d.TX = +d.TX / 10;
	return d;
}