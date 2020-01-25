"use strict";

// функция для создания источника света
function createLight(scene, color, force) {
    let pointLight = new THREE.PointLight(color, force);
    scene.add(pointLight);
    return pointLight;
}

// функция для создания куба
function createCube(scene, width, height, length, color) {
    let cubeGeometry = new THREE.CubeGeometry(width, height, length);
    let cubeMaterial = new THREE.MeshLambertMaterial({color: color});
    let cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    scene.add(cube);
    return cube;
}

// функция для создания цилиндра
function createCylinder(scene, radius, height, segments, color) {
    let geometry = new THREE.CylinderGeometry(radius, radius, height, segments);
    let material = new THREE.MeshBasicMaterial({color: color});
    let cylinder = new THREE.Mesh( geometry, material );
    scene.add(cylinder);
    return cylinder;
}

// функция для задания положения объекта
function setElementPosition(element, xx, yy, zz) {
    element.position.x = xx;
    element.position.y = yy;
    element.position.z = zz;
}

// размеры холста
let ww = 800;
let hh = 600;

// переменные для управления героем с клавиатуры
let w = false;
let a = false;
let s = false;
let d = false;

// переменные для работы со скоростями героя
let angle = 0;
let angleSpeed = 0.04;
let speedModule = 1.5;

// функция для управления героем
function controlHero(heroElement) {
    if(a === true) {angle += angleSpeed};
    if(d === true) {angle -= angleSpeed};
    heroElement.rotation.y = angle;

    let speedX = speedModule * Math.sin(angle);
    let speedZ = speedModule * Math.cos(angle);
    if(w === true) {
        heroElement.position.x += speedX;
        heroElement.position.z += speedZ;
    }
}

// функция для перемещения камеры за героем
function moveCameraForHero(cameraElement, heroElement) {
    let distance = -40;
    cameraElement.position.x = heroElement.position.x + distance * Math.sin(angle);
    cameraElement.position.y = 15;
    cameraElement.position.z = heroElement.position.z + distance * Math.cos(angle);
    cameraElement.lookAt(heroElement.position);
}

// массив с пулями
let bulletsArr = [];

// функция для движения пулек
function moveBullets() {
    let speed = 3;
    for(let i = 0; i < bulletsArr.length; i++) {
        let b = bulletsArr[i];
        if(Math.abs(b.position.z) <= 70 && Math.abs(b.position.x) <= 70) {
            b.position.z = b.position.z + speed * Math.cos(b.rotation.y);
            b.position.x = b.position.x + speed * Math.sin(b.rotation.y);
        }
    }
}

window.onload = function() {
    // описание сцены и служебных объектов
    let scene = new THREE.Scene();
    let camera = new THREE.PerspectiveCamera(45, ww / hh, 0.1, 1000);
    let renderer = new THREE.WebGLRenderer();
    renderer.setClearColor("#67ddff");
    renderer.setSize(ww,hh);
    document.getElementById("gameBox").append(renderer.domElement);

    // создание сетки
    let sizeOfSetka = 100;
    let divisions = 10;
    let color_1 = "#0000FF";
    let color_2 = "#000000";
    let gridHelper = new THREE.GridHelper(sizeOfSetka, divisions, color_1, color_2);
    scene.add(gridHelper);

    // камера - вид сверху на карту
    camera.position.x = 0;
    camera.position.y = 200;
    camera.position.z = 0;
    camera.lookAt( new THREE.Vector3(0, 0, 0) );

    // источники света
    let lightA = createLight(scene, "#FFFFFF", 1);
    let lightB = createLight(scene, "#FFFFFF", 1);
    let lightC = createLight(scene, "#FFFFFF", 1);
    setElementPosition(lightA, 0, 150, 0);
    setElementPosition(lightB, -200, 150, 80);
    setElementPosition(lightC, 200, 150, -80);

    // земля
    let ground = createCube(scene, 100, 2, 100, "#006400");
    setElementPosition(ground, 0, -1.1, 0);

    // цилиндрические препятствия
    let wallA = createCylinder(scene, 10, 6, 16, "#FF1493");
    setElementPosition(wallA, -30, 3, 0);
    let wallB = createCylinder(scene, 10, 6, 16, "#FF1493");
    setElementPosition(wallB, 30, 3, 20);
    let wallC = createCylinder(scene, 10, 6, 16, "#FF1493");
    setElementPosition(wallC, 30, 3, -30);

    // создание героя - кубика
    let hero = createCube(scene, 6, 6, 6, "#FF0000");
    setElementPosition(hero, 20, 3, 0);

    // при нажатии клавиши
    window.onkeydown = function(event) {
        if(event.keyCode === 87) {w = true};
        if(event.keyCode === 65) {a = true};
        if(event.keyCode === 83) {s = true};
        if(event.keyCode === 68) {d = true};
    }

    // при отпускании клавиши
    window.onkeyup = function(event) {
        if(event.keyCode === 87) {w = false};
        if(event.keyCode === 65) {a = false};
        if(event.keyCode === 83) {s = false};
        if(event.keyCode === 68) {d = false};
    }

    // отображаем вид с камеры
    renderer.render(scene, camera);

    // стрельба кубиками
    let box = document.getElementById("gameBox");
    box.onclick = function() {
        console.log("Fire");
        let bullet = createCube(scene, 2, 2, 2, "#C71585");
        bullet.position.x = hero.position.x;
        bullet.position.y = hero.position.y;
        bullet.position.z = hero.position.z;
        bullet.rotation.y = angle;
        bulletsArr.push(bullet);
    };

    // выполнение кода циклически через временные промежутки
    setInterval(function() {
        controlHero(hero);
        moveCameraForHero(camera, hero);
        moveBullets();
        renderer.render(scene, camera);
    }, 50);
}