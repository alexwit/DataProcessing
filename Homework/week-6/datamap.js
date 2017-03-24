// AS Wittebrood
// 10288880
// Making an interactive map

var series;
var minValue;
var maxValue;
var dataset;
var map;
var datasrc1;
var datasrc2;
// sets default year
var year = "2016"; 

// waits till page is loaded before getting and plotting the data
window.onload = function () {
	queuer();

	// resets map and scatter plot for the chosen year
	$(".dropdown-menu li a").click(function(){
		year = $(this).attr("data-id")
		dropdown(year);	  	
	});
}


function queuer() {
	// queue json files
	d3.queue(2)
	    .defer(function(url, callback) {
			d3.json(url, function(error, data) {
					
					if (error) throw error;
					// saves dataset local
					datasrc1 = data;
					// draw map function
					mapLoad(data);
				})
			}, "https://raw.githubusercontent.com/alexwit/DataProcessing/master/Homework/week-6/data/happiness2016.json")
	    .defer(function(url,callback) {
	    	d3.json(url, function(error, data) {
	    		if(error) throw error;
	    		// saves data set local
	    		datasrc2 = data;
	    	})
	    }, "https://raw.githubusercontent.com/alexwit/DataProcessing/master/Homework/week-6/data/hapiness2015.json")
	    .await(errorCheck);

	function errorCheck(error){
		if (error) throw error; 
	}
}


// removes the old data and plots new map and scatterplot for given year
function dropdown(year) {
	// 
	if (year == "2016"){ 
		d3.select(".datamap").remove();
		d3.select(".datamaps-hover").remove();
		d3.select(".scatter").remove();
		mapLoad(datasrc1);
	} else if(year == "2015"){
		d3.select(".datamap").remove();
		d3.select(".datamaps-hover").remove();
		d3.select(".scatter").remove();
		mapLoad(datasrc2);
	}
}

function rendermap () {
		// render map
		map = new Datamap({
	        element: document.getElementById('map'),
	        projection: 'mercator', // big world map
	        // countries don't listed in dataset will be painted with this color
	        fills: { defaultFill: '#F5F5F5' },
	        data: dataset,
	        geographyConfig: {
	            borderColor: '#42280F', // brown
	            highlightBorderWidth: 2,
	            // don't change color on mouse hover
	            highlightFillColor: function(geo) {
	                return geo['fillColor'] || '#F5F5F5'; 
	            },
	            // only change border
	            highlightBorderColor: '#820202', // Red boarder
	            // show desired information in tooltip
	            popupTemplate: function(geo, data) {
	                // show's tooltip with country name an no data info
	                if (!data || data.value == 0) { return ['<div class="hoverinfo">',
	                    '<strong>', geo.properties.name, '</strong>',
	                    '<br> Hapiness Cantril: <strong> No data </strong>',
	                    '</div>'].join(''); } 

	                // tooltip content of country
	                return ['<div class="hoverinfo">',
	                    '<strong>', geo.properties.name, '</strong>',
	                    '<br> Cantril ladder (0-10): <strong>', data.numberOfThings, '</strong>',
	                    '</div>'].join('');
	            }
	        }

	    });
}



// draws the map
function mapLoad(data) {

	// getting the min and max value
	var onlyUsage = data.map(function(obj) { return obj.happinessScore; });
	var minValue = Math.min.apply(null, onlyUsage),
			maxValue = Math.max.apply(null, onlyUsage);
	
	// dataset containing info for filling the countries 
	dataset = {};	

	// create color palette function
	var paletteScale = d3.scale.linear()
	    .domain([minValue,maxValue])
	    .range(["#62808d","#FFF550"]); // light grey - yellow
	 // fill dataset in appropriate format
	data.forEach(function(item){ //
	    // item example value ["USA", 70]
	    var iso = item.countryCode,
	            value = item.happinessScore;
	    dataset[iso] = { numberOfThings: value, fillColor: paletteScale(value) };
	});   

	rendermap();
	renderScatterplot(data)

	
	var svg = d3.select(".datamap");  
	// adds title and gradient scale
	var margin = {top: 60, right: -30, bottom: 30, left: -30},
	width = 800 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

    // sets Title for the Map
	svg.append("text")
		.attr("x", (width / 2))
		.attr("y", (margin.top / 2))
		.attr("text-anchor", "middle")
		.style("font-size", "15px")
		.style("text-decoration", "underline")
		.text("Happiness per country in: " + year);

	var defs = svg.append("defs");

	//Append a linear Gradient element to the SVG
	var linearGradient = defs.append("linearGradient")
		.attr("id", "linear-gradient");

	linearGradient
		.attr("y1", "0%")
		.attr("y2","0%")
		.attr("x1", "0%")
		.attr("x2", "100%");

	linearGradient.append("stop")
		.attr("offset", "0%")
		.attr("stop-color", "#62808d") // brown

	linearGradient.append("stop")
		.attr("offset", "100%")
		.attr("stop-color", "#FFF550") // yellow

	svg.append("text")
		.attr("x", width * 0.15)
		.attr("y", height * 1.17)
		.text("0")

	// title and numbers to the gradient bar
	svg.append("text")
		.attr("x", width * 0.33)
		.attr("y", height * 1.17)
		.text("Cantril ladder (happiness Index)")

	svg.append("text")
		.attr("x", width * 0.73)
		.attr("y", height * 1.17)
		.text("10")

	svg.append("rect")
		.attr("x", width * 0.15)
		.attr("y", height * 1.19)
		.attr("class", "gradient-rect")
		.attr("width", width * 0.6)
		.attr("height", height * 0.05)
		.style("fill", "url(#linear-gradient)");
}


function renderScatterplot (data) {

		var margin = { top: 50, right: 300, bottom: 50, left: 50 },
	    outerWidth = 1050,
	    outerHeight = 500,
	    width = outerWidth - margin.left - margin.right,
	    height = outerHeight - margin.top - margin.bottom;


		var x = d3.scale.linear()
		    .range([0, width]).nice();

		var y = d3.scale.linear()
		    .range([height, 0]).nice();


		// clarify region 
		var xCat = "trust",
		    yCat = "happinessScore"
		    rCat = "Economy",
		    colorCat = "Region",
		    cCat = "Country";

		// sets the domain
		var xMax = d3.max(data, function(d) { return d[xCat]; }) * 1.05,
	      	xMin = d3.min(data, function(d) { return d[xCat]; }),
	      	xMin = xMin > 0 ? 0 : xMin,
	      	yMax = d3.max(data, function(d) { return d[yCat]; }) * 1.05,
	      	yMin = d3.min(data, function(d) { return d[yCat]; }),
	      	yMin = yMin > 0 ? 0 : yMin;

	  	x.domain([xMin, xMax]);
		y.domain([yMin, yMax]);

	  	var xAxis = d3.svg.axis()
      		.scale(x)
	      	.orient("bottom")
	    	.tickSize(-height);

	  	var yAxis = d3.svg.axis()
	      	.scale(y)
	      	.orient("left")
	      	.tickSize(-width);

	  	var color = d3.scale.category10();

		var tip = d3.tip()
		    .attr("class", "tip")
		    .offset([-10, 0])
		    .html(function(d) {
		       return cCat + ": " + d[cCat] + "<br>" + xCat + ": " + d[xCat] + "<br>" + yCat + ": " + d[yCat];
		    });

	  	var svg = d3.select("#scatterplot")
		    .append("svg")
		    	.attr("class", "scatter")
		      	.attr("width", outerWidth)
		      	.attr("height", outerHeight)
		    .append("g")
		      	.attr("transform", "translate(" + margin.left + "," + margin.top + ")")
		  
		svg.call(tip);

		svg.append("text")
			.attr("class","scatter-title")
			.attr("x", width *0.15)
			.attr("y", height *-0.01)
			.text("Distribution of Hapiness score per country relative to the trust in the Government in: " + year)

		svg.append("rect")
		    .attr("width", width)
		    .attr("height", height);

		svg.append("g")
		    .classed("x axis", true)
		    .attr("transform", "translate(0," + height + ")")
		    .call(xAxis)
		    .append("text")
		      	.classed("label", true)
		      	.attr("x", width)
		      	.attr("y", margin.bottom - 10)
		      	.style("text-anchor", "end")
		      	.text(xCat);

	  	svg.append("g")
		    .classed("y axis", true)
		    .call(yAxis)
		    .append("text")
		      	.classed("label", true)
		      	.attr("transform", "rotate(-90)")
		      	.attr("y", -margin.left + 5)
		      	.attr("dy", ".71em")
		      	.style("text-anchor", "end")
		      	.text(yCat);
		     // TODO: CHange to good title

		var objects = svg.append("svg")
		    .classed("objects", true)
		    .attr("width", width)
		    .attr("height", height);

		objects.append("svg:line")
		    .classed("axisLine hAxisLine", true)
		    .attr("x1", 0)
		    .attr("y1", 0)
		    .attr("x2", width)
		    .attr("y2", 0)
		    .attr("transform", "translate(0," + height + ")");

		objects.append("svg:line")
		    .classed("axisLine vAxisLine", true)
		    .attr("x1", 0)
		    .attr("y1", 0)
		    .attr("x2", 0)
		    .attr("y2", height);

		var clickedCol;
		var clickedCountry;

		// Highlights clicked country from the scatterplot in the world map 
		function onClick(selected){
			var m = {};
			if (clickedCol) {
				// sets color back to previous color in the list
				m[clickedCountry.countryCode] = clickedCol;
			} 
			// saves new clicked country and color
			clickedCountry = selected;
			clickedCol = dataset[clickedCountry.countryCode].fillColor;
			m[selected.countryCode] = '#FF0000'; // Highlight RED 
			map.updateChoropleth(m);
		}   

		objects.selectAll(".dot")
		    .data(data)
		    .enter().append("circle")
		      	.classed("dot", true)
		      	.attr("r", function (d) { return 10 * Math.sqrt(d[rCat] / Math.PI); })
		      	.attr("transform", transform)
		      	.style("fill", function(d) { return color(d[colorCat]); })
		      	.on("click", function(d) { onClick(d);  })
		      	.on("mouseover", tip.show )
		  		.on("mouseout", tip.hide );
		  		
	  	var legend = svg.selectAll(".legend")
		    .data(color.domain())
		    .enter().append("g")
		      	.classed("legend", true)
		      	.attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

		legend.append("circle")
		    .attr("r", 3.5)
		      .attr("cx", width + 20)
		      .attr("fill", color);

		legend.append("text")
		    .attr("x", width + 26)
		    .attr("dy", ".35em")
		    .text(function(d) { return d; });


	  	function transform(d) {
	    	return "translate(" + x(d[xCat]) + "," + y(d[yCat]) + ")";
	  	}	
	  
	}