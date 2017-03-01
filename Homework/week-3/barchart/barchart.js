	// Alex Wittebrood 
	// 10288880
	// https://bost.ocks.org/mike/bar/3/
	// chart maker 

window.onload = function () {
	functie();
	makePieChart();
}

function functie() {
	var data;

	// TODO: Waarom als height groter dan 400 is valt 1960 weg?
	var margin = {top: 40, right: 30, bottom: 30, left: 100},
		width = 420 - margin.left - margin.right,
	    height = 500 - margin.top - margin.bottom;

	var x = d3.scale.ordinal()
	    .rangeRoundBands([0, width], .1);

	var y = d3.scale.linear()
		.range([height, 0]);

	var xAxis = d3.svg.axis()
		.scale(x)
		.orient("bottom");	

	var yAxis = d3.svg.axis()
		.scale(y)
		.orient("left")
		.ticks(10, "s");

	var formatValue = d3.format(".2s");

	var tip = d3.tip()
		.attr("class", 'd3-tip')
		.offset([-10,0])
		.html(function(d){
			return "Growthratio: <span style='color:red'>" + d.groeipercentage + "</span><br> Population: <span style='color:red'>"+ d.populatie + "</span>";
		})

	var chart = d3.select(".chart")
	    .attr("width", width + margin.left + margin.right)
	    .attr("height", height + margin.top + margin.bottom)
	   .append("g")
	   	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	d3.json("testJson.json" ,function(error, data) {

		x.domain(data.map(function(d) { return d.jaartal; }));
		y.domain([0, d3.max(data, function(d) { return d.populatie; })]);

		chart.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + height + ")")
			.call(xAxis)

		// create title
		chart.append("text")
			.attr("class", "title")
		 	.attr("x", width / 2)
		 	.attr("y", 0 - (margin.top / 2))
		 	.text("50 years of population growth of the Netherlands")

		// x - axis label
		chart.append("text")
			.attr("x", width / 2)
			.attr("y", height + margin.bottom)
			.style("text-anchor", "middle")
			.text("Years")

		// create y axis label 
		chart.append("g")
			.attr("class", "y axis")
			.call(yAxis)
		  .append("text")
			.attr("transform", "rotate(-90)")
			.attr("y", 6)
			.attr("dy", ".71em")
			.style("text-anchor", "end")
			.text("populatie in millions");


	chart.call(tip);

		chart.selectAll(".bar")
			.data(data)
		  .enter().append("rect")
		  	.attr("class", "bar")
		  	.attr("x", function(d) { return x(d.jaartal); })
		  	.attr("y", function(d) { return y(d.populatie); })
		  	.attr("height", function(d) { return height - y(d.populatie); })
		  	.attr("width", x.rangeBand())
		  	.on('mouseover', tip.show)
	  		.on('mouseout', tip.hide);
		
	});
}
		






