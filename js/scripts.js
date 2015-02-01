// Variables:
// Distance from user's eyes (2ft, 120DPI)
var userDistance = 24 * 120;
// Height of each element
var elementHeight = 30;

// DRAW LOOP
window.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame;
var updateCanvas = true;
function drawLoop(){
    requestAnimationFrame(drawLoop);
    if(updateCanvas){
    	for (var i = 0; i < imageDatas.length; i++) {
    		draw(i)
    	};
    	updateCanvas = false;
    }
}

window.onload = function(){
	drawLoop();	
};

// MOUSE or ACCELEROMETER input
var windowProperties = {
	w: 0,
	h: 0,
	update: function() {
		this.w = $("body").innerWidth();
		this.h = $("body").innerHeight();
		console.log("Updated windowProperties: " + this.w + ", " + this.h);
	}
}
var attentionCenter = {
	x: 0,
	y: 0
};
var marginSize = 40;
var imageDatas = [];
var renderingKind = 1;

$(document).ready(function(){
	windowProperties.update();
	// TODO: add accelerometer input
	configureImages();
	$(document).mousemove(function(event) {
		attentionCenter.x = (event.clientX - windowProperties.w /2);
		attentionCenter.y = (event.clientY - windowProperties.h /2);
		updateCanvas = true; // Perhaps add condition to reduce number of calls
	});	
	$("#render1").click(function() {
		renderingKind = 1;
		elementHeight = 30;
	});
	$("#render2").click(function() {
		renderingKind = 2;
		elementHeight = 60;
	});
	console.log("Ready");
});

//called when the browser window is resized
function onWindowResize(e)
{
	// TODO: I don't think it works.
	windowProperties.update();
}

function configureImages() {
	$(".element").each(function(index) {
		$element = $(this);
		var $canvas = $element.children("canvas");
		var $imgHost = $element.children(".element-foreground");
		var $img = $element.find("img");
		var picture = new Image();
		picture.src = $img.attr("src");
		// TODO: if there are problems with loading images
		// try picture.onload = function() {
		var imageData = { 
			c1: {x: marginSize, y: marginSize},
			c2: {x: $imgHost.width() + marginSize, y: marginSize},
			c3: {x: $imgHost.width() + marginSize, y: $imgHost.height() + marginSize},
			c4: {x: marginSize, y: $imgHost.height() + marginSize},
			canvas: $canvas,
			host: $imgHost,
			image: picture
		}
		console.log(imageData);
		imageDatas.push(imageData);
	});
	
}

// DRAWING
function draw(imageIndex){

	console.log(imageIndex);
	var canvas = imageDatas[imageIndex].canvas[0]; // [0] gets the DOM element
	console.log(imageDatas[imageIndex]);
	var ctx = canvas.getContext("2d");

	// Clear canvas
	ctx.clearRect(0,0,canvas.width,canvas.height);

	// userDistance : distance off center
	// =
	// elementHeight : shadow length
	// therefore
	// shadow length = distance off center * element height / distance from user
	var depthX = -attentionCenter.x * elementHeight / userDistance;
	var depthY = -attentionCenter.y * elementHeight / userDistance;

	console.log("Depth: " + depthX + "; " + depthY);

	// Top left corner calculation
	var adjustedX0 = imageDatas[imageIndex].c1.x + depthX;
	var adjustedY0 = imageDatas[imageIndex].c1.y + depthY;
	// Top right corner calculation:
	var adjustedX1 = imageDatas[imageIndex].c2.x + depthX;
	var adjustedY1 = imageDatas[imageIndex].c2.y + depthY;
	// Bottom right corner calculation:
	var adjustedX2 = imageDatas[imageIndex].c3.x + depthX;
	var adjustedY2 = imageDatas[imageIndex].c3.y + depthY;
	// Bottom left corner calculation:
	var adjustedX3 = imageDatas[imageIndex].c4.x + depthX;
	var adjustedY3 = imageDatas[imageIndex].c4.y + depthY;

	// Draw segments
	ctx.strokeStyle = "#999";
	if (renderingKind == 1)
	{
		ctx.beginPath();
		// Connect the pieces that are moving:
		// Top left corner:
		ctx.moveTo(imageDatas[imageIndex].c1.x,imageDatas[imageIndex].c1.y);
		ctx.lineTo(adjustedX0, adjustedY0);
		ctx.moveTo(imageDatas[imageIndex].c1.x,imageDatas[imageIndex].c1.y);
		// Top right corner:
		ctx.lineTo(imageDatas[imageIndex].c2.x,imageDatas[imageIndex].c2.y);
		ctx.lineTo(adjustedX1, adjustedY1);
		ctx.moveTo(imageDatas[imageIndex].c2.x,imageDatas[imageIndex].c2.y);
		// Bottom right corner:
		ctx.lineTo(imageDatas[imageIndex].c3.x,imageDatas[imageIndex].c3.y);
		ctx.lineTo(adjustedX2, adjustedY2);
		ctx.moveTo(imageDatas[imageIndex].c3.x,imageDatas[imageIndex].c3.y);
		// Bottom left corner:
		ctx.lineTo(imageDatas[imageIndex].c4.x,imageDatas[imageIndex].c4.y);
		ctx.lineTo(adjustedX3, adjustedY3);
		ctx.moveTo(imageDatas[imageIndex].c4.x,imageDatas[imageIndex].c4.y);	
		// Close back at the top left corner:
		ctx.lineTo(imageDatas[imageIndex].c1.x,imageDatas[imageIndex].c1.y);
		ctx.stroke();

		imageDatas[imageIndex].host.css("margin-left", marginSize + depthX);
		imageDatas[imageIndex].host.css("margin-right", marginSize - depthX);
		imageDatas[imageIndex].host.css("margin-top", marginSize + depthY);
		imageDatas[imageIndex].host.css("margin-bottom", marginSize - depthY);
	}
	else {
		ctx.beginPath();
		// Connect the pieces that are moving:
		// Top left corner:
		ctx.moveTo(adjustedX0, adjustedY0);
		ctx.lineTo(imageDatas[imageIndex].c1.x,imageDatas[imageIndex].c1.y);
		ctx.lineTo(adjustedX0, adjustedY0);
		// Top right corner:
		ctx.lineTo(adjustedX1, adjustedY1);
		ctx.lineTo(imageDatas[imageIndex].c2.x,imageDatas[imageIndex].c2.y);
		ctx.moveTo(adjustedX1, adjustedY1);
		// Bottom right corner:
		ctx.lineTo(adjustedX2, adjustedY2);
		ctx.lineTo(imageDatas[imageIndex].c3.x,imageDatas[imageIndex].c3.y);
		ctx.moveTo(adjustedX2, adjustedY2);
		// Bottom left corner:
		ctx.lineTo(adjustedX3, adjustedY3);
		ctx.lineTo(imageDatas[imageIndex].c4.x,imageDatas[imageIndex].c4.y);
		ctx.moveTo(adjustedX3, adjustedY3);
		// Close back at the top left corner:
		ctx.lineTo(adjustedX0, adjustedY0);
		ctx.stroke();

		imageDatas[imageIndex].host.css("margin-left", marginSize);
		imageDatas[imageIndex].host.css("margin-right", marginSize);
		imageDatas[imageIndex].host.css("margin-top", marginSize);
		imageDatas[imageIndex].host.css("margin-bottom", marginSize);
	}

	// TODO: https://stackoverflow.com/questions/2688961/how-do-i-tint-an-image-with-html5-canvas
	//ctx.drawImage(imageDatas[imageIndex].image, 50, 0, 1, 260, adjustedX0, adjustedY0, Math.abs(depthX), adjustedY3-adjustedY0);

	/*
	for(var i=0;i<segments.length;i++){
		var seg = segments[i];
		ctx.beginPath();
		ctx.moveTo(seg.a.x,seg.a.y);
		ctx.lineTo(seg.b.x,seg.b.y);
		ctx.stroke();
	}

	// Ray from center of screen to mouse
	var ray = {
		a:{x:170,y:170},
		b:{x:attentionCenter.x,y:attentionCenter.y}
	};

	// Find CLOSEST intersection
	var closestIntersect = null;
	for(var i=0;i<segments.length;i++){
		var intersect = getIntersection(ray,segments[i]);
		if(!intersect) continue;
		if(!closestIntersect || intersect.param<closestIntersect.param){
			closestIntersect=intersect;
		}
	}
	var intersect = closestIntersect;
*/
	// Draw red laser
	ctx.strokeStyle = "#dd3838";
	ctx.beginPath();
	ctx.moveTo(170,170);
	ctx.lineTo(attentionCenter.x,attentionCenter.y);
	ctx.stroke();
	
	// Draw red dot
	ctx.fillStyle = "#dd3838";
	ctx.beginPath();
    ctx.arc(attentionCenter.x, attentionCenter.y, 4, 0, 2*Math.PI, false);
    ctx.fill();


}

// Find intersection of RAY & SEGMENT
function getIntersection(ray,segment){

	// RAY in parametric: Point + Direction*T1
	var r_px = ray.a.x;
	var r_py = ray.a.y;
	var r_dx = ray.b.x-ray.a.x;
	var r_dy = ray.b.y-ray.a.y;

	// SEGMENT in parametric: Point + Direction*T2
	var s_px = segment.a.x;
	var s_py = segment.a.y;
	var s_dx = segment.b.x-segment.a.x;
	var s_dy = segment.b.y-segment.a.y;

	// Are they parallel? If so, no intersect
	var r_mag = Math.sqrt(r_dx*r_dx+r_dy*r_dy);
	var s_mag = Math.sqrt(s_dx*s_dx+s_dy*s_dy);
	if(r_dx/r_mag==s_dx/s_mag && r_dy/r_mag==s_dy/s_mag){ // Directions are the same.
		return null;
	}

	// SOLVE FOR T1 & T2
	// r_px+r_dx*T1 = s_px+s_dx*T2 && r_py+r_dy*T1 = s_py+s_dy*T2
	// ==> T1 = (s_px+s_dx*T2-r_px)/r_dx = (s_py+s_dy*T2-r_py)/r_dy
	// ==> s_px*r_dy + s_dx*T2*r_dy - r_px*r_dy = s_py*r_dx + s_dy*T2*r_dx - r_py*r_dx
	// ==> T2 = (r_dx*(s_py-r_py) + r_dy*(r_px-s_px))/(s_dx*r_dy - s_dy*r_dx)
	var T2 = (r_dx*(s_py-r_py) + r_dy*(r_px-s_px))/(s_dx*r_dy - s_dy*r_dx);
	var T1 = (s_px+s_dx*T2-r_px)/r_dx;

	// Must be within parametic whatevers for RAY/SEGMENT
	if(T1<0) return null;
	if(T2<0 || T2>1) return null;

	// Return the POINT OF INTERSECTION
	return {
		x: r_px+r_dx*T1,
		y: r_py+r_dy*T1,
		param: T1
	};

}

///////////////////////////////////////////////////////

// LINE SEGMENTS
var segments = [

	// Border
	{a:{x:0,y:0}, b:{x:640,y:0}},
	{a:{x:640,y:0}, b:{x:640,y:360}},
	{a:{x:640,y:360}, b:{x:0,y:360}},
	{a:{x:0,y:360}, b:{x:0,y:0}},

	// Polygon #1
	{a:{x:100,y:150}, b:{x:120,y:50}},
	{a:{x:120,y:50}, b:{x:200,y:80}},
	{a:{x:200,y:80}, b:{x:140,y:210}},
	{a:{x:140,y:210}, b:{x:100,y:150}},

	// Polygon #2
	{a:{x:100,y:200}, b:{x:120,y:250}},
	{a:{x:120,y:250}, b:{x:60,y:300}},
	{a:{x:60,y:300}, b:{x:100,y:200}},

	// Polygon #3
	{a:{x:200,y:260}, b:{x:220,y:150}},
	{a:{x:220,y:150}, b:{x:300,y:200}},
	{a:{x:300,y:200}, b:{x:350,y:320}},
	{a:{x:350,y:320}, b:{x:200,y:260}},

	// Polygon #4
	{a:{x:340,y:60}, b:{x:360,y:40}},
	{a:{x:360,y:40}, b:{x:370,y:70}},
	{a:{x:370,y:70}, b:{x:340,y:60}},

	// Polygon #5
	{a:{x:450,y:190}, b:{x:560,y:170}},
	{a:{x:560,y:170}, b:{x:540,y:270}},
	{a:{x:540,y:270}, b:{x:430,y:290}},
	{a:{x:430,y:290}, b:{x:450,y:190}},

	// Polygon #6
	{a:{x:400,y:95}, b:{x:580,y:50}},
	{a:{x:580,y:50}, b:{x:480,y:150}},
	{a:{x:480,y:150}, b:{x:400,y:95}}

];
