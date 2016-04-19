
		(function ()
		{
			var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
			window.requestAnimationFrame = requestAnimationFrame;
		})();
var totalNumBlocks = 60, canHover = true;
var isDead = false, wonGame = false, canShootHook = true;
var globalC = 0;	//BECAUSE HOOK OCCURS TOO RAPIDLY

var canvas = document.getElementById("canvas"),
    ctx = canvas.getContext("2d"),
    //demensions of entire canvas
    width = 2086,
    height = 350,
    player = {
        x: 10,
        y: height - 15, //MAKE SURE IT FITS
        width: 15,
        height: 15,
        speed: 2,
        velX: 0,
        velY: 0,
        jumping: false,
        grounded: false,
	      grounded_L: false,
        grounded_R: false,
        canDJ: false


    },
    keys = [],
    friction = 0.8,
    gravity = 0.35;

var boxes = [];

var hook = {x:0,  y:0}, fired, madeContact;

//ai
aiR = false, aiL = false, aiJ = false, aiDJ = false, aiH = false;

//player.sprite = Sprite("fish");
/*
player.draw = function() {
  this.sprite.draw(canvas, this.x, this.y);
};
*/

//win!
boxes.push({
  x: width-30,
  y: height/2,
  width: 30,
  height: 20
});
ctx.save();
ctx.clearRect(width-20, height-2, 20, 20);
ctx.fillStyle = "blue"; //changed
ctx.fill();
ctx.restore();

// left-most border
	boxes.push({
		x: 0,
		y: 0,
		width: 10,
		height: height
	});
//bottom
	boxes.push({
		x: 0,
		y: height - 2,
		width: (width/15),
		height: 50
	});


//right-most border
	boxes.push({
		x: width - 10,
		y: 0,
		width: 50,
		height: height/2
	});




canvas.width = width;
canvas.height = height;

//added


function moveLeft()
{
	// left arrow
	if (player.velX > -player.speed)
	{
			player.velX--;
	}
}

function moveRight()
{
	// right arrow
	if (player.velX < player.speed)
	{
			player.velX++;
	}

}

function jumpNow()
{
	// up arrow
	if (player.grounded)
{
			player.jumping = true;
			player.grounded = false;
			player.velY = -player.speed * 3;
				canDJ = true;
			//console.log("First J: ",canDJ);

}
else if(player.grounded_L)
{
//console.log("RIGHT J");
player.jumping = true;
player.grouded = false;
player.grounded_L = false;
player.velY = -player.speed * 1;
player.velX = player.speed * 3;
canDJ = true;
}
else if(player.grounded_R)
{
//console.log("LEFT J");
player.jumping = true;
player.grouded = false;
player.grounded_R = false;
player.velY = -player.speed * 1;
player.velX = -player.speed * 3;
canDJ = true;

}

}

function doubleJump()
{
	if(canDJ && !player.grounded)
	{
		canDJ =false;
		player.velY = -player.speed * 3;

	}

}

//original
function createObstacles(my_param)
{
  if(boxes.length > 4)
  {
    var myNum = boxes.length-4;

    for(var deletei = 0; deletei < myNum; deletei+=1)
    {

        boxes.pop();
        if(boxes.length <= 4)
          break;


    }
  }
if(my_param > 0)
{
  for (var i = 1; i < my_param; i+=1)
  {
    var num_w = (Math.random() * 2000) + 10;
    var num_h = (Math.random() * 300) + 10;

    boxes.push({
      x: num_w,
      y: num_h,
      width: 30,
      height: 10
    });

    //console.log(boxes[i]["x"]);

  }
}
else {
  //not enough stuff
}

}//end createObstacles()


//scroll across terrain
function terrain(width, height, displace, roughness, seed)
{
    var points = [],
        // Gives us a power of 2 based on our width
        power = Math.pow(2, Math.ceil(Math.log(width) / (Math.log(2)))),
        seed = seed ||
		{
            s: height / 2 + (Math.random() * displace * 2) - displace,
            e: height / 2 + (Math.random() * displace * 2) - displace
        };

    // Set the initial left point
    if(seed.s === 0){
        seed.s = height / 2 + (Math.random() * displace * 2) - displace;
    }
    points[0] = seed.s;

    // set the initial right point
    if(seed.e === 0){
        seed.e = height / 2 + (Math.random() * displace * 2) - displace
    }
    points[power] = seed.e;

    displace *= roughness;

    // Increase the number of segments
    for (var i = 1; i < power; i *= 2)
	   {
        // Iterate through each segment calculating the center point
        for (var j = (power / i) / 2; j < power; j += power / i)
	      {
            points[j] = ((points[j - (power / i) / 2] + points[j + (power / i) / 2]) / 2);
            points[j] += (Math.random() * displace * 2) - displace
        }
        // reduce our random range
        displace *= roughness;
      }


    createObstacles(totalNumBlocks);
		//AIObstacleCourse();




    return points;
}

// get the points
var terPoints = terrain(width, height, height / 4, 0.6),
    terPoints2 = terrain(width, height, height / 4, 0.6,
		{s : terPoints[terPoints.length-1], e : 0});

var offset = 0;

//like "update"
function scrollTerrain()
{
  checkDeath();
  checkWin();

    ctx.clearRect(0, 0, width, height);

    offset -= 3;

    // draw the first half

    ctx.beginPath();
    ctx.moveTo(offset, terPoints[0]);
    for (var t = 0; t < terPoints.length; t++) {
        ctx.lineTo(t + offset, terPoints[t]);
    }

    for (t = 0; t < terPoints2.length; t++) {
        ctx.lineTo(width+offset + t, terPoints2[t]);
    }

    // finish creating the rect so we can fill it
    ctx.lineTo(width + offset+t, canvas.height);
    ctx.lineTo(offset, canvas.height);
    ctx.closePath();

    //FILLS ONLY THE BACKGROUND IMAGE!!!!! V
    ctx.save();
      //ctx.fillStyle="black";
      var my_gradient=ctx.createLinearGradient(0,0,0,450);
      my_gradient.addColorStop(0,"green");
      my_gradient.addColorStop(1,"white");
      ctx.fillStyle=my_gradient;
      //ctx.fillRect(20,20,150,100);




      ctx.fill();

    ctx.restore();

//testing





    /*
    * if the number of our points on the 2nd array is less than or equal to our screen width
    * we reset the offset to 0, copy terpoints2 to terpoints,
    * and gen a new set of points for terpoints 2
    */

    if(terPoints2.length-1 + width + offset <= width)
    {
        terPoints = terPoints2;
        terPoints2 = terrain(width, height, height / 4, 0.6, {s : terPoints[terPoints.length-1], e : 0});
        offset = 0;
    }

	//add Player!

	if(player.grounded)
  {
    player.velY = 0;
    canDJ = false;
  }

  //hook
  if(keys[72])
  {
		globalC++;
		//how i'm dealing with rapid fire...
		if(globalC % 4 == 0)
			shootHook();


  }



  //SHIFT FOR NEW OBSTACLE COURSE
  if(keys[16])
  {
    	totalNumBlocks -= 1;
      createObstacles(totalNumBlocks);
      //console.log("down to ", totalNumBlocks);
  }


  // check keys
  if (keys[87])
  {
		jumpNow();

  }
	//double jump with space
	if(keys[32])
	{
		doubleJump();


	}

  if (keys[68])
  {
      //right
			moveRight();
  }
  if (keys[65])
  {
      //left
			moveLeft();
  }



    player.velX *= friction;
    player.velY += gravity;


	ctx.beginPath(); //start painting object red (?)

  player.grounded = false;
	player.grounded_L = false;
	player.grounded_R = false;






    for (var i = 0; i < boxes.length; i++)
    {
        ctx.rect(boxes[i].x, boxes[i].y, boxes[i].width, boxes[i].height);

        var dir = colCheck(player, boxes[i]);

        if (dir === "l")
        {
            player.velX = 0;
            player.jumping = false;
			         player.grounded_L = true;
        }
		else if(dir == "r")
		{
			player.velX = 0;
			player.jumping = false;
			player.grounded_R = true;
		}

		else if (dir === "b")
		{
            player.grounded = true;
            player.jumping = false;

            //canDJ = 0;
        }
/*
		else if (dir === "t")
		{
            player.velY *= -1;
        }
				*/

    }



    player.x += player.velX;
    player.y += player.velY;

    ctx.save();
    ctx.fillStyle="black";
    ctx.fill();

    ctx.restore();

	ctx.save(); //added

  //for the player itself

    ctx.fillStyle = "red"; //changed
    ctx.fillRect(player.x, player.y, player.width, player.height);

    //ctx.fill();

	ctx.restore();



	//end add Player



    requestAnimationFrame(scrollTerrain);

}//end scrollTerrain

function colCheck(shapeA, shapeB)
{
    // get the vectors to check against
    var vX = (shapeA.x + (shapeA.width / 2)) - (shapeB.x + (shapeB.width / 2)),
        vY = (shapeA.y + (shapeA.height / 2)) - (shapeB.y + (shapeB.height / 2)),
        // add the half widths and half heights of the objects
        hWidths = (shapeA.width / 2) + (shapeB.width / 2),
        hHeights = (shapeA.height / 2) + (shapeB.height / 2),
        colDir = null;

    // if the x and y vector are less than the half width or half height, they we must be inside the object, causing a collision
    if (Math.abs(vX) < hWidths && Math.abs(vY) < hHeights)
    {
        // figures out on which side we are colliding (top, bottom, left, or right)
        var oX = hWidths - Math.abs(vX),
            oY = hHeights - Math.abs(vY);
        if (oX >= oY) {
            if (vY > 0) {
                colDir = "t";
                shapeA.y += oY;
            } else {
                colDir = "b";
                shapeA.y -= oY;
            }
        } else {
            if (vX > 0) {
                colDir = "l";
                shapeA.x += oX;
            } else {
                colDir = "r";
                shapeA.x -= oX;
            }
        }
    }
    return colDir;
}

function grappleHook(pY, pX, theRadius)
{
	var distX = Math.sqrt((theRadius*theRadius) + (theRadius*theRadius));
	var finalX = player.x + distX;
	var midpoint = finalX - (distX/2);

/*
	console.log("x: ", player.x);
	console.log("y: ", player.y);

	console.log("finalX: ",finalX);
	console.log("finalY: ", finalY);

	console.log("difference in X: ", finalX-player.x);
	console.log(theRadius);
*/
/*
  //NOW MOVE BLOCK TO THIS COORDINATE
  player.velX+=1;
  player.velY++;
*/
    	ctx.save();
      ctx.beginPath();
      ctx.lineWidth="5";
      ctx.strokeStyle = "black";
      ctx.moveTo(player.x, player.y);
      ctx.lineTo(pX, pY);
      ctx.stroke();
    	ctx.restore();

			//setTimeout(swingBaby, 500);	//500 milliseconds

/*
player.velX+= 0.1;
player.velY +=0.1;
*/

			//console.log("initialx: ", player.x)
			//console.log("final: ", finalX);

			while(player.x < finalX)
			{
				if(player.x < midpoint/2)
				{
					player.velY = 0.5;

				}
				else if(player.x < midpoint)
				{
					player.velY = 0.25;

				}
				else if(player.x < (midpoint*1.5))
				{
					player.velY = -0.25;

				}
				else
				{
					player.velY = -0.5;

				}


				//console.log("player:", player.x);
				if (player.velX < 2)
				{
        	player.velX += 0.5;
				}
				else {
					console.log(player.velX);
				}


				//?
				ctx.beginPath(); //start painting object red (?)

				//collision checks


				player.x += player.velX;
				player.y += player.velY;

				//IDK

				ctx.save();
				ctx.fillStyle="black";
				ctx.fill();
				ctx.restore();

				ctx.save(); //added
				//for the player itself
				ctx.fillStyle = "red"; //changed
				ctx.fillRect(player.x, player.y, player.width, player.height);
				//ctx.fill();
				ctx.restore();


			}//end while

			ctx.save();
      ctx.beginPath();
      ctx.lineWidth="5";
      ctx.strokeStyle = "black";
      ctx.moveTo(player.x, player.y);
      ctx.lineTo(pX, pY);
      ctx.stroke();
    	ctx.restore();

			player.velX = player.speed *2;
			player.velY = -player.speed * 5;






}


function shootHook()
{


  //do animation stuff here...
  //console.log("arctan: " ,Math.atan((player.y-(player.y-20))/(player.x+20 - player.x)));

  fired = true;

	ctx.save();
	ctx.beginPath();
	ctx.lineWidth="5";
	ctx.strokeStyle = "pink";
	ctx.moveTo(player.x, player.y);
	ctx.lineTo(player.x + 150, player.y - 150);
	ctx.stroke();
	ctx.restore();

  for (var i = 4; i < boxes.length; i++)
  {
      //ctx.rect(boxes[i].x, boxes[i].y, boxes[i].width, boxes[i].height);

        //console.log("perhaps there's a chance...");
        //get angle from player to the hook(or the box that the hook landed on)
        var radsToHook = Math.atan((player.y-boxes[i].y)/(boxes[i].x-player.x));
        var pY = boxes[i].y;
        var pX = boxes[i].x ;

        var distBet = Math.sqrt(
            Math.pow((player.y-boxes[i].y), 2) +
            Math.pow((boxes[i].x - player.x), 2));
        //make sure it's around 45 degrees

        if((radsToHook > 0.61) && (radsToHook < 0.96) && (boxes[i].x > player.x))
        {
          if(distBet < 150)
          {
            //console.log("Good dist: ", distBet);
            //console.log("CONNECT!!!!, cY: ",(boxes[i].y-player.y), " cX: ", boxes[i].x-player.x );
						hook.x = boxes[i].x;
						hook.y = boxes[i].y;
            grappleHook(pY, pX, distBet);
            break; //out of for loop
          }
          else {
            console.log("right angle, too far away!!!");
          }

        }
        else {
          //console.log("did not connect");

        }



  }//end for loop that checks each box


}//end shootHook()

/*
function rotate_point(pointX, pointY, originX, originY, angle)
{
    angle = angle * Math.PI / 180.0;

    return {
      x: Math.cos(angle) * (pointX-originX) - Math.sin(angle) * (pointY-originY) + originX,
      y: Math.sin(angle) * (pointX-originX) + Math.cos(angle) * (pointY-originY) + originY
    };
}
*/

function checkDeath()
{
  if((player.x > width) || (player.x < 0) || (player.y > height+50))
    isDead = true;


  if(isDead)
  {
    console.log("GAME OVER!");

    alert("game over");

    history.go(0);
  }


}

function checkWin()
{
  if((player.x > 2049) && (player.y > (height/2) - 10))
  {
    wonGame = true;
  }

  if(wonGame)
  {
    alert("CONGRATS, YOU WIN!");
  }

}
//END SCROLL TERRAIN




document.body.addEventListener("keydown", function (e) {
    keys[e.keyCode] = true;
});

document.body.addEventListener("keyup", function (e) {
    keys[e.keyCode] = false;
});


window.addEventListener("load", function ()
{
  //update();
	scrollTerrain();

});

window.addEventListener("keydown", function(e) {
    // space and arrow keys
    if([87, 65, 83, 68, 32, 16, 72].indexOf(e.keyCode) > -1)
		{
			//prevents browser window from scrolling up or down
        e.preventDefault();
    }


}, false);

function spamButtons()
{
	//spam the grappling hook AND move right:
	keys[72] = true;
	keys[68] = true;
}

/*THE FUNCTION THAT LETS THE AI PLAY THE GAME */
function playWithAI()
{
//BACKUP PLAN

	do
	{
		console.log("button: ",player.x);
		var getPX = player.x;
		var getPY = player.y;
		var closestBox = getAndSortBoxes(getPX, getPY);
		//console.log(closestBox);
		jumpToBox(closestBox.x, closestBox.y, getPX, getPY);



			//playWithAI();

	}while(isDead);


//better plan:
//get shortest path!













}//end play withAI

	//DOUBLE jump
function jumpAI()
{

	keys[87] = true;

	setTimeout(function(){keys[32] = true, keys[87] = false;}, 100);

	setTimeout(function(){keys[32] = false;}, 500);


}

function moveRightAI(distX)
{
	var numMS = distX/0.1193;


	var initX = player.x;
	var initY = player.y;

	keys[68] = true;
	setTimeout(function(){keys[68] = false; console.log("final player.x: ",player.x); console.log("final player.y: ", player.y);}, numMS);



}

function useGrappleHookAI()
{
	keys[72] = true;
	keys[68] = true;

	setTimeout(function(){keys[72] = false;}, 500);

	setTimeout(function(){keys[68] = false;}, 500);

}

//RETURNS CLOSEST BOX (X and Y VALUE)
function getAndSortBoxes(playerX, playerY)
{
	var boxesCopy= [];

	//IGNORE FIRST 4
	for(var ii = 4; ii < boxes.length; ii++)
	{
		//MAKE SURE IT'S EITHER BELOW OR WITHIN 65(90 DEGREE JUMP)
		if(((boxes[ii].x - 5) > playerX) && (playerY - boxes[ii].y < 65))
		{
			boxesCopy.push(boxes[ii]);
		}

	}//end for

	//NOW SORT
	/*==================================*/
	var sortedCopy = [];
	var closestBox = boxesCopy[0];

	closestBox = boxesCopy[0];

	for(var xx = 0; xx< boxesCopy.length; xx++)
	{
		if(boxesCopy[xx].x < closestBox.x)
		{
			closestBox = boxesCopy[xx];
		}
	}

	//now we have the closestBox
	return closestBox;


}//end getAllBoxes

function jumpToBox(destX, destY, originX, originY)
{
	var deltaY = (originY - destY);
	var deltaX = (destX - originX);
	var hypot = Math.sqrt(Math.pow(originX - destX, 2) + Math.pow((originY - destY), 2));
	var angleRads = Math.atan(deltaY/deltaX);
	var angleDeg = angleRads * (180/Math.PI);

	//first: find if box is ABOVE or BELOW
	if(destY-originY < 0)
	{
		//ABOVE
		//console.log("ABOVE...deg:",angleDeg);
		//console.log("deltaX",deltaX);
		if(angleDeg > 60)
		{
			jumpAI();
			moveRightAI(22);

		}
		else if(angleDeg >30)
		{
			jumpAI();
			moveRightAI(45);

		}
		else if(angleDeg >20)
		{
			//console.log("FAR JUMP!!!");
			jumpAI();
			moveRightAI(90);
			//added
			useGrappleHookAI();

		}
		else
		{
			//console.log("hypot",hypot);
			if(hypot <= 250)
			{
			//USE GRAPPLING HOOK!!!
				//console.log("GRAPPLE TIME!");
				jumpAI();
				useGrappleHookAI();
			}
			else
			{
					jumpAI();
					moveRightAI(90);
					useGrappleHookAI();

			}

		}

	}//end if above
	else
	{
		//BELOW
		//console.log("BELOW...deg:",angleDeg);
		//console.log("deltaX",deltaX);
		jumpAI();
		moveRightAI(75);

	}



}

function AIObstacleCourse()
{
	while(boxes.length > 4)
	{
		boxes.pop();

	}
	//now we have empty field

	for (var i = 1; i < 40; i+=1)
  {
    var num_w = (Math.random() * 2000) + 10;
    var num_h = (Math.random() * 300) + 200;

    boxes.push({
      x: num_w,
      y: num_h,
      width: 30,
      height: 10
    });

    //console.log(boxes[i]["x"]);

  }//end for

}
