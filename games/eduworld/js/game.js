let scene, camera, renderer, controls;
let moveForward = false, moveBackward = false, moveLeft = false, moveRight = false;
let lookLeft = false, lookRight = false, lookUp = false, lookDown = false;
const speed = 0.1;
//let collidableObjects = [];
//const textureLoader = new THREE.TextureLoader();
window.collidableObjects = [];
window.textureLoader = new THREE.TextureLoader();

function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    
    controls = new THREE.PointerLockControls(camera, document.body);
    document.getElementById('startButton').addEventListener('click', () => {
        controls.lock();
        document.getElementById('startButton').style.display = 'none';
    });

    scene.add(controls.getObject());
    
    // Call functions from objetos.js
    addLighting();
    addFloor();
    addSchool();
    addBank();
    addHouse();
    addChairs();
    addTrees();
    addCars();
    addNPCs();
    addGiraffe();
    
    camera.position.y = 2;
    setupControls();
    setupJoystickControls();
    setupTouchControls();
    animate();
}


function checkCollisions(newPosition) {
    for (let obj of collidableObjects) {
        let distance = obj.position.distanceTo(newPosition);
        if (distance < 3) { 
            switch (obj.name) {
                case "Giraffe":
                    startMiniGame("What is this animal?", "Giraffe", ["Elephant", "Dog", "Ostrich"]);
                    break;
                case "Bank":
                    startMiniGame("What do people do at a bank?", "Save Money", ["Buy Clothes", "Cook Food", "Play Soccer"]);
                    break;
                case "School":
                    startMiniGame("What do students do at school?", "Learn", ["Sleep", "Drive Cars", "Eat"]);
                    break;
                case "House":
                    startMiniGame("Where do people live?", "House", ["Airport", "Mall", "Factory"]);
                    break;
                case "Tree":
                    startMiniGame("What do trees produce?", "Oxygen", ["Plastic", "Metal", "Water"]);
                    break;
                case "Car":
                    startMiniGame("Which object moves fast on the road?", "Car", ["Bicycle", "Boat", "Airplane"]);
                    break;
                default:
                    console.log("Collided with: " + obj.name);
            }
            return true; // Prevent movement if collision detected
        }
    }
    return false;
}










function setupControls() {
    document.addEventListener('keydown', (event) => {
        switch (event.key) {
            case 'ArrowUp': moveForward = true; break;
            case 'ArrowDown': moveBackward = true; break;
            case 'ArrowLeft': moveLeft = true; break;
            case 'ArrowRight': moveRight = true; break;
        }
    });

    document.addEventListener('keyup', (event) => {
        switch (event.key) {
            case 'ArrowUp': moveForward = false; break;
            case 'ArrowDown': moveBackward = false; break;
            case 'ArrowLeft': moveLeft = false; break;
            case 'ArrowRight': moveRight = false; break;
        }
    });
}

function setupTouchControls() {
    const controlsContainer = document.createElement('div');
    controlsContainer.style.position = 'absolute';
    controlsContainer.style.bottom = '20px';
    controlsContainer.style.left = '50%';
    controlsContainer.style.transform = 'translateX(-50%)';
    controlsContainer.style.display = 'grid';
    controlsContainer.style.gridTemplateColumns = '50px 50px 50px';
    controlsContainer.style.gridTemplateRows = '50px 50px';
    controlsContainer.style.gap = '10px';

    document.body.appendChild(controlsContainer);

    function createButton(emoji, actionStart, actionEnd) {
        let button = document.createElement('button');
        button.innerHTML = emoji;
        button.style.width = '50px';
        button.style.height = '50px';
        button.style.fontSize = '24px';
        button.style.border = 'none';
        button.style.borderRadius = '50%';
        button.style.background = 'rgba(0, 0, 0, 0.5)';
        button.style.color = 'white';
		 button.style.userSelect = 'none';
        button.style.webkitUserSelect = 'none';
        button.style.mozUserSelect = 'none';
        button.style.msUserSelect = 'none';
        button.style.touchAction = 'none';
        button.addEventListener('touchstart', actionStart);
        button.addEventListener('touchend', actionEnd);
        return button;
    }

    const upButton = createButton('⬆', () => moveForward = true, () => moveForward = false);
    const leftButton = createButton('⬅', () => moveLeft = true, () => moveLeft = false);
    const rightButton = createButton('➡', () => moveRight = true, () => moveRight = false);
    const downButton = createButton('⬇', () => moveBackward = true, () => moveBackward = false);

    controlsContainer.appendChild(document.createElement('span'));
    controlsContainer.appendChild(upButton);
    controlsContainer.appendChild(document.createElement('span'));
    controlsContainer.appendChild(leftButton);
    controlsContainer.appendChild(downButton);
    controlsContainer.appendChild(rightButton);
	
	
	
	
}



function setupJoystickControls() {
    const joystickContainer = document.createElement('div');
    joystickContainer.style.position = 'absolute';
    joystickContainer.style.bottom = '10px';
    joystickContainer.style.right = '20px';
    joystickContainer.style.width = '100px';
    joystickContainer.style.height = '100px';
    joystickContainer.style.background = 'rgba(0, 0, 0, 0.5)';
    joystickContainer.style.borderRadius = '50%';
    joystickContainer.style.touchAction = 'none';
    document.body.appendChild(joystickContainer);
    
    let joystick = document.createElement('div');
    joystick.style.position = 'absolute';
    joystick.style.top = '50%';
    joystick.style.left = '50%';
    joystick.style.transform = 'translate(-50%, -50%)';
    joystick.style.width = '40px';
    joystick.style.height = '40px';
    joystick.style.background = 'rgba(255, 255, 255, 0.7)';
    joystick.style.borderRadius = '50%';
    joystickContainer.appendChild(joystick);
    
    let active = false;
    let startX = 0, startY = 0;
    
    joystickContainer.addEventListener('touchstart', (event) => {
        active = true;
        let touch = event.touches[0];
        startX = touch.clientX;
        startY = touch.clientY;
    });
    
    joystickContainer.addEventListener('touchmove', (event) => {
        if (!active) return;
        let touch = event.touches[0];
        let deltaX = touch.clientX - startX;
        let deltaY = touch.clientY - startY;
        
        lookLeft = deltaX < -20;
        lookRight = deltaX > 20;
        lookUp = deltaY < -20;
        lookDown = deltaY > 20;
    });
    
    joystickContainer.addEventListener('touchend', () => {
        active = false;
        lookLeft = lookRight = lookUp = lookDown = false;
    });
}


function animate() {
    requestAnimationFrame(animate);
    let newPosition = controls.getObject().position.clone();
    if (moveForward) newPosition.z -= speed;
    if (moveBackward) newPosition.z += speed;
    if (moveLeft) newPosition.x -= speed;
    if (moveRight) newPosition.x += speed;

    if (!checkCollisions(newPosition)) {
        controls.getObject().position.copy(newPosition);
    }
	
	if (lookLeft) camera.rotation.y += 0.02;
    if (lookRight) camera.rotation.y -= 0.02;
    if (lookUp) camera.rotation.x += 0.02;
    if (lookDown) camera.rotation.x -= 0.02;

    renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});


init();
