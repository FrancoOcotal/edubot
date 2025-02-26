let scene, camera, renderer, controls;
let moveForward = false, moveBackward = false, moveLeft = false, moveRight = false;
const speed = 0.1;
let collidableObjects = [];
const textureLoader = new THREE.TextureLoader();

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
    addLighting();
    addFloor();
    addSchool();
    addBank();
    addHouse();
    addChairs();
	addTrees();
    addCars();
    addNPCs();
    
    camera.position.y = 2;
    setupControls();
    setupTouchControls();
    animate();
}

function addLighting() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    
    const sunLight = new THREE.DirectionalLight(0xffffff, 1);
    sunLight.position.set(10, 50, 10);
    scene.add(sunLight);
}

function addFloor() {
    const groundTexture = textureLoader.load('textures/PavingStones138.png');
    groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
    groundTexture.repeat.set(10, 10);

    let floor = new THREE.Mesh(
        new THREE.BoxGeometry(100, 1, 100),
        new THREE.MeshStandardMaterial({ map: groundTexture })
    );
    floor.position.y = -0.5;
    scene.add(floor);
}

function createBuilding(width, height, depth, color, position, label) {
    let buildingMaterial = new THREE.MeshStandardMaterial({ color: color, roughness: 0.7 });
    let building = new THREE.Mesh(
        new THREE.BoxGeometry(width, height, depth),
        buildingMaterial
    );
    building.position.set(position.x, position.y, position.z);
    scene.add(building);
    collidableObjects.push(building);
}

function addSchool() {
    createBuilding(15, 10, 15, 0x5555ff, { x: -25, y: 5, z: -40 }, "School");
}

function addBank() {
    createBuilding(12, 8, 12, 0x228B22, { x: 25, y: 4, z: -40 }, "Bank");
}

function addHouse() {
    createBuilding(10, 7, 10, 0x964B00, { x: 0, y: 3.5, z: -20 }, "House");
}

function addChairs() {
    for (let i = -5; i <= 5; i += 2) {
        let chair = new THREE.Mesh(
            new THREE.BoxGeometry(1, 1, 1),
            new THREE.MeshStandardMaterial({ color: 0xAAAAAA })
        );
        chair.position.set(i, 0.5, 10);
        scene.add(chair);
        collidableObjects.push(chair);
    }
}

function addTrees() {
    for (let i = -30; i <= 30; i += 15) {
        let trunk = new THREE.Mesh(
            new THREE.CylinderGeometry(1, 1, 6, 8),
            new THREE.MeshStandardMaterial({ color: 0x8B4513 })
        );
        trunk.position.set(i, 3, -30);
        scene.add(trunk);
        
        let leaves = new THREE.Mesh(
            new THREE.SphereGeometry(4, 8, 8),
            new THREE.MeshStandardMaterial({ color: 0x228B22 })
        );
        leaves.position.set(i, 7, -30);
        scene.add(leaves);
    }
}

function addCars() {
    for (let i = -20; i <= 20; i += 20) {
        let carBody = new THREE.Mesh(
            new THREE.BoxGeometry(6, 2, 3),
            new THREE.MeshStandardMaterial({ color: 0xff0000 })
        );
        carBody.position.set(i, 1, 10);
        scene.add(carBody);

        let carWheels = [];
        for (let j = -2; j <= 2; j += 4) {
            for (let k = -1; k <= 1; k += 2) {
                let wheel = new THREE.Mesh(
                    new THREE.CylinderGeometry(0.5, 0.5, 1, 12),
                    new THREE.MeshStandardMaterial({ color: 0x000000 })
                );
                wheel.rotation.z = Math.PI / 2;
                wheel.position.set(i + j, 0.5, 10 + k);
                carWheels.push(wheel);
                scene.add(wheel);
            }
        }
    }
}

function addNPCs() {
    for (let i = -10; i <= 10; i += 10) {
        let npcBody = new THREE.Mesh(
            new THREE.BoxGeometry(1, 2, 1),
            new THREE.MeshStandardMaterial({ color: 0xffff00 })
        );
        npcBody.position.set(i, 1, -10);
        scene.add(npcBody);

        let npcHead = new THREE.Mesh(
            new THREE.SphereGeometry(0.7, 8, 8),
            new THREE.MeshStandardMaterial({ color: 0xffcc99 })
        );
        npcHead.position.set(i, 2.5, -10);
        scene.add(npcHead);
    }
}





function checkCollisions(newPosition) {
    for (let obj of collidableObjects) {
        let distance = obj.position.distanceTo(newPosition);
        if (distance < 3) return true; 
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
