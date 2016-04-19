###BlockJump!

##DIRECTIONS

Objective: Get to the other side of the map (to the L-shaped platform) without falling to your death!

Controls:

W,A,S,D : movement (w to jump)

space bar : double jump!

h : grapple to a block above and to the right of your player to swing around and up

shift: reset the platforms. The more you do this, the less platforms will appear each turn!

Warning: The platforms disappear every 5-10 or so seconds, so try to stay near the top of the map

##BLUEPRINT

I had planned to do a sidescroller game with a player that shot enemies, but that seemed too much like other games (Mario, Sonic, etc), so instead I decided to keep my game simple, yet semi-unique. I wanted to make a game where you simply traversed an obstacle course in which blocks would dissapear and reappear in the matter of seconds, armed with only the abilities to jump and use your grappling hook.

##How

I used a lot of basic trigonometry and physics to calculate speed, velocity, angles, distances and the like in order to do things like use the grappling hook. I used an random-number generating algorithm to draw the "landscape" in the background.

##Final Result

I did meet my final goal to have a fully functioning, unique game. I am pleased with what I have done, but I know that there is always room for improvement.

##With More Time, 

I would definately make the game prettier. It looks a little too bare-bones, but the GUI was the most difficult part for me. The functional elements of the project weren't too challenging, but getting everything to appear the way that I wanted to was a hastle.

##5 Bullet Summary

* Implemented a game in Javascript/CSS where you control a block and move with keyboard commands and a grappling hook.

* Used a lot of trig properties (cosine, arctangent, etc.) and physics formulas (formula for velocity, acceleration, force due to gravity, etc.)

* Gave the user the ability to reset the playing field at a cost of less manuverability.

* Worked with many APIs during testing (for example, the CreateJS and EaselJS APIs).

* Efficiently handled collisions between many objects in such a short amount of time.

