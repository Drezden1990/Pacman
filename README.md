# Pacman
A javascript, three.js version of Pacman done for my Aritifical Intelligence module in third year of Computer Applications, DCU.


/////////////////////////////////////////////////////////////////////////////////////////////////
/*

---------
Features:
---------

Above Game Screen Section:
--------------------------
Contains Pacmans current Lives and total points.
A message is printed out here when a pacman loses all lives to 

Teleport:
----------
If you go off the grid at any of the two "exit points" at the top of the screen you appear 
at the bottom of the screen and vice versa for the bottom exit points.


Ghost Killer
-----------
When pacman moves onto a location contain a special dot ( a special dot is the white dots )
he is able to kill the ghosts for 5 seconds and gains a 100 point bonus for each ghost he kills
during that time. Music plays for that 5 seconds allowing you to know when you can kill the ghosts
and when it returns to the original way of ghosts killing pacman.




Sound:
-----
I used the theme tune from the tv show 'Stranger Things' to add an eerie affect to the 
game, since it's pacman in space.

Used the traditional pacman sounds for chomping pellets, death of pacman, death of ghosts, and 

When you win the game the sound played is an homage to a game from the 90's, final fantasy.


Level:
-----
# represents wired blocks which make up the maze itself
. represents regular pellets
- represents special dots/pellets which 
/ represents our agent

I used an array of the above items to initialize the level itself. 

= I wanted to design the level as an actual maze so it wouldn't be straight forward to
collect all the pellets. It added some difficulty for the human player. 
This is especially the case in a couple of areas where there's only one way to go in and out, 
making it easier for our enemy agents to close in on the human player and block off any possible exit.

= With three enemy agents on the screen they close in on you very fast. This also adds to the level of difficulty for
the human player. 



Aditional Features that could be added (not added due to time constraints):
---------------------------------------------------------------------------
- each enemy has a set path which they traverse but on each step, they check to see if the
agent is within X steps of them, i.e. within a certain range of them. 
if the agent is within their range try to kill him. If the agent goes outside the range of sight, return 
to set path.
- animations:
    - chomping pacman
    - animation for pacman dieing
- Change colour of ghosts during ghost killer mode
- Fixed camera position - a position in which all of the maze is always visible without having to
orient the camera in any way while playing.
- Additional Levels
    - possible level random selection
    - incremental levels, each new level would become more difficult


Limitations
------------
- I wanted to have a singular method for drawing an enemy. I couldn't get it working in Three.js 
so I used separate methods for drawing each enemy. This is inefficient code re-use and something 
I will figure out eventually.

*/
////////////////////////////////////////////////////////////////////////////////////////////////
