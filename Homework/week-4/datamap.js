// AS Wittebrood
// 10288880
// Making an interactive map

// window.onload = function{ 
// 	mapLoad(); 
// }

// function mapLoad{

// }

// var map = new Datamap({ element: document.getElementById('container') });

var series;
var minValue;
var maxValue;
var dataset;

// d3.csv("data/d387006c-66ce-4f1e-834d-82087c2f7d85_Data.csv", function(data) {
// 	console.log(data[4]);
// });



d3.json("testJson.json" ,function(error, data) {
	if (error) throw error;

	data.forEach(function(d) {
	 d.usage = +d.usage;
	});
	// console.log(data);
	var onlyUsage = data.map(function(obj) { return obj.usage; });
	console.log(onlyUsage);
	var minValue = Math.min.apply(null, onlyUsage),
			maxValue = Math.max.apply(null, onlyUsage);
	console.log(minValue);
	console.log(maxValue);


	// TODO: get dataset.
	dataset = {};

	// create color palette function
	var paletteScale = d3.scale.linear()
	    .domain([minValue,maxValue])
	    .range(["#EFEFFF","#02386F"]); // blue color


	 // fill dataset in appropriate format
	data.forEach(function(item){ //
	    // item example value ["USA", 70]
	    var iso = item.countryCode,
	            value = item.usage;
	    dataset[iso] = { numberOfThings: value, fillColor: paletteScale(value) };
	});   

	rendermap();

});

     
function rendermap () {
	// render map
    new Datamap({
        element: document.getElementById('container'),
        projection: 'mercator', // big world map
        // countries don't listed in dataset will be painted with this color
        fills: { defaultFill: '#F5F5F5' },
        data: dataset,
        geographyConfig: {
            borderColor: '#DEDEDE',
            highlightBorderWidth: 2,
            // don't change color on mouse hover
            highlightFillColor: function(geo) {
                return geo['fillColor'] || '#F5F5F5';
            },
            // only change border
            highlightBorderColor: '#B7B7B7',
            // show desired information in tooltip
            popupTemplate: function(geo, data) {
                // don't show tooltip if country don't present in dataset
                if (!data) { return ; }
                // tooltip content
                return ['<div class="hoverinfo">',
                    '<strong>', geo.properties.name, '</strong>',
                    '<br>Count: <strong>', data.numberOfThings, '</strong>',
                    '</div>'].join('');
            }
        }
    });

}

window.addEventListener('resize', function(event){
        map.resize();
    });
// });

