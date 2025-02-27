


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
    const groundTexture = textureLoader.load('textures/rocky_terrain_02_diff_1k.jpg');
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
    createBuilding(10, 7, 10, "textures/plaster_brick_pattern_ao_1k.jpg", { x: 0, y: 3.5, z: -20 }, "House");
    
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



function addChurch() {
    let churchGroup = new THREE.Group();

    // Cargar Texturas
    let wallTexture = textureLoader.load("textures/castle_brick_02_red_diff_1k.jpg");
    let roofTexture = textureLoader.load("textures/roof_tiles_14_diff_1k.jpg");
    let doorTexture = textureLoader.load("textures/worn_planks_diff_1k.jpg");
    let windowTexture = textureLoader.load("textures/church_window.png");
    let crossTexture = textureLoader.load("textures/rosewood_veneer1_diff_1k.jpg");

    wallTexture.wrapS = wallTexture.wrapT = THREE.RepeatWrapping;
    roofTexture.wrapS = roofTexture.wrapT = THREE.RepeatWrapping;

    let wallMaterial = new THREE.MeshStandardMaterial({ map: wallTexture });
    let roofMaterial = new THREE.MeshStandardMaterial({ map: roofTexture });
    let doorMaterial = new THREE.MeshStandardMaterial({ map: doorTexture });
    let windowMaterial = new THREE.MeshStandardMaterial({ map: windowTexture, transparent: true, opacity: 0.8 });
    let crossMaterial = new THREE.MeshStandardMaterial({ map: crossTexture });

    // 🏛️ Edificio principal
    let mainBuilding = new THREE.Mesh(
        new THREE.BoxGeometry(10, 12, 8),
        wallMaterial
    );
    mainBuilding.position.set(0, 6, 0);
    churchGroup.add(mainBuilding);

    // ⛪ Techo cónico
    let roof = new THREE.Mesh(
        new THREE.ConeGeometry(6, 4, 4),
        roofMaterial
    );
    roof.rotation.y = Math.PI / 4;
    roof.position.set(0, 14, 0);
    churchGroup.add(roof);

    // 🏰 Torre
    let tower = new THREE.Mesh(
        new THREE.BoxGeometry(4, 8, 4),
        wallMaterial
    );
    tower.position.set(0, 18, 0);
    churchGroup.add(tower);

    // 🔺 Pequeño techo de la torre
    let towerRoof = new THREE.Mesh(
        new THREE.ConeGeometry(3, 4, 4),
        roofMaterial
    );
    towerRoof.rotation.y = Math.PI / 4;
    towerRoof.position.set(0, 22, 0);
    churchGroup.add(towerRoof);

    // 🚪 Puertas (Frontal y Trasera)
    let doorFront = new THREE.Mesh(
        new THREE.BoxGeometry(3, 5, 0.2),
        doorMaterial
    );
    doorFront.position.set(0, 2.5, 4);
    churchGroup.add(doorFront);

    let doorBack = new THREE.Mesh(
        new THREE.BoxGeometry(3, 5, 0.2),
        doorMaterial
    );
    doorBack.position.set(0, 2.5, -4);
    churchGroup.add(doorBack);

    // 🪟 Ventanas corregidas
    let windowPositions = [
        { x: -3.5, y: 7, z: 4.05 },  // Ventana izquierda frontal
        { x: 3.5, y: 7, z: 4.05 },   // Ventana derecha frontal
        { x: -5, y: 7, z: 0 },       // Ventana lateral izquierda
        { x: 5, y: 7, z: 0 }         // Ventana lateral derecha
    ];

    windowPositions.forEach(pos => {
        let windowMesh = new THREE.Mesh(
            new THREE.BoxGeometry(2, 3, 0.2),
            windowMaterial
        );
        windowMesh.position.set(pos.x, pos.y, pos.z);
        if (pos.z === 0) windowMesh.rotation.y = Math.PI / 2;
        churchGroup.add(windowMesh);
    });

    // ✝️ Cruz en la torre
    let verticalCross = new THREE.Mesh(
        new THREE.BoxGeometry(0.6, 4, 0.6),
        crossMaterial
    );
    verticalCross.position.set(0, 24, 0);
    churchGroup.add(verticalCross);

    let horizontalCross = new THREE.Mesh(
        new THREE.BoxGeometry(3, 0.6, 0.6),
        crossMaterial
    );
    horizontalCross.position.set(0, 24.5, 0);
    churchGroup.add(horizontalCross);

    // 📌 Ajustar la iglesia para que esté pegada al suelo
    churchGroup.position.set(-20, 0, 30);

    churchGroup.name = "Church";
    scene.add(churchGroup);
    collidableObjects.push(churchGroup);
}




function addSkySphere() {
    const skyTexture = textureLoader.load("textures/bottom-view-sky-with-clouds.jpg");
    skyTexture.wrapS = THREE.RepeatWrapping;
    skyTexture.wrapT = THREE.RepeatWrapping;
    
    const skyMaterial = new THREE.MeshBasicMaterial({
        map: skyTexture,
        side: THREE.BackSide // Renderiza el interior de la esfera
    });

    const skySphere = new THREE.Mesh(
        new THREE.SphereGeometry(500, 32, 32), // Tamaño grande para cubrir el mundo
        skyMaterial
    );

    skySphere.position.set(0, 250, 0); // Asegura que esté sobre el mapa
    scene.add(skySphere);
}


function addMountains() {
    const mountainTexture = textureLoader.load("textures/mountain.jpg");
    mountainTexture.wrapS = THREE.RepeatWrapping;
    mountainTexture.wrapT = THREE.RepeatWrapping;

    let mountainMaterial = new THREE.MeshStandardMaterial({ map: mountainTexture });

    let mapSize = 100;  // 📌 Tamaño del mapa
    let spacing = 20;   // 📏 Espaciado entre montañas
    let minHeight = 30, maxHeight = 60; // 📊 Altura variable de las montañas
    let minRadius = 15, maxRadius = 30; // 📊 Ancho variable de la base

    let mountainPositions = [];

    // 🔹 Montañas en los bordes del mapa (Norte, Sur, Este, Oeste)
    for (let x = -mapSize / 2 - 20; x <= mapSize / 2 + 20; x += spacing) {
        mountainPositions.push({ x: x, z: -mapSize / 2 - 20 }); // Sur
        mountainPositions.push({ x: x, z: mapSize / 2 + 20 });  // Norte
    }
    for (let z = -mapSize / 2 - 20; z <= mapSize / 2 + 20; z += spacing) {
        mountainPositions.push({ x: -mapSize / 2 - 20, z: z }); // Oeste
        mountainPositions.push({ x: mapSize / 2 + 20, z: z });  // Este
    }

    // 🔹 Crear montañas irregulares con colisión
    mountainPositions.forEach(pos => {
        let height = Math.random() * (maxHeight - minHeight) + minHeight; // 🔥 Altura aleatoria
        let radius = Math.random() * (maxRadius - minRadius) + minRadius; // 🔥 Ancho aleatorio

        let mountain;
        if (Math.random() > 0.5) {
            // 🔺 Algunas montañas como conos (puntiagudas)
            mountain = new THREE.Mesh(
                new THREE.ConeGeometry(radius, height, 10),
                mountainMaterial
            );
        } else {
            // ⛰️ Otras montañas más redondeadas
            mountain = new THREE.Mesh(
                new THREE.SphereGeometry(radius, 10, 10),
                mountainMaterial
            );
            mountain.scale.y = 1.5; // 📏 Aplastar ligeramente para más realismo
        }

        mountain.position.set(pos.x, height / 2 - 5, pos.z); // 📌 Ajustar altura
        mountain.name = "Mountain"; // 🚨 Asegurar que el nombre es correcto
        scene.add(mountain);
        collidableObjects.push(mountain); // 🔥 Agregar a objetos colisionables
    });

    console.log("✅ Montañas irregulares añadidas:", collidableObjects.length);
}


function addScooter() {
    let scooterGroup = new THREE.Group();

    // Cargar materiales con color azul
    let frameMaterial = new THREE.MeshStandardMaterial({ color: 0x0044cc }); // Azul para la estructura
    let deckMaterial = new THREE.MeshStandardMaterial({ color: 0x222222 });  // Base negra
    let wheelMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 }); // Ruedas negras
    let handleMaterial = new THREE.MeshStandardMaterial({ color: 0x888888 }); // Manillar gris

    // Base del scooter (Donde se para el usuario)
    let base = new THREE.Mesh(
        new THREE.BoxGeometry(4, 0.3, 1),
        deckMaterial
    );
    base.position.set(0, 0.2, 0);
    scooterGroup.add(base);

    // Manillar vertical (Tubo azul) - Movido más a la izquierda
    let handlebar = new THREE.Mesh(
        new THREE.CylinderGeometry(0.2, 0.2, 4, 10),
        frameMaterial
    );
    handlebar.position.set(-1, 2.5, 0); // 🔄 MOVIDO MÁS CERCA DE LA LLANTA IZQUIERDA
    scooterGroup.add(handlebar);

    // Manillar horizontal (Agarraderas) - Girado correctamente
    let handle = new THREE.Mesh(
        new THREE.CylinderGeometry(0.2, 0.2, 3, 10),
        handleMaterial
    );
    handle.position.set(-1, 4.5, 0); // 🔄 Movido junto con el tubo vertical
    handle.rotation.x = Math.PI / 2; // 🔄 Girado correctamente
    scooterGroup.add(handle);

    // Ruedas
    let wheelPositions = [
        { x: -1.5, z: 0 }, // 🔄 LLANTA IZQUIERDA (más cerca del manillar)
        { x: 1.5, z: 0 }
    ];

    wheelPositions.forEach(pos => {
        let wheel = new THREE.Mesh(
            new THREE.CylinderGeometry(0.5, 0.5, 0.5, 16),
            wheelMaterial
        );
        wheel.rotation.z = Math.PI / 2; // 🔄 Girado correctamente las ruedas
        wheel.position.set(pos.x, 0.1, pos.z);
        scooterGroup.add(wheel);
    });

    // Posicionar el scooter en el mapa
    scooterGroup.position.set(-5, 0, 10);
    scooterGroup.name = "Scooter";
    scene.add(scooterGroup);
    collidableObjects.push(scooterGroup);
}



function addSkateboard() {
    let skateboardGroup = new THREE.Group();

    // Cargar Texturas
    let deckMaterial = new THREE.MeshStandardMaterial({ color: 0x774422 }); // Madera
    let wheelMaterial = new THREE.MeshStandardMaterial({ color: 0x111111 }); // Ruedas

    // Tabla del skateboard
    let deck = new THREE.Mesh(
        new THREE.BoxGeometry(3, 0.2, 1),
        deckMaterial
    );
    deck.position.set(0, 0.2, 0);
    skateboardGroup.add(deck);

    // Ruedas
    let wheelPositions = [
        { x: -1, z: -0.5 },
        { x: -1, z: 0.5 },
        { x: 1, z: -0.5 },
        { x: 1, z: 0.5 }
    ];

    wheelPositions.forEach(pos => {
        let wheel = new THREE.Mesh(
            new THREE.CylinderGeometry(0.3, 0.3, 0.3, 16),
            wheelMaterial
        );
        wheel.rotation.x = Math.PI / 2;
        wheel.position.set(pos.x, 0.1, pos.z);
        skateboardGroup.add(wheel);
    });

    // Posicionar el monopatín en el mapa
    skateboardGroup.position.set(5, 0, 10);
    skateboardGroup.name = "Skateboard";
    scene.add(skateboardGroup);
    collidableObjects.push(skateboardGroup);
}


function addAirplane() {
    let airplaneGroup = new THREE.Group();

    // 🎨 Materiales
    let bodyMaterial = new THREE.MeshStandardMaterial({ color: 0x888888 }); // Gris metálico para el fuselaje
    let wingMaterial = new THREE.MeshStandardMaterial({ color: 0x0044cc }); // Azul para las alas
    let propellerMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 }); // Negro para la hélice
    let windowMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff, transparent: true, opacity: 0.8 }); // Ventanas

    // ✈️ Fuselaje (Cuerpo del avión)
    let fuselage = new THREE.Mesh(
        new THREE.CylinderGeometry(1.5, 1.5, 12, 32),
        bodyMaterial
    );
    fuselage.rotation.z = Math.PI / 2; // Girar para que apunte hacia adelante
    airplaneGroup.add(fuselage);

    // 🛩 Alas mejoradas (Más anchas y rectangulares)
    let leftWing = new THREE.Mesh(
        new THREE.BoxGeometry(7, 0.5, 2),
        wingMaterial
    );
    leftWing.position.set(0, 0, -2);
    airplaneGroup.add(leftWing);

    let rightWing = new THREE.Mesh(
        new THREE.BoxGeometry(7, 0.5, 2),
        wingMaterial
    );
    rightWing.position.set(0, 0, 2);
    airplaneGroup.add(rightWing);

    // 🏁 Cola del avión (Más estilizada)
    let tailBase = new THREE.Mesh(
        new THREE.BoxGeometry(2, 0.5, 1.5),
        wingMaterial
    );
    tailBase.position.set(-6, 0, 0);
    airplaneGroup.add(tailBase);

    let tailVertical = new THREE.Mesh(
        new THREE.BoxGeometry(0.5, 2, 1),
        wingMaterial
    );
    tailVertical.position.set(-6.5, 1.5, 0);
    airplaneGroup.add(tailVertical);

    // 🌀 Hélice del avión (Más realista)
    let propellerBase = new THREE.Mesh(
        new THREE.CylinderGeometry(0.3, 0.3, 1, 12),
        propellerMaterial
    );
    propellerBase.position.set(6.2, 0, 0);
    airplaneGroup.add(propellerBase);

    let propellerBlade1 = new THREE.Mesh(
        new THREE.BoxGeometry(0.2, 3, 0.1),
        propellerMaterial
    );
    propellerBlade1.position.set(6.5, 0, 0);
    airplaneGroup.add(propellerBlade1);

    let propellerBlade2 = new THREE.Mesh(
        new THREE.BoxGeometry(0.2, 3, 0.1),
        propellerMaterial
    );
    propellerBlade2.position.set(6.5, 0, 0);
    propellerBlade2.rotation.z = Math.PI / 2;
    airplaneGroup.add(propellerBlade2);

    // 🏠 Ventanas en la cabina
    for (let i = -2; i <= 2; i++) {
        let window = new THREE.Mesh(
            new THREE.SphereGeometry(0.2, 8, 8),
            windowMaterial
        );
        window.position.set(i * 1.5, 0.5, 1.2);
        airplaneGroup.add(window);
    }

    // ✈️ Tren de aterrizaje (Ruedas)
    let wheelPositions = [
        { x: -2.5, y: -1.2, z: -1 },
        { x: -2.5, y: -1.2, z: 1 },
        { x: 2, y: -1.5, z: 0 }
    ];

    wheelPositions.forEach(pos => {
        let wheel = new THREE.Mesh(
            new THREE.CylinderGeometry(0.3, 0.3, 0.2, 16),
            propellerMaterial
        );
        wheel.rotation.x = Math.PI / 2;
        wheel.position.set(pos.x, pos.y, pos.z);
        airplaneGroup.add(wheel);
    });

    // 📌 Nueva ubicación: mucho más a la derecha
    airplaneGroup.position.set(25, 1, 35);
    airplaneGroup.name = "Airplane";
    scene.add(airplaneGroup);
    collidableObjects.push(airplaneGroup);
}

function addAirplane() {
    let airplaneGroup = new THREE.Group();

    // 🎨 Materiales
    let bodyMaterial = new THREE.MeshStandardMaterial({ color: 0x888888 }); // Gris metálico para el fuselaje
    let wingMaterial = new THREE.MeshStandardMaterial({ color: 0x0044cc }); // Azul para las alas
    let propellerMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 }); // Negro para la hélice
    let windowMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff, transparent: true, opacity: 0.8 }); // Ventanas

    // ✈️ Fuselaje (Cuerpo del avión)
    let fuselage = new THREE.Mesh(
        new THREE.CylinderGeometry(1.5, 1.5, 12, 32),
        bodyMaterial
    );
    fuselage.rotation.z = Math.PI / 2; // Girar para que apunte hacia adelante
    airplaneGroup.add(fuselage);

    // 🛩 Alas mejoradas (Más anchas y rectangulares)
    let leftWing = new THREE.Mesh(
        new THREE.BoxGeometry(7, 0.5, 2),
        wingMaterial
    );
    leftWing.position.set(0, 0, -2);
    airplaneGroup.add(leftWing);

    let rightWing = new THREE.Mesh(
        new THREE.BoxGeometry(7, 0.5, 2),
        wingMaterial
    );
    rightWing.position.set(0, 0, 2);
    airplaneGroup.add(rightWing);

    // 🏁 Cola del avión (Más estilizada)
    let tailBase = new THREE.Mesh(
        new THREE.BoxGeometry(2, 0.5, 1.5),
        wingMaterial
    );
    tailBase.position.set(-6, 0, 0);
    airplaneGroup.add(tailBase);

    let tailVertical = new THREE.Mesh(
        new THREE.BoxGeometry(0.5, 2, 1),
        wingMaterial
    );
    tailVertical.position.set(-6.5, 1.5, 0);
    airplaneGroup.add(tailVertical);

    // 🌀 Hélice del avión (Más realista)
    let propellerBase = new THREE.Mesh(
        new THREE.CylinderGeometry(0.3, 0.3, 1, 12),
        propellerMaterial
    );
    propellerBase.position.set(6.2, 0, 0);
    airplaneGroup.add(propellerBase);

    let propellerBlade1 = new THREE.Mesh(
        new THREE.BoxGeometry(0.2, 3, 0.1),
        propellerMaterial
    );
    propellerBlade1.position.set(6.5, 0, 0);
    airplaneGroup.add(propellerBlade1);

    let propellerBlade2 = new THREE.Mesh(
        new THREE.BoxGeometry(0.2, 3, 0.1),
        propellerMaterial
    );
    propellerBlade2.position.set(6.5, 0, 0);
    propellerBlade2.rotation.z = Math.PI / 2;
    airplaneGroup.add(propellerBlade2);

    // 🏠 Ventanas en la cabina
    for (let i = -2; i <= 2; i++) {
        let window = new THREE.Mesh(
            new THREE.SphereGeometry(0.2, 8, 8),
            windowMaterial
        );
        window.position.set(i * 1.5, 0.5, 1.2);
        airplaneGroup.add(window);
    }

    // ✈️ Tren de aterrizaje (Ruedas)
    let wheelPositions = [
        { x: -2.5, y: -1.2, z: -1 },
        { x: -2.5, y: -1.2, z: 1 },
        { x: 2, y: -1.5, z: 0 }
    ];

    wheelPositions.forEach(pos => {
        let wheel = new THREE.Mesh(
            new THREE.CylinderGeometry(0.3, 0.3, 0.2, 16),
            propellerMaterial
        );
        wheel.rotation.x = Math.PI / 2;
        wheel.position.set(pos.x, pos.y, pos.z);
        airplaneGroup.add(wheel);
    });

    // 📌 Nueva ubicación: mucho más a la derecha
    airplaneGroup.position.set(25, 1, 35);
    airplaneGroup.name = "Airplane";
    scene.add(airplaneGroup);
    collidableObjects.push(airplaneGroup);
}
