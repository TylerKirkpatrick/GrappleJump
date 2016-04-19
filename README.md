#BlockJump!

##DIRECTIONS

Objective: Get to the other side of the map (to the L-shaped platform) without falling to your death!

Controls:

W,A,S,D : movement (w to jump)

space bar : double jump!

h : grapple to a block above and to the right of your player to swing around and up

shift: reset the platforms. The more you do this, the less platforms will appear each turn!

Warning: The platforms disappear every 10 or so seconds, so try to stay near the top of the map


##Details

I used a lot of basic trigonometry and physics to calculate speed, velocity, angles, distances and the like in order to do things like use the grappling hook. I used an random-number generating algorithm to draw the "landscape" in the background and the platforms.

I am currently improving the AI to a point where it can beat the game. The final code for this will be inside of the "blockAI.js" file once finished. I have a very barebones version at the bottom of "gameCode.js" used mostly for testing.



