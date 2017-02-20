// Alex Wittebrood
// 10288880

// global files 
var file  =  "temperature.txt"
var days = 365
var domainBoarders = new Array()
var rangeBoarders
var temperatureArray = new Array()
var dateArray = new Array()
var ctx;
var xScale;
var yScale;
var margin;
var canvas;


// loads text file and call handler
function readTextFile(myfile, callback){
	var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200)
            {
                var allText = rawFile.responseText;
                callback(allText);

            }
        }
    }
    rawFile.send(null);
}

function handler(text){
    
    var data = text.split("\n")
    
    for (i = 1; i < data.length - 1; i++){

        var temp = data[i].split(",")
                
        var a = temp[0];
        var b = [a.slice(0, 4), ",", a.slice(4, 6), ",", a.slice(6, 8)].join('');
        
        dateArray.push(b);
        celcius = Number(temp[1]);
        temperatureArray.push(celcius);
            
    }

    domainBoarders.push(Math.min.apply(Math, temperatureArray));
    domainBoarders.push(Math.max.apply(Math, temperatureArray));
    initCanvas();
}


function createTransform(domain, range){
    // \\ domain is a two-element array of the data bounds [domain_min, domain_max]
    // \\ range is a two-element array of the screen bounds [range_min, range_max]
    // \\ this gives you two equations to solve:
    // \\ range_min = alpha * domain_min + beta
    // \\ range_max = alpha * domain_max + beta
    // a solution would be:

    var domain_min = domain[0]
    var domain_max = domain[1]
    var range_min = range[0]
    var range_max = range[1]

    // formulas to calculate the alpha and the beta
    var alpha = (range_max - range_min) / (domain_max - domain_min)
    var beta = range_max - alpha * domain_max

    // returns the function for the linear transformation (y= a * x + b)
    return function(x){
      return alpha * x + beta;
    }
}
    
function plotData(dataSet) {
    var transformer = createTransform(domainBoarders, rangeBoarders);

    ctx.beginPath();

        for (i=0;i<days - 1;i++) {
        ctx.lineWidth = 2;
        console.log(transformer(dataSet[i]));
        ctx.lineTo(i * xScale + margin, canvas.height - margin - transformer( dataSet[i]));
    }
    
    ctx.stroke();
}

function initCanvas(){
    canvas = document.getElementById("myCanvas");
    ctx = canvas.getContext('2d');

    var xAxis = ["", "Jan", "Feb", "Mar", "Apr",
    "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

    var yAxis = [240 , 200 , 170 , 140, 110, 80 , 50 , 20 , -10]

    marginX = 20
    margin = 10
    rangeBoarders = [margin, 365 + margin]
    var Val_max = domainBoarders[1];
    var Val_min = domainBoarders[0];
    var sections = 13
    var stepSize = 10;
    var columnSize = canvas.width / 12;
    var rowSize = canvas.width / 12;
  
    xScale = (canvas.width - rowSize) / days;
    labelScaleX =  (canvas.width - margin ) / sections;
    labelScaleY =  (canvas.height - margin) / yAxis.length;

    // y - axis
    ctx.strokeStyle= "black";
    ctx.beginPath();

    ctx.moveTo(margin, 0);
    ctx.lineTo(margin, canvas.height - margin);
    ctx.stroke();
    // x - axis 
    ctx.beginPath();
    ctx.moveTo(margin, canvas.height - margin);
    ctx.lineTo(canvas.width, canvas.height - margin);
    ctx.stroke();

    // x-axis labels
    for (i=1; i<= sections - 1;i++){
        var x = i * labelScaleX
        ctx.fillText(xAxis[i], x, canvas.height - 2);
    }
    ctx.stroke();

    // y - axis labels
    for (i=0;i<= yAxis.length - 1 ; i++){
        var y = i * labelScaleY
        ctx.fillText(yAxis[i], 0, y + 10);
    }
    ctx.stroke();


    ctx.strokeStyle="black";

    plotData(temperatureArray);


}



readTextFile(file, handler);




// Site with exampelary Graphs 
//http://www.tutorialspark.com/html5/HTML5_Canvas_Graphs_Charts.php

