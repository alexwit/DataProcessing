// AS Wittebrood
// 10288880
// Making an interactive map

var series;
var minValue;
var maxValue;
var dataset;

// loads javascript after html is ready
window.onload = function () {
	mapLoad();
	
}

function mapLoad() {

	
	postLoad();
	// setting the value to percentage
	var formatValue = d3.format(",.2%");

	// getting the data from a json file
	d3.json("testJson.json" ,function(error, data) {
		if (error) throw error;

		// making numbers of the string function
		data.forEach(function(d) {
		 d.usage = +d.usage;
		});

		// getting the min and max value
		var onlyUsage = data.map(function(obj) { return obj.usage; });
		var minValue = Math.min.apply(null, onlyUsage),
				maxValue = Math.max.apply(null, onlyUsage);
		
		// dataset containing info for filling the countries 
		dataset = {};	

		// create color palette function
		var paletteScale = d3.scale.linear()
		    .domain([minValue,maxValue])
		    .range(["#AF5500","#FFF550"]); // yellow - brown
		 // fill dataset in appropriate format
		data.forEach(function(item){ //
		    // item example value ["USA", 70]
		    var iso = item.countryCode,
		            value = item.usage;
		    dataset[iso] = { numberOfThings: value, fillColor: paletteScale(value) };
		});   

		rendermap();
		postLoad();

		

	});

	// Ik kan geen reden vinden waarom deze niet zou werken? 
	function postLoad(){

		/// krijg svg niet te pakken? 
		var svg = d3.select("datamap"); // datamap, getElementId/ Class geprobeerd? 
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
			.text("Acces to  electricity per country");

		var defs = svg.append("defs");

		//Append a linear Gradient element to the SVG
		var linearGradient = defs.append("linearGradient")
			.attr("id", "inear-gradient");

		linearGradient
			.attr("x1", "0%")
			.attr("x2", "100%")

		linearGradient.append("stop")
			.attr("offset", "0%")
			.attr("stop-color", "#AF5500") // brown

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
	    new Datamap({
	        element: document.getElementById('container'),
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
	                    '<br> Acces to electricity: <strong> No data </strong>',
	                    '</div>'].join(''); } 
	                // tooltip content of country
	                return ['<div class="hoverinfo">',
	                    '<strong>', geo.properties.name, '</strong>',
	                    '<br> Acces to electricity: <strong>', formatValue(data.numberOfThings / 100), '</strong>',
	                    '</div>'].join('');
	            }
	        }

	    });


		

	}

}