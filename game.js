// Initialize game canvas and context
var canvas = document.createElement("canvas");
canvas.width = 800;
canvas.height = 600;
var ctx = canvas.getContext("2d");

// Apply inline styles to position the canvas
canvas.style.position = "absolute";
canvas.style.width = "537px";
canvas.style.height = "487px";
canvas.style.left = "531px";
canvas.style.top = "205px";

document.querySelector(".game-container").appendChild(canvas);

// Load background image
var img = new Image();
img.onload = function() {
    // Once the background image is loaded, start loading the character image
    characterImg.src = 'characterside-down.png'; // Start loading the character image
};
img.src = 'world.png'; // Replace 'world.png' with the path to your background image file

// Define character size
var characterWidth = 50, characterHeight = 50; // Assign appropriate values

// Load character image
var characterImg = new Image();
characterImg.onload = function() {
    // Define new width and height for the character
    characterWidth = characterImg.width / 6; // Quarter the original width
    characterHeight = characterImg.height / 6; // Quarter the original height

    // Define initial character position
    characterX = canvas.width / 2 - characterWidth / 2; // Center horizontally
    characterY = canvas.height / 2 - characterHeight / 2; // Center vertically

    // Once the character image is loaded, start the game loop
    gameLoop();
};
characterImg.src = 'characterside-down.png';

// Load all character images
var characterImages = {
    'characterside-up': new Image(),
    'characterside-down': new Image(),
    'characterside-left': new Image(),
    'characterside-right': new Image()
};

characterImages['characterside-up'].src = 'characterside-up.png';
characterImages['characterside-down'].src = 'characterside-down.png';
characterImages['characterside-left'].src = 'characterside-left.png';
characterImages['characterside-right'].src = 'characterside-right.png';

// Define initial character position
var characterX = canvas.width / 2 - characterWidth / 2; // Center horizontally
var characterY = canvas.height / 2 - characterHeight / 2; // Center vertically

// Define initial character model
var characterModel = 'characterside-down'; // Assign a default character model

// Define camera right after your character definitions
var camera = {
    x: 0,
    y: 0,
    width: canvas.width,
    height: canvas.height,
    zoom: 2 // Increase for more zoom
};

// Main game loop
function gameLoop() {
    // Update game state
    handleMovement();

    // Update camera position to follow the character
    camera.x = characterX - canvas.width / 2 / camera.zoom;
    camera.y = characterY - canvas.height / 2 / camera.zoom;

    // Ensure camera doesn't go out of bounds
    camera.x = Math.max(0, Math.min(img.width - canvas.width / camera.zoom, camera.x));
    camera.y = Math.max(0, Math.min(img.height - canvas.height / camera.zoom, camera.y));

    // Render game world
    render();

    // Request next frame
    requestAnimationFrame(gameLoop);
}

// Render game world
function render() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background image onto canvas, adjusted for camera position and zoom
    ctx.drawImage(img, -camera.x * camera.zoom, -camera.y * camera.zoom, canvas.width * camera.zoom, canvas.height * camera.zoom);

    // Draw character image onto canvas with new width and height, adjusted for camera position and zoom
    var characterImage = characterImages[characterModel];
    ctx.drawImage(characterImage, (characterX - camera.x) * camera.zoom, (characterY - camera.y) * camera.zoom, characterWidth * camera.zoom, characterHeight * camera.zoom);
}

// Movement function based on arrow keys
// Create an object to keep track of which keys are being pressed
var keys = {};

// Listen for keydown and keyup events
window.addEventListener('keydown', function(event) {
    keys[event.key] = true;
});
window.addEventListener('keyup', function(event) {
    keys[event.key] = false;
});

// Define boundaries
var boundaries = [
    { left: -10, right: 810, top: 35, bottom: 600 }, // top water
    { left: 0, right: 43, top: 505, bottom: 600 }, // bottom left wall
    { left: 0, right: 140, top: 0, bottom: 55 }, //top left trees
    { left: 275, right: 800, top: 0, bottom: 55 }, // top trees to the right
    { left: 0, right: 230, top: 200, bottom: 280 }, // middle left house
    { left: 190, right: 230, top: 260, bottom: 300 }, // middle left house fence
    { left: 127, right: 290, top: 455, bottom: 525 },// middle left house fence lower
    { left: 150, right: 396, top: 430, bottom: 500 }, // bottom left house and fence
    { left: 150, right: 396, top: 430, bottom: 500 },// bottom left house and higher fence
    { left: 425, right: 450, top: 480, bottom: 481 },// bottom left house right fence
    { left: 445, right: 450, top: 480, bottom: 500 },// bottom left house right fence lower
    { left: 310, right: 330, top: 280, bottom: 275 }, // pond
    { left: 444, right: 444, top: 278, bottom: 249 }, // well - larger than i want
    { left: 560, right: 655, top: 0, bottom: 122 }, // top right house
    { left: 535, right: 655, top: 0, bottom: 80 }, // top right house - left tree
    { left: 710, right: 715, top: 0, bottom: 80 }, // top right house - right tree
    { left: 540, right: 590, top: 170, bottom: 171}, // top right house - right fence
    { left: 477, right: 478, top: 0, bottom: 145 }, // top right house - left fence
    { left: 512, right: 575, top: 171, bottom: 170 }, // top right house - left fence 2
    { left: 525, right: 600, top: 302, bottom: 375 }, // right brick house
    { left: 685, right: 800, top: 352, bottom: 400 }, // bottom right house
    { left: 0, right: 20, top: 465, bottom: 470, exit: true }, // exit area
    
    // Add more boundaries as needed
];


function handleMovement() {
    // Define movement speed
    var moveSpeed = 2;

    // Calculate new position
    var newX = characterX;
    var newY = characterY;
    if (keys["ArrowUp"]) {
        newY -= moveSpeed;
        characterModel = 'characterside-up';
    }
    if (keys["ArrowDown"]) {
        newY += moveSpeed;
        characterModel = 'characterside-down';
    }
    if (keys["ArrowLeft"]) {
        newX -= moveSpeed;
        characterModel = 'characterside-left';
    }
    if (keys["ArrowRight"]) {
        newX += moveSpeed;
        characterModel = 'characterside-right';
    }

    // Check overall boundary (first boundary in the array)
    var boundary = boundaries[0];
    if (newX < boundary.left || newX + characterWidth > boundary.right ||
        newY < boundary.top || newY + characterHeight > boundary.bottom) {
        // Out of overall boundary, don't move the character
        return;
    }

    // Check obstacle boundaries (all other boundaries in the array)
    for (var i = 1; i < boundaries.length; i++) {
        var boundary = boundaries[i];
        if (newX < boundary.right && newX + characterWidth > boundary.left &&
            newY < boundary.bottom && newY + characterHeight > boundary.top) {
            if (boundary.exit) {
                // Call the transition function
                setTimeout(loadSecondScript, 1000);
                transition();
                return; // Exit the loop once transition is triggered
            } else {
                // Inside an obstacle boundary, don't move the character
                return;
            }
        }
    }

    // Update character position if no boundaries are violated
    characterX = newX;
    characterY = newY;
}

function loadSecondScript() {
    var script = document.createElement('script');
    script.src = 'fighting.js'; // Replace 'fighting.js' with the path to your second JavaScript file

    // Append the script to the current HTML document
    document.body.appendChild(script);

    // Navigate to the new HTML file
    window.location.href = 'game.html';
}
/*
// Call the initGame function immediately after loading game.html
window.onload = function() {
    // Load game.html
    window.location.href = 'game.html';

    // Once game.html is loaded, call the initGame function from fighting.js
    initGame();
};

function startButton() {
	document.getElementById('startbutton').style.zIndex = '-1';
	document.getElementById('battle').style.visibility = 'visible';
	document.getElementById('opening').style.zIndex = '1';
	titlesfx.play();
	setTimeout(function() {
		titlesfx.pause();
		transition();
	}, 9000);
}

// Check if the current page URL contains "index.html"
if (!window.location.href.includes("game.html")) {
    // If it's not game.html, play the intro animation
    titlesfx.play();
    setTimeout(function() {
        titlesfx.pause();
        transition();
    }, 9000);
}

// Add an event listener to the "Run" button
document.getElementById('run').addEventListener('click', function() {
    // Redirect the user to index.html
    window.location.href = 'index.html';
});
*/
// Start the game loop
gameLoop();
