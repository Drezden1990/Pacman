







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


Note:
-----
Pacman and agent referenced interchangeably, they are the same thing. Same for pellet and dot. 
My apologies for that.

*/
////////////////////////////////////////////////////////////////////////////////////////////////







// World must define these:
 
const	 	CLOCKTICK 	= 100;			// speed of run - move things every n milliseconds, lower faster
const		MAXSTEPS 	= 10000;			// length of a run before final score
 


// -- constants for normal or special pellets to be added to screen
const NORMAL = true;
const SPECIAL = false;



//---- global constants: -------------------------------------------------------

const gridsize = 20;						// number of squares along side of world	   

		// density of maze - number of internal boxes
		// (bug) use trunc or can get a non-integer 

const squaresize = 100;					// size of square in pixels
const MAXPOS = gridsize * squaresize;		// length of one side in pixels 

const sphereRadius = 50;
const sphereHeight = 10;
const sphereWidth = 10;

const pelletRadius = 10;

const SKYCOLOR 	= 0xddffdd;				// a number, not a string 
const BLANKCOLOR 	= SKYCOLOR ;			// make objects this color until texture arrives (from asynchronous file read)




const show3d = true;						// Switch between 3d and 2d view (both using Three.js) 
 
 // ********** originally = 0.8 ***************//
const startRadiusConst	 	= MAXPOS * 0.8 ;		// distance from centre to start the camera at


// it's an illusion, if you zoom out you see theat the skybox is just a container and outside of that is nothing
const skyboxConst			= MAXPOS * 3 ;		// where to put skybox 
const maxRadiusConst 		= MAXPOS * 8 ;		// maximum distance from camera we will render things  





//--- Mind can pick one of these actions -----------------

const ACTION_LEFT 		= 0;		   
const ACTION_RIGHT 		= 1;
const ACTION_UP 			= 2;		 
const ACTION_DOWN 		= 3;
const ACTION_STAYSTILL 		= 4;

// in initial view, (smaller-larger) on i axis is aligned with (left-right)
// in initial view, (smaller-larger) on j axis is aligned with (away from you - towards you)



// contents of a grid square

const GRID_BLANK 	= 0;
const GRID_WALL 	= 1;
const GRID_MAZE 	= 2;
 
 
 

 
 // keyword self used for a private function to call a public function self.functionName()
 




 
// --- some useful random functions  -------------------------------------------


function randomfloatAtoB ( A, B )			 
{
 return ( A + ( Math.random() * (B-A) ) );
}

function randomintAtoB ( A, B )			 
{
 return  ( Math.round ( randomfloatAtoB ( A, B ) ) );
}
  
function randomBoolean()			 
{
 if ( Math.random() < 0.5 ) { return false; }
 else { return true; }
}







//---- start of World class -------------------------------------------------------
 
function World() { 



 var LEVEL = [
     '# # # # # . # # # # # # # # # # # . # #', // 1
     '# . # # # . # . . . # . . . . . . . . #', // 2
     '# . # # # . # # . # # . . . # # . . . #', // 3
     '# - . . . . . . ? . . . # # # # . . - #', // 4
     '# . # # . . # # # # # . # # # # . # . #', // 5
     '# . # # . . # . . # # . . . . . . # . #', // 6
     '# . # # . . # . . # # . # # # # . # # #', // 7
     '# . . # . . # . . # # . . # . . . # # #', // 8
     '# . . . . . . . . . # . # # . . . # # #', // 9
     '# . # # . . . . . . # . . # . . # # # #', // 10
     '# . # . # . . . . # # . . . . . . # . #', // 11
     '# . . . . . . . . . . . . . . . . . . #', // 12
     '# # . # # # # . . . # # . # # . . . . #', // 13
     '# . . . . . . . . # # . . . . . # . . #', // 14
     '# . # . . # . . . . . . . . . . . . . #', // 15
     '# - . . . # . . . # . . . # # . . . - #', // 16
     '# . # . . # # # . # . . . # # # . . . #', // 17
     '# # # . . . # . . # . . # . # # . . . #', // 18
     '# / . . # . . . . . . . . . . . . . # #', // 19
     '# # # # # . # # # # # # # # # # # . # #'  // 20
     
     ];
     

var numPellets = 0;    // counts the number of pellet objects on the screen, used for removal of pellets



var BOXHEIGHT;		// 3d or 2d box height 


var GRID 	= new Array(gridsize);			// can query GRID about whether squares are occupied, will in fact be initialised as a 2D array   
var theagent, theenemy, theenemy2, theenemy3;
  

// enemy and agent position on squares
var ei, ej, ai, aj, e2i, e2j, e3i, e3j;


var step;

var lives; // number of lives pacman has left
var myScore; // current score
var self = this;						// needed for private fn to call public fn - see below  

var encounter = false;  // when pacman and the enemy objects occupy the same space, encounter = true

var ghostKiller = false; // true if pacman is able to kill the ghosts
 


// regular "function" syntax means private functions:


function initGrid()
{
 for (var i = 0; i < gridsize ; i++) 
 {
  GRID[i] = new Array(gridsize);		// each element is an array 

  for (var j = 0; j < gridsize ; j++) 
  {
   GRID[i][j] = GRID_BLANK ;
  }
 }
}



function occupied ( i, j )		// is this square occupied
{
 
 if ( GRID[i][j] == GRID_WALL ) return true;		// fixed objects, walls and stones	 
 if ( GRID[i][j] == GRID_MAZE ) return true;		 
	 
 return false;
}


function occupiedByPellet(i, j) {

    if (GRID[i][j] != GRID_MAZE && GRID[i][j] != GRID_BLANK && !isSpecialPellet(i, j) ) {
        // increase score
        myScore += 10;
      
        // remove the pellet from screen
        threeworld.scene.remove(GRID[i][j]);
     
        GRID[i][j] = GRID_BLANK;
         
        // pacman chomps pellet sound
        playPelletSound();
          
        
        numPellets--;   // decrease pellet counter
       
    } else if (isSpecialPellet(i, j)) {         // start of ghost killer mode if true
        
        ghostKiller = true;
        playIntermissionSound();
        threeworld.scene.remove(GRID[i][j]);
        GRID[i][j] = GRID_BLANK;
        numPellets--;
        
        window.setTimeout(slowAlert, 5000); // after 5 seconds pacman can no longer kill ghosts
         
    }
    
 
    
 
}

function slowAlert() {
    ghostKiller = false;
}


function occupiedByPlayerEnemy() {
    if ( ( ei == ai ) && ( ej == aj )  || ((e2i == ai) && (e2j == aj))
        || ((e3i == ai) && (e3j == aj))) {
        encounter = true;
        
    } 	
}



// returns true if the positioned pacman moved onto
// contains a special pellet
function isSpecialPellet(i, j) {
    if (GRID[i][j] == GRID_BLANK) {
        return false;
    } else if ((i == 1 && (j == 15 || j == 3)) ||       // positions of special dots
              (i == 18 && (j == 3 || j == 15)) )  {
        return true;
    }
    return false;
}


 
// logically, coordinates are: y=0, x and z all positive (no negative)    
// logically my dimensions are all positive 0 to MAXPOS
// to centre everything on origin, subtract (MAXPOS/2) from all dimensions 

function translate ( x ) 
{
 return ( x - ( MAXPOS/2 ) );
}





//--- skybox ----------------------------------------------------------------------------------------------


function initSkybox() 
{

// x,y,z positive and negative faces have to be in certain order in the array 
 
// mountain skybox, credit:
// http://stemkoski.github.io/Three.js/Skybox.html

var materialArray = [
 	( new THREE.MeshBasicMaterial ( { map: THREE.ImageUtils.loadTexture( "/uploads/humphrys/sky_pos_z.jpg" ), side: THREE.BackSide } ) ),
 	( new THREE.MeshBasicMaterial ( { map: THREE.ImageUtils.loadTexture( "/uploads/humphrys/sky_neg_z.jpg" ), side: THREE.BackSide } ) ),
 	( new THREE.MeshBasicMaterial ( { map: THREE.ImageUtils.loadTexture( "/uploads/humphrys/sky_pos_y.jpg" ), side: THREE.BackSide } ) ),
 	( new THREE.MeshBasicMaterial ( { map: THREE.ImageUtils.loadTexture( "/uploads/humphrys/sky_neg_y.jpg" ), side: THREE.BackSide } ) ),
 	( new THREE.MeshBasicMaterial ( { map: THREE.ImageUtils.loadTexture( "/uploads/humphrys/sky_pos_x.jpg" ), side: THREE.BackSide } ) ),
 	( new THREE.MeshBasicMaterial ( { map: THREE.ImageUtils.loadTexture( "/uploads/humphrys/sky_neg_x.jpg" ), side: THREE.BackSide } ) ),
 	];
 	
  var skyGeometry = new THREE.CubeGeometry ( skyboxConst, skyboxConst, skyboxConst );	
  var skyMaterial = new THREE.MeshFaceMaterial ( materialArray );
  var theskybox = new THREE.Mesh ( skyGeometry, skyMaterial );
  threeworld.scene.add( theskybox );						// We are inside a giant cube
}


// This does the file read the old way using loadTexture.
// (todo) Change to asynchronous TextureLoader. A bit complex:
// Make blank skybox. Start 6 asynch file loads to call 6 return functions.
// Each return function checks if all 6 loaded yet. Once all 6 loaded, paint the skybox.		 


 






function loadTextures()
{

 var loader1 = new THREE.TextureLoader();
 loader1.load ( '/uploads/humphrys/door.jpg',		function ( thetexture ) {			 
		thetexture.minFilter = THREE.LinearFilter;
		paintWalls ( new THREE.MeshBasicMaterial( { map: thetexture } ) );
	} ); 


 var loader3 = new THREE.TextureLoader();
 loader3.load ( '/uploads/humphrys/pacman.jpg',	function ( thetexture ) {			 
		thetexture.minFilter = THREE.LinearFilter;
		theagent.material =  new THREE.MeshBasicMaterial( { map: thetexture } );
	} ); 

 var loader4 = new THREE.TextureLoader();
 loader4.load ( '/uploads/humphrys/ghost.3.png',	function ( thetexture ) {			 
		thetexture.minFilter = THREE.LinearFilter;
		theenemy.material =  new THREE.MeshBasicMaterial( { map: thetexture } );
	} ); 
	
	
	// ghost 2
  var loader5 = new THREE.TextureLoader();
 loader5.load ( '/uploads/humphrys/ghost.3.png',	function ( thetexture ) {			 
		thetexture.minFilter = THREE.LinearFilter;
		theenemy2.material =  new THREE.MeshBasicMaterial( { map: thetexture } );
	} ); 
	
	
	 var loader6 = new THREE.TextureLoader();
 loader5.load ( '/uploads/humphrys/ghost.3.png',	function ( thetexture ) {			 
		thetexture.minFilter = THREE.LinearFilter;
		theenemy3.material =  new THREE.MeshBasicMaterial( { map: thetexture } );
	} ); 


}


 


// --- add fixed objects ---------------------------------------- 
   



// creates a wireframe block 
function createBlock() {
    var shape    = new THREE.CubeGeometry( squaresize, BOXHEIGHT, squaresize );
    var material = new THREE.MeshBasicMaterial( {color: 'red', wireframe: true} );
  	var cube  = new THREE.Mesh( shape, material );
  
  	return cube;
    
}


// creates a pellet for pacman to chomp
function createPellet(whichPellet) {
    var shape;
    var material;
    
    if (whichPellet == NORMAL) {
        shape = new THREE.SphereGeometry( pelletRadius, sphereHeight, sphereWidth);
        material = new THREE.MeshBasicMaterial({color: "yellow"});
    } else if (whichPellet == SPECIAL) {
         shape = new THREE.SphereGeometry( pelletRadius + 10, sphereHeight + 10, sphereWidth + 10);
        material = new THREE.MeshBasicMaterial({color: "white"});
    }
    var pellet = new THREE.Mesh(shape, material);
    
    return pellet;
}







// --- enemy functions -----------------------------------



function drawEnemy(iValue, jValue, enemyObj)	// given ei, ej, draw it 
{
 theenemy.position.set(translate ( iValue * squaresize ), 0, translate ( jValue * squaresize ) ); 
 threeworld.scene.add(theenemy);
}



function drawEnemy2(iValue, jValue)	// given ei, ej, draw it 
{
 theenemy2.position.set(translate ( e2i * squaresize ), 0, translate ( e2j * squaresize ) ); 
 threeworld.scene.add(theenemy2);
}

function drawEnemy3(iValue, jValue) {
 theenemy3.position.set(translate ( e3i * squaresize ), 0, translate ( e3j * squaresize ) ); 
 threeworld.scene.add(theenemy3);
}
 

function initThreeEnemy()
{
 var shape    = new THREE.SphereGeometry( sphereRadius, sphereHeight, sphereWidth );			 
 theenemy = new THREE.Mesh( shape );
 theenemy.material.color.setHex( BLANKCOLOR  );	
 drawEnemy(ei, ej, theenemy);		  
}

function initThreeEnemy2()
{
 var shape    = new THREE.SphereGeometry( sphereRadius, sphereHeight, sphereWidth );			 
 theenemy2 = new THREE.Mesh( shape );
 theenemy2.material.color.setHex( BLANKCOLOR  );	
 drawEnemy2();		  
}


function initThreeEnemy3() 
{
    var shape    = new THREE.SphereGeometry( sphereRadius, sphereHeight, sphereWidth );			 
 theenemy3 = new THREE.Mesh( shape );
 theenemy3.material.color.setHex( BLANKCOLOR  );	
 drawEnemy3();	
}

function moveLogicalEnemy(eiValue, ejValue )
{ 
// move towards agent 
// put some randomness in so it won't get stuck with barriers 

 var i, j;
 
 if ( ei < ai ) i = randomintAtoB(ei, ei+1); 
 if ( ei == ai ) i = ei; 
 if ( ei > ai ) i = randomintAtoB(ei-1, ei); 

 if ( ej < aj ) j = randomintAtoB(ej, ej+1); 
 if ( ej == aj ) j = ej; 
 if ( ej > aj ) j = randomintAtoB(ej-1, ej); 
 
 if ( ! occupied(i,j) )  	// if no obstacle then move, else just miss a turn
 {
  ei = i;
  ej = j;
 }
 
 occupiedByPlayerEnemy(i, j); 
}


function moveLogicalEnemy2()
{ 
// move towards agent 
// put some randomness in so it won't get stuck with barriers 

 var i, j;
 

 
 if ( e2i < ai ) i = randomintAtoB(e2i, e2i+1); 
 if ( e2i == ai ) i = e2i; 
 if ( e2i > ai ) i = randomintAtoB(e2i-1, e2i); 

 if ( e2j < aj ) j = randomintAtoB(e2j, e2j+1); 
 if ( e2j == aj ) j = e2j; 
 if ( e2j > aj ) j = randomintAtoB(e2j-1, e2j); 
 
 if ( ! occupied(i,j) )  	// if no obstacle then move, else just miss a turn
 {
  e2i = i;
  e2j = j;
 }
 
 occupiedByPlayerEnemy(i, j);  
 
}


function moveLogicalEnemy3()
{ 
// move towards agent 
// put some randomness in so it won't get stuck with barriers 

 var i, j;
 

 
 if ( e3i < ai ) i = randomintAtoB(e3i, e3i+1); 
 if ( e3i == ai ) i = e3i; 
 if ( e3i > ai ) i = randomintAtoB(e3i-1, e3i); 

 if ( e3j < aj ) j = randomintAtoB(e3j, e3j+1); 
 if ( e3j == aj ) j = e3j; 
 if ( e3j > aj ) j = randomintAtoB(e3j-1, e3j); 
 
 if ( ! occupied(i,j) )  	// if no obstacle then move, else just miss a turn
 {
  e3i = i;
  e3j = j;
 }
 
 occupiedByPlayerEnemy(i, j);  
 
}



// --- agent functions -----------------------------------


function drawAgent()	// given ai, aj, draw it 
{

 theagent.position.set(translate ( ai * squaresize ), 0, translate ( aj * squaresize ) ); 
 threeworld.scene.add(theagent);

 threeworld.follow.copy ( theagent.position );		// follow vector = agent position (for camera following agent)
}



function initThreeAgent()
{
 var shape    = new THREE.SphereGeometry( sphereRadius, sphereHeight, sphereWidth );			 
 theagent = new THREE.Mesh( shape );
 theagent.material.color.setHex( BLANKCOLOR );	
 drawAgent(); 		  
}


function moveLogicalAgent( a )			// this is called by the infrastructure that gets action a from the Mind 
{ 
 var i = ai;
 var j = aj;		 

      if ( a == ACTION_LEFT ) 	i--;
 else if ( a == ACTION_RIGHT ) 	i++;
 else if ( a == ACTION_UP ) 		j++;
 else if ( a == ACTION_DOWN ) 	j--;

 if ( ! occupied(i,j) ) 
 {
     if (i == 5 && j == 20) {
        i = 5; j = 0;
     } else if (i == 5 && j == -1) {
         i = 5; j = 19;
     } else if (i == 17 && j == 20) {
         i = 17; j = 0;
     } else if (i == 17 &&  j == -1) {
         i = 17; j = 19;
     }
  ai = i;
  aj = j;
 }
 
 // death of player
 occupiedByPlayerEnemy(i, j);
 
 
 // occupied by a pellet
 occupiedByPellet(i, j);
 
}




function keyHandler(e)		
// user control 
// Note that this.takeAction(a) is constantly running at same time, redrawing the screen.
{
    if (e.keyCode == 37)  moveLogicalAgent ( ACTION_LEFT 	);
    if (e.keyCode == 38)  moveLogicalAgent ( ACTION_DOWN  	);
    if (e.keyCode == 39)  moveLogicalAgent ( ACTION_RIGHT 	);
    if (e.keyCode == 40)  moveLogicalAgent ( ACTION_UP	);
}


//////////////////// TO BE DELETED   //////////////////// //////////////////// 

function badstep()			// is the enemy within one square of the agent
{
 if ( ( Math.abs(ei - ai) < 2 ) && ( Math.abs(ej - aj) < 2 ) ) return true;
 else return false;
}


//////////////////// //////////////////// //////////////////// //////////////////// 



function updateStatusBefore(a)
// this is called before anyone has moved on this step, agent has just proposed an action
// update status to show old state and proposed move 
{
 var x = self.getState();

 $("#user_span3").html( status );
}


function   updateStatusAfter()		// agent and enemy have moved, can calculate score
{
 var status = "Lives " + lives + "&nbsp;&nbsp;&nbsp;Points: " + myScore + "&nbsp;&nbsp;&nbsp;";
 $("#user_span7").html( status );
}






//--- public functions / interface / API ----------------------------------------------------------


	this.endCondition;			// If set to true, run will end. 



this.newRun = function() 
{

// (subtle bug) must reset variables like these inside newRun (in case do multiple runs)

  this.endCondition = false;

  step = 0;
  myScore = 0;
  lives = 3;


 // for all runs:

 	initGrid();
 	setStartingPositions(); // sets starting positions of human and agents
 	

 // for graphical runs only:

  if ( THREE_RUN  )
  {
	if ( show3d )
	{
	 BOXHEIGHT = squaresize;
	 threeworld.init3d ( startRadiusConst, maxRadiusConst, SKYCOLOR  ); 	
	}	     
	else
	{
	 BOXHEIGHT = 1;
	 threeworld.init2d ( startRadiusConst, maxRadiusConst, SKYCOLOR  ); 		     
	}

	initSkybox();
 	initMusic();

	// Set up objects first:
	
	
	initThreeAgent();


	setUpLevel();
	
	initThreeEnemy();
	initThreeEnemy2();
	initThreeEnemy3();
	

	// Then paint them with textures - asynchronous load of textures from files. 
	// The texture file loads return at some unknown future time in some unknown order.
	// Because of the unknown order, it is probably best to make objects first and later paint them, rather than have the objects made when the file reads return.
	// It is safe to paint objects in random order, but might not be safe to create objects in random order. 

	loadTextures();	

	document.onkeydown = keyHandler;	 
  }
  
 

};



function setUpLevel() {
    
    for (var row = 0; row < gridsize ; row++) { 
            var y = row;
       
       
        for (var column = 0; column < LEVEL[row].length; column += 2)  {
        
            var cell = LEVEL[row][column];
            var x = Math.floor(column / 2);
            
            switch ( cell  ) {
                case "#": {                             // adds a wireframe block to the screen
                    var object = createBlock();
	                GRID[x][row] = GRID_MAZE;
	                object.position.set(translate ( x * squaresize ), 0, translate ( row * squaresize ) ); 
 	                threeworld.scene.add(object);
 	                break;
                } case ".":  {                         // adds a pellet to the screen
                
            	    var pellet = createPellet(true);
            	    GRID[x][row]= pellet;
            	    numPellets++;
            	    pellet.position.set(translate ( x * squaresize ), 0, translate ( row * squaresize ) ); 
 	                threeworld.scene.add(pellet); 
            	    
            	    break;
            	} case "-": {                           // adds a special dot to the screen
            	   var specialDot = createPellet(false);
            	    GRID[x][row]= specialDot;
            	    numPellets++;
            	    specialDot.position.set(translate ( x * squaresize ), 0, translate ( row * squaresize ) ); 
 	                threeworld.scene.add(specialDot); 
            	    break;
            	}
            	    
            }
          
            
        } 
    } 
    
}


///// ///// /////  ///// POSITION BASED METHODS ///// ///// ///// ///// ///// 

// resets all enemies and human agent to original positions
function restartPositions() {
	setStartingPositions();
	drawAgent();
	drawEnemy(ei, ej, theenemy);
	drawEnemy2();
	drawEnemy3();
}


// sets starting positions 
function setStartingPositions() {
    ai = 1; aj = 18;        // agent starting position
	ei = 18; ej = 2;        // enemy1 starting position
	e2i = 1; e2j = 2;       // enemy2 starting position
	e3i = 17; e3j = 18;     // enemy3 starting position
}

function resetGhostPosition() {
    if (ai == ei && aj == ej) {
        ei = 18; ej = 2;
        drawEnemy();
    } else if (ai == e2i && aj == e2j) {
        e2i = 1; e2j = 2;
        drawEnemy2();
    } else if (ai == e3i && aj == e3j) {
        e3i = 17; e3j = 18;
        drawEnemy3();
    }
}


////////// ///// ///// ///// ///// END POSITION METHODS ///// ///// ///// ///// /////



this.getState = function()
{
 var x = [ ai, aj, ei, ej ];
  return ( x );  
};



this.takeAction = function ( a )
{
  step++;
  
  

  if ( THREE_RUN  )
     updateStatusBefore(a);			// show status line before moves 

  moveLogicalAgent(a);

  if ( ( step % 2 ) == 0 ) {		// slow the enemy down to every nth step
    moveLogicalEnemy(ei,ej);
    moveLogicalEnemy2();
    moveLogicalEnemy3();
  }


  if ( THREE_RUN  )
  {
   drawAgent();
   drawEnemy(ei, ej, theenemy);
   drawEnemy2();
   drawEnemy3();
   
   updateStatusAfter();			// show status line after moves  
  }
  
  pacmanGhostEncounters(); // handles all pacman and enemy agent encounters

  if ( lives == 0 )			// if agent blocked in, run over 
  {
	this.endCondition = true;
	
  	if ( THREE_RUN  )
  	{
//	 musicPause();
	 soundAlarm();
	}
  } else if (numPellets == 0) {
      this.endCondition = true;
      playWinGameSound();
  }

};





this.endRun = function()
{
 if ( THREE_RUN  )
 {

  
  // player loses condition
  if ( this.endCondition && numPellets != 0 )
    $("#user_span6").html( "<font color=red> <B>Game Over - No Lives Remaining! Final score:  </B>" + myScore  + "<BR> </font>   "  );
  else if (this.endCondition && numPellets == 0) {   
    $("#user_span6").html( "<font color=blue> <B> You won the game, congrats!! Final score:  </B>" + myScore  + "<BR> </font>   "  );
  } // player has won the game

 }
};


function pacmanGhostEncounters() {
    
     // enemy and pacman on same position -> death of pacman, restart positions of all
   if (encounter == true && ghostKiller == false) {
       lives--;
    
       // do animations, slow time, and play sound (animations and slow time to be added)
       playDeathSound();
       
       // death();
       encounter = false;
   
       // restarts all ai and human to original positions.
       restartPositions();
   } else if (encounter == true && ghostKiller == true) {           // in the event of ghost killer mode
                                                            // an encounter with pacman kills the ghost
       resetGhostPosition();
       myScore += 100;
       playGhostKilledSound(); 
       encounter = false;
   }
    
}



}

//---- end of World class -------------------------------------------------------








// --- music and sound effects ----------------------------------------



function initMusic()
{
	// put music element in one of the spans
 	var x = "<audio  id=theaudio  src=/uploads/SimonLowry/strangerthingsthemeorchestralcover.mp3   autoplay loop> </audio>" ;
  	$("#user_span2").html( x ); 
 
  /*	var x = "<audio  id=theaudio  src=/uploads/humphrys/Defense.Line.mp3   autoplay loop> </audio>" ;
  	$("#user_span1").html( x ); */
} 
 

function musicPlay()  
{
	// jQuery does not seem to parse pause() etc. so find the element the old way:
 	document.getElementById('theaudio').play();
}


function musicPause() 
{
 	document.getElementById('theaudio').pause();
}


function soundAlarm()
{
 	var x = "<audio    src=/uploads/humphrys/air.horn.mp3   autoplay  > </audio>";
  	$("#user_span2").html( x );
}





/***************************   MY SOUND SECTION   *************************/

function playPelletSound() {
    var x = "<audio  id=theaudio  src=/uploads/SimonLowry/pacman_chomp.mp3  autoplay > </audio>" ;
  	$("#user_span1").html( x ); 
    
}

function playDeathSound() {
    var x = "<audio  id=theaudio  src=/uploads/SimonLowry/pacman_death.mp3  autoplay > </audio>" ;
  	$("#user_span1").html( x ); 
}

function playWinGameSound(){
    var x = "<audio  id=theaudio  src=/uploads/SimonLowry/finalfantasyviicd1-nobuouematsu-11-fanfare.mp3  autoplay > </audio>" ;
  	$("#user_span2").html( x ); 
}

function playGhostKilledSound() {
    var x = "<audio  id=theaudio  src=/uploads/SimonLowry/pacman_eatghost.mp3  autoplay > </audio>" ;
  	$("#user_span4").html( x ); 
}

function playIntermissionSound() {
    
    var x = "<audio  id=theaudio  src=/uploads/SimonLowry/pacman_intermission.mp3  autoplay > </audio>" ;
  	$("#user_span5").html( x ); 
    
}


function playExtraPacmanSound() {
     var x = "<audio  id=theaudio  src=/uploads/SimonLowry/pacman_extrapac.mp3  autoplay > </audio>" ;
  	$("#user_span1").html( x ); 
}



/***************************  END SOUND SECTION   *************************/
