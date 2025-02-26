


function addBuildingLabel(text, x, y, z) {
    const fontLoader = new THREE.FontLoader();
    fontLoader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', function(font) {
        const textGeometry = new THREE.TextGeometry(text, {
            font: font,
            size: 2,
            height: 0.5
        });
        const textMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
        const textMesh = new THREE.Mesh(textGeometry, textMaterial);
        textMesh.position.set(x - text.length, y, z);
        scene.add(textMesh);
    });
}

function addLighting() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    
    const sunLight = new THREE.DirectionalLight(0xffffff, 1);
    sunLight.position.set(10, 50, 10);
    scene.add(sunLight);
}

function addFloor() {
    const groundTexture = textureLoader.load('textures/ground_0040_color_1k.jpg');
    groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
    groundTexture.repeat.set(10, 10);

    let floor = new THREE.Mesh(
        new THREE.BoxGeometry(100, 1, 100),
        new THREE.MeshStandardMaterial({ map: groundTexture })
    );
    floor.position.y = -0.5;
    scene.add(floor);
}

function createBuilding(width, height, depth, texturePath, position, label) {
    const texture = textureLoader.load(texturePath);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(1, 1); // Adjust tiling if needed

    let buildingMaterial = new THREE.MeshStandardMaterial({ map: texture });
    let building = new THREE.Mesh(
        new THREE.BoxGeometry(width, height, depth),
        buildingMaterial
    );

    building.position.set(position.x, position.y, position.z);
    scene.add(building);
    collidableObjects.push(building);

    addBuildingLabel(label, position.x, position.y + height / 2 + 1, position.z);
}


function addSchool() {
    createBuilding(15, 10, 15, "textures/tiles_0125_color_1k.jpg", { x: -25, y: 5, z: -40 }, "School");
    
    // Add Door
    let doorTexture = textureLoader.load("textures/wood_0066_color_1k.jpg");
    let door = new THREE.Mesh(
        new THREE.BoxGeometry(3, 5, 0.2),
        new THREE.MeshStandardMaterial({ map: doorTexture })
    );
    door.position.set(-25, 2.5, -32.6);
    scene.add(door);
    
    // Add Windows
    let windowTexture = textureLoader.load("textures/window.png");
    for (let i = -5; i <= 5; i += 10) {
        let windowMesh = new THREE.Mesh(
            new THREE.BoxGeometry(3, 3, 0.2),
            new THREE.MeshStandardMaterial({ map: windowTexture, transparent: true, opacity: 0.9 })
        );
        windowMesh.position.set(-25 + i, 5, -32.6);
        scene.add(windowMesh);
    }
}

function addBank() {
    createBuilding(12, 8, 12, "textures/wood_0066_ao_1k.jpg", { x: 25, y: 4, z: -40 }, "Bank");
    
    // Add Door
    let doorTexture = textureLoader.load("textures/wood_0066_color_1k.jpg");
    let door = new THREE.Mesh(
        new THREE.BoxGeometry(4, 6, 0.2),
        new THREE.MeshStandardMaterial({ map: doorTexture })
    );
    door.position.set(25, 3, -34);
    scene.add(door);
    
    // Add Large Windows
    let windowTexture = textureLoader.load("textures/bank_window.png");
    for (let i = -4; i <= 4; i += 8) {
        let windowMesh = new THREE.Mesh(
            new THREE.BoxGeometry(4, 4, 0.2),
            new THREE.MeshStandardMaterial({ map: windowTexture, transparent: true, opacity: 0.9 })
        );
        windowMesh.position.set(25 + i, 5, -34);
        scene.add(windowMesh);
    }
}

function addHouse() {
    createBuilding(10, 7, 10, "textures/wood_0066_normal_directx_1k.png", { x: 0, y: 3.5, z: -20 }, "House");
    
    // Add Door (Brown Color, No Texture)
    let door = new THREE.Mesh(
        new THREE.BoxGeometry(2.5, 4, 0.2),
        new THREE.MeshStandardMaterial({ color: 0x8B4513 })
    );
    door.position.set(0, 2, -14.9);
    scene.add(door);
    
    // Add Windows (Brown Color, No Texture)
    for (let i = -3; i <= 3; i += 6) {
        let windowMesh = new THREE.Mesh(
            new THREE.BoxGeometry(2, 2, 0.2),
            new THREE.MeshStandardMaterial({ color: 0x8B4513 })
        );
        windowMesh.position.set(i, 4, -14.9);
        scene.add(windowMesh);
    }
}


function addChairs() {
    for (let i = -5; i <= 5; i += 2) {
        let chair = new THREE.Mesh(
            new THREE.BoxGeometry(1, 1, 1),
            new THREE.MeshStandardMaterial({ color: 0xAAAAAA })
        );
        chair.position.set(i, 0.7, 40);
        scene.add(chair);
        collidableObjects.push(chair);
    }
}

function addTrees() {
    const occupiedPositions = [
        { x: -25, z: -40 }, // School
        { x: 25, z: -40 },  // Bank
        { x: 0, z: -20 },   // House
        { x: 10, z: -20 }   // Giraffe
    ];
    
    let treeCount = 0;
    while (treeCount < 5) {
        let x = Math.floor(Math.random() * 60) - 30;
        let z = Math.floor(Math.random() * 60) - 50;
        
        let isOccupied = occupiedPositions.some(pos => 
            Math.abs(pos.x - x) < 10 && Math.abs(pos.z - z) < 10
        );
        
        if (isOccupied) continue;
        
        let trunkHeight = Math.random() * 2 + 6; // Randomized height variation
        
        // Trunk
        let trunk = new THREE.Mesh(
            new THREE.CylinderGeometry(1, 1, trunkHeight, 8),
            new THREE.MeshStandardMaterial({ color: 0x8B4513 })
        );
        trunk.position.set(x, trunkHeight / 2, z);
        scene.add(trunk);
        
        // Leaves (Stacked Spheres for Full Tree Effect)
        for (let j = 0; j < 3; j++) {
            let leaves = new THREE.Mesh(
                new THREE.SphereGeometry(4 - j, 8, 8),
                new THREE.MeshStandardMaterial({ color: 0x228B22 })
            );
            leaves.position.set(x, trunkHeight + j * 2, z);
            scene.add(leaves);
        }
        
        treeCount++;
    }
}


function addGiraffe() {
    let giraffeTexture = textureLoader.load("textures/giraffe.jpg");
    
    // Body
    let body = new THREE.Mesh(
        new THREE.CylinderGeometry(1.2, 1.5, 6, 12),
        new THREE.MeshStandardMaterial({ map: giraffeTexture })
    );
    body.position.set(10, 5, -20);
	body.name = "Giraffe";
    scene.add(body);
    
    // Neck
    let neck = new THREE.Mesh(
        new THREE.CylinderGeometry(0.5, 0.6, 8, 12),
        new THREE.MeshStandardMaterial({ map: giraffeTexture })
    );
    neck.position.set(10, 10, -20);
    scene.add(neck);
    
    // Head
    let head = new THREE.Mesh(
        new THREE.SphereGeometry(1, 12, 12),
        new THREE.MeshStandardMaterial({ map: giraffeTexture })
    );
    head.position.set(10, 14, -20);
    scene.add(head);
    
    // Legs
    const legMaterial = new THREE.MeshStandardMaterial({ map: giraffeTexture });
    const legPositions = [
        { x: 9.2, z: -19.5 },
        { x: 9.2, z: -20.5 },
        { x: 10.8, z: -19.5 },
        { x: 10.8, z: -20.5 }
    ];
    
    legPositions.forEach(pos => {
        let upperLeg = new THREE.Mesh(
            new THREE.CylinderGeometry(0.4, 0.5, 3, 12),
            legMaterial
        );
        upperLeg.position.set(pos.x, 2.5, pos.z);
        scene.add(upperLeg);
        
        let lowerLeg = new THREE.Mesh(
            new THREE.CylinderGeometry(0.3, 0.4, 2.5, 12),
            legMaterial
        );
        lowerLeg.position.set(pos.x, 0.5, pos.z);
        scene.add(lowerLeg);
    });
    
    // Ears
    let earLeft = new THREE.Mesh(
        new THREE.CylinderGeometry(0.2, 0.3, 0.6, 8),
        new THREE.MeshStandardMaterial({ map: giraffeTexture })
    );
    earLeft.position.set(9.5, 14.8, -19.8);
    earLeft.rotation.z = Math.PI / 4;
    scene.add(earLeft);
    
    let earRight = new THREE.Mesh(
        new THREE.CylinderGeometry(0.2, 0.3, 0.6, 8),
        new THREE.MeshStandardMaterial({ map: giraffeTexture })
    );
    earRight.position.set(10.5, 14.8, -19.8);
    earRight.rotation.z = -Math.PI / 4;
    scene.add(earRight);
    
    // Tail
    let tail = new THREE.Mesh(
        new THREE.CylinderGeometry(0.15, 0.2, 3, 8),
        new THREE.MeshStandardMaterial({ map: giraffeTexture })
    );
    tail.position.set(10, 3, -18.5);
    tail.rotation.x = Math.PI / 8;
    scene.add(tail);
}


let npcs = [];

function addNPCs() {
    for (let i = -10; i <= 10; i += 10) {
        let npcGroup = new THREE.Group();

        // Cuerpo
        let body = new THREE.Mesh(
            new THREE.BoxGeometry(1, 2, 1),
            new THREE.MeshStandardMaterial({ color: 0xffff00 })
        );
        body.position.set(0, 1, 0);
        npcGroup.add(body);

        // Cabeza
        let head = new THREE.Mesh(
            new THREE.SphereGeometry(0.7, 12, 12),
            new THREE.MeshStandardMaterial({ color: 0xffcc99 })
        );
        head.position.set(0, 2.5, 0);
        npcGroup.add(head);

        // Brazos
        let armMaterial = new THREE.MeshStandardMaterial({ color: 0xffff00 });
        let leftArm = new THREE.Mesh(new THREE.BoxGeometry(0.5, 1.5, 0.5), armMaterial);
        let rightArm = new THREE.Mesh(new THREE.BoxGeometry(0.5, 1.5, 0.5), armMaterial);
        leftArm.position.set(-0.8, 1.5, 0);
        rightArm.position.set(0.8, 1.5, 0);
        npcGroup.add(leftArm);
        npcGroup.add(rightArm);

        // Piernas
        let legMaterial = new THREE.MeshStandardMaterial({ color: 0x0000ff });
        let leftLeg = new THREE.Mesh(new THREE.BoxGeometry(0.5, 1.5, 0.5), legMaterial);
        let rightLeg = new THREE.Mesh(new THREE.BoxGeometry(0.5, 1.5, 0.5), legMaterial);
        leftLeg.position.set(-0.3, 0, 0);
        rightLeg.position.set(0.3, 0, 0);
        npcGroup.add(leftLeg);
        npcGroup.add(rightLeg);

        // Posicionar al NPC en la escena
        npcGroup.position.set(i, 1, -10);
        npcGroup.name = "NPC";
        scene.add(npcGroup);
        npcs.push({ mesh: npcGroup, direction: Math.random() * Math.PI * 2 });
        collidableObjects.push(npcGroup);
    }
}

let cars = [];

function addCars() {
    let carGroup = new THREE.Group();

    let carBodyMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
    let wheelMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 });
    let doorMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
    let windowMaterial = new THREE.MeshStandardMaterial({ color: 0x333333, transparent: true, opacity: 0.7 });

    // Car Body
    let carBody = new THREE.Mesh(
        new THREE.BoxGeometry(6, 2, 3),
        carBodyMaterial
    );
    carBody.position.set(0, 1, 0);
    carGroup.add(carBody);

    // Car Roof
    let carRoof = new THREE.Mesh(
        new THREE.BoxGeometry(4, 1.5, 2.8),
        carBodyMaterial
    );
    carRoof.position.set(0, 2.5, 0);
    carGroup.add(carRoof);

    // Wheels
    let wheelPositions = [
        { x: -2.5, y: -0.5, z: -1.3 },
        { x: -2.5, y: -0.5, z: 1.3 },
        { x: 2.5, y: -0.5, z: -1.3 },
        { x: 2.5, y: -0.5, z: 1.3 }
    ];

    wheelPositions.forEach(pos => {
        let wheel = new THREE.Mesh(
            new THREE.CylinderGeometry(0.7, 0.7, 0.5, 24),
            wheelMaterial
        );
        wheel.rotation.z = Math.PI / 2;
        wheel.position.set(pos.x, pos.y, pos.z);
        carGroup.add(wheel);
    });

    // Doors
    let leftDoor = new THREE.Mesh(
        new THREE.BoxGeometry(0.1, 1.5, 2),
        doorMaterial
    );
    leftDoor.position.set(-3, 1.5, 0);
    carGroup.add(leftDoor);

    let rightDoor = new THREE.Mesh(
        new THREE.BoxGeometry(0.1, 1.5, 2),
        doorMaterial
    );
    rightDoor.position.set(3, 1.5, 0);
    carGroup.add(rightDoor);

    // Windows
    let frontWindow = new THREE.Mesh(
        new THREE.BoxGeometry(2, 1, 0.1),
        windowMaterial
    );
    frontWindow.position.set(0, 3, 1.6);
    carGroup.add(frontWindow);

    let sideWindow = new THREE.Mesh(
        new THREE.BoxGeometry(0.1, 1, 2),
        windowMaterial
    );
    sideWindow.position.set(2, 3, 0);
    carGroup.add(sideWindow);

    // Set initial position
    carGroup.position.set(-10, 1, 40); // Nueva posición del auto
    carGroup.name = "Car";
    scene.add(carGroup);
    collidableObjects.push(carGroup);
    cars.push({ mesh: carGroup, direction: Math.random() * Math.PI * 2 });
}
