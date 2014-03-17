    ///////////UI_ELEMENTS////////////////
function inherits(subConstructor, superConstructor) {
    subConstructor.prototype = Object.create(
        superConstructor.prototype,
        {
            "constructor": { 
                configurable: true,
                enumerable: false,
                writable: true,
                value: subConstructor
            }
        }
    );
}
function loadXMLDoc( jsonfile ) 
{
var data;
var xmlhttp;
if (window.XMLHttpRequest)
  {// code for IE7+, Firefox, Chrome, Opera, Safari
  xmlhttp=new XMLHttpRequest();
  }
else
  {// code for IE6, IE5
  xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
  }
xmlhttp.onreadystatechange=function()
  {      
  if (xmlhttp.readyState==4 && xmlhttp.status==200)
    {    
        try{
    data=JSON.parse(xmlhttp.responseText);
            }
       catch(err)
        {
            alert("Not a valid json");
        } 
    //alert(data);
    } 
  }
xmlhttp.open("GET",jsonfile,false);
xmlhttp.send();
return data;
}   

function addImageToCanvas(QuestionCanvas, image){
                var img = new Image();
                var x = image.x || 400;
                var y = image.y || 100;
                var height = image.height || false;
                var width = image.width || false;
                if( height == false){
                    img.src = image.url;
                    img.onload = function(){
                        height = this.height;
                        width = this.width;
                        addImage(QuestionCanvas, x,y,height,width,image.url);
                        }
                    }
                    else{
            addImage(QuestionCanvas, x,y,height,width,image.url);
                    }
    }
function addImage(svgCanvas, x, y, height, width, url){
        svgCanvas.append('image')
               .attr('image-rendering','optimizeQuality')
               .attr('x', x)
               .attr('y', y)
               .attr('width', width)
               .attr('height', height)
               .attr('xlink:href', url);
                 
    }
function arraysEqual(a, b) {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length != b.length) return false;
  a.sort();
  b.sort();
  for (var i = 0; i < a.length; ++i) {
    if (String(a[i]).toLowerCase() !== String(b[i]).toLowerCase()) return false;
  }
  return true;
}
function shuffle(o){ 
    for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
}
function CreateCanvas(width, height) {
    d3.select("svg").remove();
    var svgCanvas=  d3.select("#qdiv").append("svg")
                         .attr("width",width)
                         .attr("height", height)
                         .attr("display","none");
    svgCanvas.append('rect')
            .attr("x",0 )
            .attr("y",0 )
            .attr("width", width)
            .attr("height", height)
            .style("fill",d3.rgb(239,236,228))
            .style("stroke", "black")
            .style("stroke-width", 3);
        return svgCanvas;
}

function AddHeadingText(svgContainer, x,y, to_show){
    svgContainer.append('text')
                .text(to_show)
                .attr("x",x )
                .attr("y",y )
                .attr("font-family", "sans-serif")
                .attr("font-size", "23px")
                .style("fill","black");
}

function AddButton(svgContainer, x,y, text){
      var ButtonCanvas = svgContainer.append("g");        
      rect = ButtonCanvas.append('rect')
                    .attr("x", x-25)
                    .attr("y", y-25)
                    .attr("rx", 30)
                    .attr("ry", 30)
                    .attr("width", 120)
                    .attr("height", 60)
                    .style("opacity", 0.8)
                    .attr("fill", d3.rgb(85,85,85)); 
      ButtonCanvas.append('text').text(text)
                        .attr("x", x)
                        .attr("y", y+10)
                        .attr("font-family", "sans-serif")
                        .attr("font-size", "20px")
                        .attr("fill", "black"); 
    return ButtonCanvas;
   } 
	///////////////QUESTION///////////////
	var Question = function(question_txt){
            if(question_txt != undefined){
	        this.id = question_txt.id;
	        this.text = question_txt.text;
            this.user_answer = [];
            }
	}
	
var QType1 = function(question_txt){
	    //this is true or false
	    Question.call(this, question_txt) ;
	    this.choices = question_txt.choices;
        this.choices = shuffle(this.choices);
	    this.answers = question_txt.answers;
        var image =question_txt.image || false ;
        var uans = [];
        this.getUserAnswer = function(){
            return uans;
        }
        this.Display = function(svgCanvas, question_no, width, height){
        //add choices
       // AddRadioButtons(svgCanvas, 100,300, this.choices);
           var QuestionCanvas = svgCanvas.append("g"); 
           QuestionCanvas.append('foreignObject')
                    .attr("font-family", "sans-serif")
                    .attr("font-size", "20px")
                    .attr("width", width)
                    .attr("height", height)
                    .attr("x", 10)
                    .attr("y", 10) 
                    .text( question_no+1+ "." + this.text)
                    .append("xhtml:body")
                    .style("fill","black");

           console.log("printing image");
           console.log(image);
           if (image){
                    addImageToCanvas(QuestionCanvas, image);
                }
           var circleData = [
                    { "cx": 100, "cy": 200, "radius": 10, "color" : "blue" , "opacity":0.5} ];
           for(var i=1, l= this.choices.length; i<l; i++){
                circleData.push({ "cx": circleData[i-1].cy, "cy": circleData[i-1].cy+80, "radius": circleData[i-1].radius, "color" : circleData[i-1].color , "opacity":circleData[i-1].opacity}); }
            var circleX = 100;
            var choiceX = 130;
            var circleY = 170;
            var circleRadius = 10; 
            var choiceY = 175;
            var loop = 0;
            var circles = QuestionCanvas.selectAll("circle")
                                   .data(circleData)
                                   .enter()
                                   .append("circle");
            var circleAttributes = circles
                                    .attr("cx", circleX)
                                    .attr("cy", function (d, i) { return (circleY + 50 * i); })
                                    .attr("r", function (d) { return circleRadius; })
                                    .attr("id", function(d, i) { return "select_"+i; })
                                    .style("fill", function (d) { return d.color; })
                                    .on("mousedown", function(d,i){
                                        QuestionCanvas.selectAll("circle").style("fill", "blue");
                                        QuestionCanvas.selectAll("text").style("fill", "blue");
                                        
                                        var testSelect = QuestionCanvas.select("#select_"+i).style("fill", "grey");
                                        var testAnswer = QuestionCanvas.select("#answer_"+i).style("fill", "grey");
                                        uans = [];
                                        //console.log("answer is" + testAnswer.data());
                                        uans.push(testAnswer.data()[0]);
                                });
            //console.log(this.choices);
            var choiceText = QuestionCanvas.selectAll("text")
                    .data(this.choices)
                    .enter()
                    .append("text");
             var choiceTextAttributes = choiceText
                    .attr("x", choiceX)
                    .attr("y", function(d, i) { return (choiceY + 50 * i); })
                    .attr("id", function(d, i) { return "answer_"+i; })
                    .text( function (d, i) { return d; })
                    .attr("font-family", "sans-serif")
                    .attr("font-size", "20px")
                    .style("fill", "blue");    
        }	

	}
	
	//inherit Question
   // QType1.prototype = new Question();
    inherits(QType1, Question);

///////////////QTYPE2///////////////////////////////////////////////////////////////////////////////////////
	var QType2 = function(question_txt){
	    //this is true or false
	    Question.call(this, question_txt) ;
	    this.choices = question_txt.choices;
        this.choices = shuffle(this.choices);
	    this.answers = question_txt.answers;
        var image =question_txt.image || false ;
        var uans = [];
        this.getUserAnswer = function(){
            //console.log("user answer");
            //console.log(uans);
            return uans;
        }
    
        this.Display = function(svgCanvas, question_no, width, height){
        //add text

        //add choices
           var QuestionCanvas = svgCanvas.append("g"); 
           QuestionCanvas.append('foreignObject')
                    .attr("font-family", "sans-serif")
                    .attr("x", 10)
                    .attr("y", 10) 
                    .attr("font-size", "20px")
                    .attr("width", width)
                    .attr("height", height)
                    .text( question_no+1+ "." + this.text)
                    .append("xhtml:body")
                    .style("fill","black");

           if (image){
                    addImageToCanvas(QuestionCanvas, image);
                }
           var circleData = [
                    { "cx": 100, "cy": 200, "radius": 10, "color" : "blue" , "opacity":0.5} ];
           for(var i=1, l= this.choices.length; i<l; i++){
                circleData.push({ "cx": circleData[i-1].cy, "cy": circleData[i-1].cy+80, "radius": circleData[i-1].radius, "color" : circleData[i-1].color , "opacity":circleData[i-1].opacity}); }
            var circleX = 100;
            var choiceX = 130;
            var circleY = 170;
            var circleRadius = 10; 
            var choiceY = 175;
            var loop = 0;
            var circles = QuestionCanvas.selectAll("circle")
                                   .data(circleData)
                                   .enter()
                                   .append("circle");
            var circleAttributes = circles
                                    .attr("cx", circleX)
                                    .attr("cy", function (d, i) { return (circleY + 50 * i); })
                                    .attr("r", function (d) { return circleRadius; })
                                    .attr("id", function(d, i) { return "select_"+i; })
                                    .style("fill", function (d) { return d.color; })
                                    .on("mousedown", function(d,i){
                                        var color = QuestionCanvas.select("#select_"+i).style("fill");
                                        //console.log("prev color is" + color);
                                        if(color == '#808080')
                                            color = "blue";
                                        else
                                            color = "grey";
                                        //console.log("color is " + color);
                                        var testSelect = QuestionCanvas.select("#select_"+i).style("fill", color);
                                        var testAnswer = QuestionCanvas.select("#answer_"+i).style("fill", color);
                                        if(color == "grey"){
                                            //console.log(color);
                                            //console.log(testAnswer.data()[0]);
                                            uans.push(testAnswer.data()[0]);
                                            //console.log(uans);
                                        }
                                        if(color == "blue"){
                                            var index = uans.indexOf(testAnswer.data()[0]);
                                            if (index > -1){
                                                uans.splice(index, 1);
                                            }
                                            //console.log(color);
                                            //console.log(testAnswer.data()[0]);
                                            //console.log(uans);
                                        }
                                });
            //console.log(this.choices);
            var choiceText = QuestionCanvas.selectAll("text")
                    .data(this.choices)
                    .enter()
                    .append("text");
             var choiceTextAttributes = choiceText
                    .attr("x", choiceX)
                    .attr("y", function(d, i) { return (choiceY + 50 * i); })
                    .attr("id", function(d, i) { return "answer_"+i; })
                    .text( function (d, i) { return d; })
                    .attr("font-family", "sans-serif")
                    .attr("font-size", "20px")
                    .style("fill", "blue");    
        }	

	}
	
	//inherit Question
   // QType1.prototype = new Question();
    inherits(QType2, Question);
///////////////////////////////////////////Question Type 3 Fill in the blank///////////////////////////////
	var QType3 = function(question_txt){
	    //this is true or false
	    Question.call(this, question_txt) ;
	    this.answers = question_txt.answers;
        var uans = [];
        var image =question_txt.image || false ;
        this.getUserAnswer = function(){
            var ans = d3.select('#fill_in').text();
            console.log("printing answer");
            console.log(ans);
            uans.push(ans);
            return uans;
        }
        this.Display = function(svgCanvas, question_no, width, height){
        //add text

        //add choices
           var QuestionCanvas = svgCanvas.append("g"); 
           var currentObject;
           var Question = QuestionCanvas.append('foreignObject')
                    .attr("font-family", "sans-serif")
                    .attr("font-size", "20px")
                    .attr("x", 10)
                    .attr("y", 10) 
                    .attr("width", width)
                    .attr("height", height)
                    .text( question_no+1+ "." + this.text)
                    .append("xhtml:body")
                    .style("fill","black");
           QuestionCanvas.append('text')
                    .attr("x", 50)
                    .attr("y", 100)
                    .attr("id", "fill_in")
                    .attr("width", 100)
                    .attr("height", 100)
                    .attr("font-family", "sans-serif") 
                    .attr("font-size", "20px")  
                    .style("fill", "blue")
                    .text( "Click here and Type to answer")
                    .on("click", function(d) {
                        d3.select(this)
                        .text("");
                        currentObject = this;
                    });
           if (image){
                    addImageToCanvas(QuestionCanvas, image);
                }
            var Reset = AddButton(QuestionCanvas, 250,180, "RESET");
            Reset.on("click", function(d){
                    d3.select("#fill_in").text("Click here and Type to answer");
                    currentObject = null;
                    });
        d3.select("body")
        .on("keypress", function() {
                var data = d3.select("#fill_in").text() + String.fromCharCode(d3.event.charCode);
                d3.select("#fill_in")
                .text(data);
        }
        );
    }	

	}
	
	//inherit Question
   // QType1.prototype = new Question();
    inherits(QType3, Question);


///////////////////////////////////////////Question Type 4 Pie Chart HotSpot///////////////////////////////
	var QType4 = function(question_txt){
	    //this is true or false
	    Question.call(this, question_txt) ;
	    this.answers = question_txt.answers;
        var uans = [];
        var image =question_txt.image || false ;
        var pie_data = question_txt.pie_data;
        this.getUserAnswer = function(){
            return uans;
        }
        this.Display = function(svgCanvas, question_no, width, height){
           var QuestionCanvas = svgCanvas.append("g"); 
           var Question = QuestionCanvas.append('foreignObject')
                    .attr("font-family", "sans-serif")
                    .attr("font-size", "20px")
                    .attr("width", width)
                    .attr("x", 10)
                    .attr("y", 10) 
                    .attr("height", height)
                    .text( question_no+1+ "." + this.text)
                    .append("xhtml:body")
                    .style("fill","black");

                    var
                    r = 100,                            //radius
                    color = d3.scale.category20c(); 

                    var vis = svgCanvas
                              .data([pie_data])
                              .append("svg:g")
                              .attr("transform", "translate(" + width/2 + "," + height/3 + ")")  
                    var arc = d3.svg.arc()              //this will create <path> elements for us using arc data
                        .outerRadius(r);

                    var pie = d3.layout.pie()           //this will create arc data for us given a list of values
                        .value(function(d) { return d.value; });    //we must tell it out to access the value of each element in our data array



                    var arcOver = d3.svg.arc()
                            .outerRadius(r + 10);
                    var click = false;
                    var arcs = vis.selectAll("g.slice")     //this selects all <g> elements with class slice (there aren't any yet)
                        .data(pie)                          //associate the generated pie data (an array of arcs, each having startAngle, endAngle and value properties) 
                        .enter()                            //this will create <g> elements for every "extra" data element that should be associated with a selection. The result is creating a <g> for every object in the data array
                        .append("svg:g")                //create a group to hold each slice (we will have a <path> and a <text> element associated with each slice)
                                .attr("class", "slice")    //allow us to style things in the slices (like text)
                         .on("mouseover", function(d) {
                                if(!click) {
                                    d3.select(this).select("path").transition()
                                       .duration(1000)
                                       .attr("d", arcOver);
                                }
                                })
                            .on("mouseout", function(d) {
                                if(!click) {
                                d3.select(this).select("path").transition()
                                   .duration(1000)
                                   .attr("d", arc);
                                }
                            })
                                .on("click", function(d) {
                                    d3.select(this).select("path").attr( "d", arcOver);
                                    console.log(d3.select(this).select("text").data()[0]["data"]["label"]);
                                    uans.push(d3.select(this).select("text").data()[0]["data"]["label"]);
                                    uans.push(d3.select(this).select("text").data()[0]["data"]["value"].toString());
                                    click = true;
                                    
                                });

                        arcs.append("svg:path")
                                .attr("fill", function(d, i) { return color(i); } ) //set the color for each slice to be chosen from the color function defined above
                                .attr("d", arc);                                    //this creates the actual SVG path using the associated data (pie) with the arc drawing function


                        arcs.append("svg:text")                                     //add a label to each slice
                                .attr("transform", function(d) {                    //set the label's origin to the center of the arc
                                //we have to make sure to set these before calling arc.centroid
                                d.innerRadius = 0;
                                d.outerRadius = r;
                                return "translate(" + arc.centroid(d) + ")";        //this gives us a pair of coordinates like [50, 50]
                            })
                            .attr("text-anchor", "middle")                          //center the text on it's origin
                            .text(function(d, i) { return pie_data[i].label; });
                            
                var Reset = AddButton(QuestionCanvas, 550,180, "RESET");
                Reset.on("click", function(){
                    d3.select("svg").selectAll("g.slice").select("path").attr( "d", arc );
                        click = false;
                        uans = [];
                        });
    }	
	}
	//inherit Question
    // QType1.prototype = new Question();
    inherits(QType4, Question);

    ///////////////////////////////Question type: 5 Drag and Drop//////////////////
	var QType5 = function(question_txt){
	    //this is true or false
	    Question.call(this, question_txt) ;
	    this.answers = question_txt.answers;
        var uans = [];
        var image =question_txt.image || false ;
        var dragOptions = question_txt.drag;
        var dropOptions = question_txt.drop;
        var text = this.text;
        this.getUserAnswer = function(){
            return uans;
        }
        this.Display = function(svgCanvas, question_no, width, height){	


        var QuestionCanvas = svgCanvas.append("g")
                            .attr("class", "draw");
        var draw = function(){
                    ///drag and drop code:
        var QuestionCanvas = svgCanvas.append("g")
                            .attr("class", "draw");
                    
                            (function(){
            d3.experiments = {};
             
            d3.experiments.dragAll = function() {
                this.on("mousedown", function(){grab(this, d3.event)})
                    .on("mousemove", function(){drag(this, d3.event)})
                    .on("mouseup", function(){drop(this, d3.event)});
            };
             
            var trueCoordX = null,
                trueCoordY = null,
                grabPointX = null,
                grabPointY = null,
                dragTarget = null;
             
            function grab(element, events){
                dragTarget = events.target;
                //// send the grabbed element to top
                console.log("Grabbed" + dragTarget.id);
                dragTarget.parentNode.appendChild( dragTarget );
                d3.select(dragTarget).attr("pointer-events", "none");
                //// find the coordinates
                var transMatrix = dragTarget.getCTM();
                grabPointX = trueCoordX - Number(transMatrix.e);
                grabPointY = trueCoordY - Number(transMatrix.f);
            };
             
            function drag(element, events){
                var newScale = d3.select("svg").node().currentScale;
                var translation = d3.select("svg").node().currentTranslate;

                trueCoordX = (events.clientX - translation.x)/newScale;
                trueCoordY = (events.clientY - translation.y)/newScale;
                if (dragTarget){
                    var newX = trueCoordX - grabPointX;
                    var newY = trueCoordY - grabPointY;
                    d3.select(dragTarget).attr("transform", "translate(" + newX + "," + newY + ")");
                }
            };
             
            function drop(element, events){
                if (dragTarget){
                    d3.select(dragTarget).attr("pointer-events", "all");
                    var targetElement = events.target;
                    if(targetElement != ddgroup.node()){
                        
                        if(targetElement.id == "rectangle"){
                                    console.log(dragTarget.id + ' go back ');
                                    d3.select(dragTarget).attr("transform", "translate(0,0)");
                                    }
                        else{
                        var targetx = Number(targetElement.getAttribute("x")) + Number(targetElement.getAttribute("width")/2) - Number(dragTarget.getAttribute("width")/2);
                        var targety = Number(targetElement.getAttribute("y")) + Number(targetElement.getAttribute("height")/2) - Number(dragTarget.getAttribute("height")/2);
                        console.log(dragTarget.id + ' has been dropped on top of ' + targetElement.id);
                        console.log("Attrib: "+ targetx + " " + targety); 
                        dragx = dragTarget.getAttribute("x");
                        dragy = dragTarget.getAttribute("y");
                        console.log("Attrib: "+ dragx + " " + dragy);
                        var ans = [];
                        ans.push(targetElement.id);
                        ans.push(dragTarget.id);
                        uans.push(ans);
                        console.log(uans);
                        var dragname = dragTarget.id;
                        var dropname = targetElement.id;
                        var dragid = dragname.substring(5,6);
                        var dropid = dropname.substring(5,6);
                        console.log(dragid + "," + dropid);
                        //currentAnswers[Number(dragid)] = Number(dropid);
                        var tranx = targetx - dragx;
                        var trany = targety - dragy;
                        console.log("Attrib: "+ tranx + " " + trany);
                        d3.select(dragTarget).attr("transform", "translate(" + tranx + "," + trany + ")");
                        }

                    }
                    else
                    {
                        console.log(dragTarget.id + ' go back ');
                        d3.select(dragTarget).attr("transform", "translate(0,0)");
                        
                    }
                    dragTarget = null;
                }
                };
                })();
        var dragX = 120;
        var dragY = 100;
        var dropX = 250;
        var dropY = 100;
        var dragDist = 290/dragOptions.length;
        var dropDist = 290/dropOptions.length;
        var Question = QuestionCanvas.append('foreignObject')
                .attr("font-family", "sans-serif")
                .attr("font-size", "20px")
                .attr("width", width)
                .attr("height", height)
                .attr("x", 10)
                .attr("y", 10) 
                .text( question_no+1+ "." + text)
                .append("xhtml:body")
                .style("fill","black");
        
        var ddgroup = QuestionCanvas.append("g")
                     .call(d3.experiments.dragAll);
                            
                            
        ddgroup.append("svg:rect")
        .attr("id", "rectangle")
        .attr("width", width)
        .attr("height", height)
        .attr("fill", 'none')
        .attr('pointer-events', 'all');
                            for(var i = 0; i < dropOptions.length; i++)
                            {
                                ddgroup.append('rect')
                                .attr("x", dropX)
                                .attr("y", dropY + dropDist * i)
                                .attr("id", dropOptions[i])
                                .attr("width", 200)
                                .attr("height", 65)
                                .attr("fill", "yellow")
                                .attr("fill-opacity", 0.4);
                            }
                                
                             for(var i = 0; i < dragOptions.length; i++)
                            {
                                ddgroup.append('image')
                                .attr("x", dragX)
                                .attr("y", dragY + dragDist * i)
                                .attr("id", dragOptions[i])
                                .attr("width", 55)
                                .attr("height", 55)
                                .attr("xlink:href", dragOptions[i]);
                            }
        }
        draw();
        var Reset = AddButton(svgCanvas, 550,180, "RESET");
        Reset.on("click", function(){
                d3.select("svg").selectAll("g.draw").remove();
                draw();
                uans = [];
                });
    }
}
	//inherit Question
    inherits(QType5, Question);

///////////////////////////////////////////Question Type 6 Photo HotSpot///////////////////////////////
	var QType6 = function(question_txt){
	    //this is true or false
	    Question.call(this, question_txt) ;
	    this.answers = question_txt.answers;
        var uans = [];
        var image =question_txt.image || false ;
        var choices = question_txt.options;
        var rect_x = question_txt.rectangle[0];
        var rect_y = question_txt.rectangle[1];
        this.getUserAnswer = function(){
            return uans;
        }
        this.Display = function(svgCanvas, question_no, width, height){

           for(var i=0; i<choices.length; i++)
                uans.push(0);
           var QuestionCanvas = svgCanvas.append("g"); 
           QuestionCanvas.append('foreignObject')
                    .attr("font-family", "sans-serif")
                    .attr("font-size", "20px")
                    .attr("width", width)
                    .attr("height", height)
                    .attr("x", 10)
                    .attr("y", 10) 
                    .text( question_no+1+ "." + this.text)
                    .append("xhtml:body")
                    .style("fill","black");

           console.log("printing image");
           console.log(image);
           if (image){
                    addImageToCanvas(QuestionCanvas, image);
                }
        var choiceCover = QuestionCanvas.selectAll("rect")
            .data(choices)
            .enter()
            .append("rect");
                
        var choiceCoverAttributes = choiceCover
            .attr("x", function(d, i) { return choices[i].x; })
            .attr("y", function(d, i) { return choices[i].y; })
            .attr("id", function(d, i) { return "cover_"+i; })
            .attr("class", "choices")
            .attr("width", rect_x)
            .attr("height", rect_y)
            .attr("fill","blue")
            .attr("fill-opacity", 0.2)
            .on("click", function(d,i){ 
                uans[i] = 1;
                QuestionCanvas.select("#cover_"+i).style("fill-opacity", 0.5);   
            });

        var Reset = AddButton(QuestionCanvas, 450,420, "RESET");
        Reset.on("click", function(d){
                QuestionCanvas.selectAll("rect.choices").style("fill-opacity", 0.2);   
               for(var i=0; i<choices.length; i++)
                    uans[i] = 0;
                });

        }	

	}
	
	//inherit Question
    inherits(QType6, Question);


///////////////////////////////////////////Question Type 7 Sequence Type Question///////////////////////////////
	var QType7 = function(question_txt){
	    //this is true or false
	    Question.call(this, question_txt) ;
	    this.answers = question_txt.answers;
        var uans = [];
        var images =question_txt.drag_images || false ;
        var question_images = question_txt.question_images || false;
        var text = this.text;
        this.getUserAnswer = function(){
            return uans;
        }
        this.Display = function(svgCanvas, question_no, width, height){
            var QuestionCanvas = svgCanvas.append("g")
                            .attr("class", "draw");
        var draw = function(){
            var QuestionCanvas = svgCanvas.append("g")
                            .attr("class", "draw");
            (function(){
            d3.experiments = {};
             
            d3.experiments.dragAll = function() {
                this.on("mousedown", function(){grab(this, event)})
                    .on("mousemove", function(){drag(this, event)})
                    .on("mouseup", function(){drop(this, event)});
            };
             
            var trueCoordX = null,
                trueCoordY = null,
                grabPointX = null,
                grabPointY = null,
                dragTarget = null;
             
            function grab(element, event){
                dragTarget = event.target;
                //// send the grabbed element to top
                dragTarget.parentNode.appendChild( dragTarget );
                d3.select(dragTarget).attr("pointer-events", "none");
                //// find the coordinates
                var transMatrix = dragTarget.getCTM();
                grabPointX = trueCoordX - Number(transMatrix.e);
                grabPointY = trueCoordY - Number(transMatrix.f);
            };
             
            function drag(element, event){
                var newScale = d3.select("svg").node().currentScale;
                var translation = d3.select("svg").node().currentTranslate;

                trueCoordX = (event.clientX - translation.x)/newScale;
                trueCoordY = (event.clientY - translation.y)/newScale;
                if (dragTarget){
                    var newX = trueCoordX - grabPointX;
                    var newY = trueCoordY - grabPointY;
                    d3.select(dragTarget).attr("transform", "translate(" + newX + "," + newY + ")");
                }
            };
             
            function drop(element, event){
                if (dragTarget){
                    d3.select(dragTarget).attr("pointer-events", "all");
                    var targetElement = event.target;
                    if(targetElement != ddgroup.node()){
                        
                        if(targetElement.id == "rectangle"){
                                    console.log(dragTarget.id + ' go back ');
                                    d3.select(dragTarget).attr("transform", "translate(0,0)");
                                    }
                        else{
                        var targetx = Number(targetElement.getAttribute("x")) + Number(targetElement.getAttribute("width")/2) - Number(dragTarget.getAttribute("width")/2);
                        var targety = Number(targetElement.getAttribute("y")) + Number(targetElement.getAttribute("height")/2) - Number(dragTarget.getAttribute("height")/2);
                        console.log(dragTarget.id + ' has been dropped on top of ' + targetElement.id);
                        console.log("Attrib: "+ targetx + " " + targety); 
                        dragx = dragTarget.getAttribute("x");
                        dragy = dragTarget.getAttribute("y");
                        console.log("Attrib: "+ dragx + " " + dragy);
                        var ans = [];
                        ans.push(targetElement.id);
                        ans.push(dragTarget.id);
                        uans.push(ans);
                        console.log(uans);
                        var dragname = dragTarget.id;
                        var dropname = targetElement.id;
                        var dragid = dragname.substring(5,6);
                        var dropid = dropname.substring(5,6);
                        console.log(dragid + "," + dropid);
                        //currentAnswers[Number(dragid)] = Number(dropid);
                        var tranx = targetx - dragx;
                        var trany = targety - dragy;
                        console.log("Attrib: "+ tranx + " " + trany);
                        d3.select(dragTarget).attr("transform", "translate(" + tranx + "," + trany + ")");
                        }

                    }
                    else
                    {
                        console.log(dragTarget.id + ' go back ');
                        d3.select(dragTarget).attr("transform", "translate(0,0)");
                        
                    }
                    dragTarget = null;
                }
                };
                })();
        var Question = QuestionCanvas.append('foreignObject')
                .attr("font-family", "sans-serif")
                .attr("font-size", "20px")
                .attr("width", width)
                .attr("height", height)
                .attr("x", 10)
                .attr("y", 10) 
                .text( question_no+1+ "." + text)
                .append("xhtml:body")
                .style("fill","black");
        
        var question_group = QuestionCanvas.append("g");
         for(var i = 0; i < question_images.length; i++)
        {
            question_group.append('image')
            .attr('image-rendering','optimizeQuality')
            .attr("x", question_images[i].x)
            .attr("y", question_images[i].y)
            .attr("id", question_images[i].id)
            .attr("width", question_images[i].width)
            .attr("height", question_images[i].height)
            .attr("xlink:href", question_images[i].href);
        }
        
        var ddgroup = QuestionCanvas.append("g")
                     .call(d3.experiments.dragAll);
                            
        ddgroup.append("svg:rect")
        .attr("id", "rectangle")
        .attr("width", width)
        .attr("height", height)
        .attr("fill", 'none')
        .attr('pointer-events', 'all');
                            
         for(var i = 0; i < images.length; i++)
        {
            ddgroup.append('image')
            .attr('image-rendering','optimizeQuality')
            .attr("x", images[i].x)
            .attr("y", images[i].y)
            .attr("id", images[i].id)
            .attr("width", images[i].width)
            .attr("height", images[i].height)
            .attr("xlink:href", images[i].href);
        }
        }
        draw();
        var Reset = AddButton(svgCanvas, 550,180, "RESET");
        Reset.on("click", function(){
                d3.select("svg").selectAll("g.draw").remove();
                draw();
                uans = [];
                });
        }	
	}
	
	//inherit Question
    inherits(QType7, Question);


	///////////////QUIZ//////////////////
	function quiz(popcorn, quiz_data_json){

    // load questions from json
    var data= loadXMLDoc(quiz_data_json);
    var questions = data["data"]["questions"];
    console.log(questions);
    var QuestionCanvas;
	var question_objs = {};
    var question_types = {};
	var user_ans = {};
	var corr_ans = {};
	var show_ques = 0;
	var popcorn = popcorn;
	var div = document.createElement("div");
	div.id = "qdiv";
	div.style.position = "absolute";
	div.style.top = popcorn.position().top + "px";
	div.style.left = popcorn.position().left + "px";
	popcorn.media.parentNode.appendChild(div);
	var svgCanvas;

	//console.log("Starting Quiz");
    var QuestionFactory = function(question_object){
            console.log(question_object.type);
            return eval('new QType'+ question_object.type+  '(question_object)');
    }
	var LoadQuestions = function(){
	    for(var i=0, l=questions.length; i<l; i++){
                question_objs[questions[i].id] = (QuestionFactory(questions[i]));
                question_types[questions[i].id] = questions[i].type;
                //corr_ans.push({  i, "qans": questions[i].settings.answers });
                corr_ans[questions[i].id] = questions[i].answers;
	        }
        console.log("Printing the questions");
	    console.log(question_objs);
	}
    LoadQuestions();
    var l = Object.keys(question_objs).length;
    var ans = [];
    this.ShowQuestion = function (question_index, width, height) {
            svgCanvas = CreateCanvas(popcorn.media.offsetWidth, popcorn.media.offsetHeight);
            var nextButtonText = AddButton(svgCanvas, popcorn.media.offsetWidth - 100, popcorn.media.offsetHeight - 40, "Continue");
            nextButtonText
            .on("click", function (d, i) {
                //console.log("Clicking Next");
                //console.log("show_ques" + show_ques);
                //console.log(show_ques);
                //console.log(l);
                user_ans[question_index] = question_objs[question_index].getUserAnswer();
                //user_ans.push({ "qid": question_index - 1, "qans": question_objs[question_index - 1].getUserAnswer() });
                //console.log(user_ans);
                d3.select("svg").remove();
                //svgCanvas.attr("display", "none");
                popcorn.play();
            });
        svgCanvas.attr("display", "inline");
        popcorn.pause();
        //console.log("question index is:" + question_index - 1);
        question_objs[question_index].Display(svgCanvas,show_ques, popcorn.media.offsetWidth - 100, popcorn.media.offsetHeight - 40);
        show_ques++;
        //ans.pushQuestionCanvas.select("#answer_"+i).style("fill", "grey")
    };
    this.ShowResult = function(){
        //console.log("Result");
        svgCanvas = CreateCanvas(popcorn.media.offsetWidth, popcorn.media.offsetHeight);
        svgCanvas.attr("display", "inline");
	    AddHeadingText(svgCanvas,100,50, "Thanks for the Quiz");
        popcorn.pause();
        var corr = 0;
        var wrong = 0;
        console.log(user_ans);
        console.log(corr_ans);
        for ( var key in user_ans ) {
            if((question_types[key] == 1) || (question_types[key] == 2) || (question_types[key]  == 3) || (question_types[key] == 4) || (question_types[key] == 6)) {
                if(arraysEqual(user_ans[key], corr_ans[key])){
                    corr++;
                }
                else{
                    wrong++;
                    }
            }
            else if((question_types[key] == 5) || (question_types[key] == 7)){
                var correct = false;
                console.log(corr_ans[key]);
                console.log(user_ans[key]);
                var s=0;
                for(var i=0; i< corr_ans[key].length; i++){
                    var to_check = corr_ans[key][i];
                        for(var j=0; j< user_ans[key].length; j++){
                            var to_check_in_user = user_ans[key][j];
                            console.log("checking");
                            console.log(to_check);
                            console.log(to_check_in_user);
                            if(arraysEqual(to_check, to_check_in_user))
                                s++;
                        } 
                    console.log("s:"+ s);
                    if(s == (corr_ans[key].length))
                        correct = true;
                }
                if(correct) {
                    corr++;
                }
                else{
                    wrong++;
                }
        }
        }
        //console.log(corr);
        //console.log(wrong);
	    AddHeadingText(svgCanvas,300,150, "No of correct Ans: " + corr);
	    AddHeadingText(svgCanvas,300,250, "No of wrong Ans: " + wrong);
/*
        AddHeadingText(svgCanvas,300,350, "The correct Answers are: " + wrong);
        for ( var key in user_ans ) {
        }
*/
        var nextButtonText = AddButton(svgCanvas, popcorn.media.offsetWidth - 100, popcorn.media.offsetHeight - 40, "Continue");
            nextButtonText
            .on("click", function (d, i) {      
                d3.select("svg").remove();
                popcorn.play();
            });
        
    }
    }
