// AS Wittebrood
// 10288880
// Making an interactive map


var series;
var minValue;
var maxValue;
var dataset;
var map;
// loads javascript after html is ready
window.onload = function () {
	mapLoad();
}

// que json files
d3.queue(2)
    .defer(function(url, callback) {
		d3.json(url, function(error, file) {
			if (error) throw error;
			// draw map function
			mapLoad(file);
		})
	}, "https:raw.githubusercontent.com/alexwit/DataProcessing/master/Homework/week-6/data/hapiness2015.json")
    .await(if (error) throw error;);

// https://raw.githubusercontent.com/alexwit/DataProcessing/master/Homework/week-6/data/happiness2016.json
//https:raw.githubusercontent.com/alexwit/DataProcessing/master/Homework/week-6/data/hapiness2015.json
function mapLoad(file) {

	
	postLoad();
	// setting the value to percentage
	// var formatValue = d3.format(",.2%");

	// getting the data from a json file
	d3.json(file ,function(error, data) {
		if (error) throw error;

		// making numbers of the string function
		data.forEach(function(d) {
		 d.hapinessScore = +d.hapinessScore;
		});

		// getting the min and max value
		var onlyUsage = data.map(function(obj) { return obj.hapinessScore; });
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
		            value = item.hapinessScore;
		    dataset[iso] = { numberOfThings: value, fillColor: paletteScale(value) };
		});   

		rendermap();
		postLoad();
		renderScatterplot(data)
		

	});

	// Ik kan geen reden vinden waarom deze niet zou werken? 
	function postLoad(){

		/// krijg svg niet te pakken? 
		var svg = d3.select(".datamap"); // datamap, getElementId/ Class geprobeerd? 


		// adds title and gradient scale
		var margin = {top: 100, right: 30, bottom: 30, left: 100},
		width = 800 - margin.left - margin.right,
	    height = 500 - margin.top - margin.bottom;

		svg.append("text")
			.attr("x", (width / 2))
			.attr("y", 0 - (margin.top / 2))
			.attr("text-anchor", "middle")
			.style("font-size", "15px")
			.style("text-decoration", "underline")
			.text("Cantril ladder");

		var defs = svg.append("defs");

		//Append a linear Gradient element to the SVG
		var linearGradient = defs.append("linearGradient")
			.attr("id", "linear-gradient");

		linearGradient
			.attr("x1", "0%")
			.attr("x2", "100%")

		linearGradient.append("stop")
			.attr("offset", "0%")
			.attr("stop-color", "##62808d") // brown

		linearGradient.append("stop")
			.attr("offset", "100%")
			.attr("stop-color", "#FFF550") // yellow

		svg.append("rect")
			.attr("width", 150)
			.attr("height", 15)
			.style("fill", "url(#linear-gradient)");


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

	function renderScatterplot (data) {

	      // VERSION 2.0

	      // http://bl.ocks.org/peterssonjonas/4a0e7cb8d23231243e0e

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
		    yCat = "hapinessScore"
		    rCat = "Economy",
		    colorCat = "Region",
		    cCat = "Country";

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

		

      // ZOOM is uit
  // var zoomBeh = d3.behavior.zoom()
  //     .x(x)
  //     .y(y)
  //     .scaleExtent([0, 500])
  //     .on("zoom", zoom);

	  var svg = d3.select("#scatterplot")
		    .append("svg")
		      	.attr("width", outerWidth)
		      	.attr("height", outerHeight)
		    .append("g")
		      	.attr("transform", "translate(" + margin.left + "," + margin.top + ")")
		      // .call(zoomBeh);

		svg.call(tip);

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
		      	.attr("y", -margin.left)
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



		// Nog niet mogelijk om vorig ingekleurde land terug te veranderen
		function onClick(selected){
			
			if (clickedCol) {
				// select vorige land fill = clickedCol

			} 

			// clickedCol = d3.rgb(selected.attr("style"));
			// console.log(clickedCol);
			// sla nieuwe land + kleur op
			clickedCountry = selected;
			console.log(clickedCountry);
			// clickedCol = 
			// console.log(fillColor);
			var m = {};
			// console.log(d3.rgb(m[selected.countryCode].attr("style")));
			m[selected.countryCode] = '#FF0000';
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
		  		


		      // tip.show
		      //tip.hide
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

		// d3.select("input").on("click", change);


	  	function transform(d) {
	    	return "translate(" + x(d[xCat]) + "," + y(d[yCat]) + ")";
	  	}	

	
		  // function change() {
		  //   xCat = "Carbs";
		  //   xMax = d3.max(data, function(d) { return d[xCat]; });
		  //   xMin = d3.min(data, function(d) { return d[xCat]; });

		  //   zoomBeh.x(x.domain([xMin, xMax])).y(y.domain([yMin, yMax]));

		  //   var svg = d3.select("#scatterplot").transition();

		  //   svg.select(".x.axis").duration(750).call(xAxis).select(".label").text(xCat);

		  //   objects.selectAll(".dot").transition().duration(1000).attr("transform", transform);
		  // }

	 



	  
	}

	

}