let scene, camera, renderer, controls;
let moveForward = false, moveBackward = false, moveLeft = false, moveRight = false;
const speed = 0.1;
let collidableObjects = [];

function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    
    controls = new THREE.PointerLockControls(camera, document.body);
    document.getElementById('startButton').addEventListener('click', () => {
        controls.lock();
        document.getElementById('startButton').style.display = 'none';
    });

    scene.add(controls.getObject());
    addFloor();
    addSchool();
    addBank();
    addHouse();
    addChairs();
    
    camera.position.y = 1.5;
    setupControls();
    setupTouchControls();
    animate();
}

function addFloor() {
    let floor = new THREE.Mesh(
        new THREE.BoxGeometry(50, 1, 50),
        new THREE.MeshBasicMaterial({ color: 0x8B4513 })
    );
    floor.position.y = -0.5;
    scene.add(floor);
}

function createBuilding(width, height, depth, color, position, label) {
    let building = new THREE.Mesh(
        new THREE.BoxGeometry(width, height, depth),
        new THREE.MeshBasicMaterial({ color: color })
    );
    building.position.set(position.x, position.y, position.z);
    scene.add(building);
    collidableObjects.push(building);
}

function addSchool() {
    createBuilding(10, 7, 10, 0x5555ff, { x: -15, y: 3.5, z: -20 }, "School");
}

function addBank() {
    createBuilding(8, 6, 10, 0x228B22, { x: 15, y: 3, z: -20 }, "Bank");
}

function addHouse() {
    createBuilding(7, 5, 7, 0x964B00, { x: 0, y: 2.5, z: -10 }, "House");
}

function addChairs() {
    for (let i = -2; i <= 2; i += 2) {
        let chair = new THREE.Mesh(
            new THREE.BoxGeometry(1, 1, 1),
            new THREE.MeshBasicMaterial({ color: 0xAAAAAA })
        );
        chair.position.set(i, 0.5, 5);
        scene.add(chair);
        collidableObjects.push(chair);
    }
}

function checkCollisions(newPosition) {
    for (let obj of collidableObjects) {
        let distance = obj.position.distanceTo(newPosition);
        if (distance < 2) return true; 
    }
    return false;
}

function setupControls() {
    document.addEventListener('keydown', (event) => {
        switch (event.key.toLowerCase()) {
            case 'f': moveForward = true; break;
            case 'b': moveBackward = true; break;
            case 'l': moveLeft = true; break;
            case 'r': moveRight = true; break;
        }
    });

    document.addEventListener('keyup', (event) => {
        switch (event.key.toLowerCase()) {
            case 'f': moveForward = false; break;
            case 'b': moveBackward = false; break;
            case 'l': moveLeft = false; break;
            case 'r': moveRight = false; break;
        }
    });
}

function setupTouchControls() {
    document.getElementById('moveForward').addEventListener('touchstart', () => moveForward = true);
    document.getElementById('moveForward').addEventListener('touchend', () => moveForward = false);
    document.getElementById('moveBackward').addEventListener('touchstart', () => moveBackward = true);
    document.getElementById('moveBackward').addEventListener('touchend', () => moveBackward = false);
    document.getElementById('moveLeft').addEventListener('touchstart', () => moveLeft = true);
    document.getElementById('moveLeft').addEventListener('touchend', () => moveLeft = false);
    document.getElementById('moveRight').addEventListener('touchstart', () => moveRight = true);
    document.getElementById('moveRight').addEventListener('touchend', () => moveRight = false);
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

    renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});

init();
