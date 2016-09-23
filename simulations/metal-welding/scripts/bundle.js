(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = {
    SMOKE: {
        PARTICLE_NUM: 2000,
    },
    SPARK: {
        PARTICLE_NUM: 2000,
    },
}

},{}],2:[function(require,module,exports){
const Constants = require('./Constants');

module.exports = class Simulator {
    constructor() {
        this._objects = [];
        this._staticPlanes = [];
        this._forces = [];

        this._currGenerated = 0;
        this._currSmokeGenerated = 0;

        this.startPos = {
            x: 0,
            y: 0,
            z: 0,
        };

        this.generateParticles = false;

        this._vortices = [];
    }

    addObject(object) {
        this._objects.push(object);
    }

    getObjects() {
        return this._objects;
    }

    addStaticPlane(so) {
        this._staticPlanes.push(so);
    }

    clearStaticPlanes() {
        this._staticPlanes = [];
    }

    setParticles(particles) {
        this._particles = particles;
    }

    setSmokeParticles(smokeParticles) {
        this._smokeParticles = smokeParticles;
    }

    simulateVortices() {
        if (this.generateParticles) {
            if (Math.random() > 0.9) {
                // Generate a vortex
                const vortex = {
                    pos: {
                        x: this.startPos.x,
                        y: this.startPos.y + 1.5,
                        z: this.startPos.z,
                    },
                    vel: {
                        x: Math.random() * 0.01 - 0.005,
                        y: Math.random() * 0.03 + 0.05,
                        z: 0,
                    },
                    radius: Math.random(),
                    angularVel: Math.random() * 0.2 + 0.3,
                };

                this._vortices.push(vortex);
            }

            for (let i = 0; i < this._vortices; i++) {
                const vortex = this._vortices[i];
                vortex.pos.x += vortex.vel.x;
                vortex.pos.y += vortex.vel.y;
                vortex.pos.z += vortex.vel.z;
            }
        }
    }

    simulate() {
        this.simulateVortices();

        const sp = this._smokeParticles.attributes.position.array;
        const sv = this._smokeParticles.attributes.velocity.array;
        const sa = this._smokeParticles.attributes.age.array;
        const ss = this._smokeParticles.attributes.state.array;

        if (this.generateParticles) {
            const lastSmokeParticleIndex = this._currSmokeGenerated;

            this._currSmokeGenerated += Math.floor((Math.random() * 5 + 3));

            for (let i = lastSmokeParticleIndex; i < this._currSmokeGenerated; i++) {
                const idx = i % Constants.SMOKE.PARTICLE_NUM;
                ss[idx] = 1;
                sa[idx] = 0;

                sp[idx * 3] = this.startPos.x;
                sp[idx * 3 + 1] = this.startPos.y;
                sp[idx * 3 + 2] = this.startPos.z;

                sv[i * 3] = Math.random() * 0.01 - 0.005;
                sv[i * 3 + 1] = Math.random() * 0.03 + 0.05;
                sv[i * 3 + 2] = 0;
            }
        }

        for (let i = 0; i < Constants.SMOKE.PARTICLE_NUM; i++) {
            if (ss[i] === 1) {
                for (let j = 0; j < this._vortices.length; j++) {
                    const vortex = this._vortices[j];

                    const diffX = sp[i * 3] - vortex.pos.x;
                    const diffY = sp[i * 3 + 1] - vortex.pos.y;
                    // const diffZ = sp[i * 3 + 2] - vortex.pos.z;

                    const dist = Math.sqrt(diffX * diffX + diffY * diffY);

                    if (dist < vortex.radius) {
                        const p = 0.008 / (1 + dist * dist);
                        const aVel = vortex.angularVel;

                        sv[i * 3] += -p * diffY * aVel;
                        sv[i * 3 + 1] += p * diffX * aVel;
                    }
                }

                sv[i * 3] *= 0.999;
                sv[i * 3 + 1] *= 0.999;
                sv[i * 3 + 2] *= 0.999;

                sp[i * 3] += sv[i * 3];
                sp[i * 3 + 1] += sv[i * 3 + 1];
                sp[i * 3 + 2] += sv[i * 3 + 2];

                sa[i] += 0.01;

                if (sa[i] > 10) {
                    // Recycle particles if the age is too large
                    sa[i] = 0;
                    ss[i] = 0;
                }
            }
        }

        this._smokeParticles.attributes.velocity.needsUpdate = true;
        this._smokeParticles.attributes.position.needsUpdate = true;
        this._smokeParticles.attributes.age.needsUpdate = true;
        this._smokeParticles.attributes.state.needsUpdate = true;



        const p = this._particles.attributes.position.array;
        const v = this._particles.attributes.velocity.array;
        const a = this._particles.attributes.age.array;
        const s = this._particles.attributes.state.array;

        if (this.generateParticles) {
            const lastParticleIndex = this._currGenerated;

            this._currGenerated += Math.floor((Math.random() * 30 + 10));

            for (let i = lastParticleIndex; i < this._currGenerated; i++) {
                const idx = i % Constants.SPARK.PARTICLE_NUM;
                s[idx] = 1;
                a[idx] = 0;

                p[idx * 3] = this.startPos.x;
                p[idx * 3 + 1] = this.startPos.y;
                p[idx * 3 + 2] = this.startPos.z;

                v[idx * 3] = (Math.random() * 0.1 - 0.05);
                v[idx * 3 + 1] = (Math.random() * 0.25);
                v[idx * 3 + 2] = (Math.random() * 0.05 + 0.05);
            }
        }

        for (let i = 0; i < Constants.SPARK.PARTICLE_NUM; i += 2) {
            if (s[i] === 1) {
                v[i * 3 + 1] -= 0.01;

                p[i * 3] = p[i * 3 + 3];
                p[i * 3 + 1] = p[i * 3 + 4];
                p[i * 3 + 2] = p[i * 3 + 5];

                p[i * 3 + 3] += 2 * v[i * 3];
                p[i * 3 + 4] += 2 * v[i * 3 + 1];
                p[i * 3 + 5] += 2 * v[i * 3 + 2];

                a[i] += 0.002;
                a[i + 1] += 0.002;

                if (a[i] > 3) {
                    // Recycle particles if the age is too large
                    a[i] = 0;
                    s[i] = 0;
                }
            }
        }

        this._particles.attributes.position.needsUpdate = true;
        this._particles.attributes.velocity.needsUpdate = true;
        this._particles.attributes.age.needsUpdate = true;
        this._particles.attributes.state.needsUpdate = true;
    }

    getCollisions() {
        let collisions = [];

        const numObjs = this._objects.length;

        for (let i = 0; i < numObjs; i++) {
            const obj = this._objects[i];
            if (!obj.lastState) {
                continue;
            }

            const staticPlaneCollisions = this._getStaticPlaneCollisions(obj);

            collisions = collisions.concat(staticPlaneCollisions);

            for (let j = i + 1; j < numObjs; j++) {
                const obj2 = this._objects[j];

                const objDist = obj.pos.distanceTo(obj2.pos);
                const lastObjDist = obj.lastState.pos.distanceTo(obj2.lastState.pos);

                const collisionDistance = obj.radius + obj2.radius;

                const collisionNormal = obj2.pos.clone().sub(obj.pos).normalize();

                const lastPos = obj.lastState.pos;
                const collisionFraction = ((lastObjDist - collisionDistance) / (lastObjDist - objDist));

                if (lastObjDist >= collisionDistance && objDist < collisionDistance) {
                    collisions.push({
                        withPlane: false,
                        object: obj,
                        withObject: obj2,
                        normal: collisionNormal,
                        fraction: collisionFraction,
                    });
                }
            }
        }

        return collisions;
    }

    checkResting(obj) {
        obj.restingAgainst = null;

        // check resting condition
        this._staticPlanes.forEach(plane => {
            if (plane.normal.y != 1) {
                return;
            }

            const {
                normal,
            } = plane;

            const normalVel = obj.vel.clone().multiplyScalar(obj.vel.dot(normal));

            if (normalVel.y > 0.05) {
                return;
            }

            const planeDist = obj.pos.y - obj.radius - plane.point.y;

            if (planeDist > 0.05) {
                return;
            }

            obj.restingAgainst = plane;
        });
    }

    addForce(force) {
        this._forces.push(force);
    }

    refreshDispaly() {
        this._objects.forEach(obj => {
            obj.updateGraphics();
        });
    }

    _getStaticPlaneCollisions(obj) {
        const collisions = [];
        this._staticPlanes.forEach(plane => {
            const {
                point,
                normal,
            } = plane;

            const objPlaneDist = obj.pos.clone().sub(point).dot(normal);
            const lastObjPlaneDist = obj.lastState.pos.clone().sub(point).dot(normal);

            if (objPlaneDist < obj.radius && lastObjPlaneDist > obj.radius) {
                const d0 = lastObjPlaneDist - obj.radius;
                const d1 = objPlaneDist - obj.radius;
                const collisionFraction = d0 / (d0 - d1);

                collisions.push({
                    withPlane: true,
                    normal: normal,
                    object: obj,
                    dist: objPlaneDist,
                    lastDist: lastObjPlaneDist,
                    fraction: collisionFraction,
                });
            }
        });

        return collisions;
    }
}

},{"./Constants":1}],3:[function(require,module,exports){
module.exports = class StaticPlane {
    constructor(point, normal) {
        this.point = point;
        this.normal = normal;
    }
}

},{}],4:[function(require,module,exports){
const Constants = require('./Constants');
const Simulator = require('./Simulator');
const StaticPlane = require('./StaticPlane');
const scene = new THREE.Scene();

const WIDTH = 1000;
const HEIGHT = 600;

const props = {
    stepsPerFrame: 1,

    camera: null,
    cameraPos: {
        x: 0,
        y: 0,
        z: 20,
    },

    dragging: false,
    lastMousePos: null,

    pointLight: null,
}

const simulator = new Simulator();

const renderer = new THREE.WebGLRenderer({
    antialias: true,
});

const textureLoader = new THREE.TextureLoader();

renderer.setSize(WIDTH, HEIGHT);
renderer.setClearColor(0x000000, 1);
document.body.appendChild(renderer.domElement);

renderer.domElement.onwheel = (evt) => {
    evt.preventDefault(0);
    const multiplier = 1 + evt.deltaY * 0.001;

    props.cameraPos.x *= multiplier;
    props.cameraPos.z *= multiplier;
    props.cameraPos.y *= multiplier;

    props.camera.position.set(props.cameraPos.x, props.cameraPos.y, props.cameraPos.z);
    props.camera.lookAt(new THREE.Vector3(0, 0, 0));
}

renderer.domElement.onmousedown = (evt) => {
    props.dragging = true;

    props.pointLight.intensity = 50;

    const x = (evt.clientX - 360) / 14;
    const y = -(evt.clientY - 250) / 14;
    const z = 0.1;

    props.pointLight.position.set(x, y, z);

    simulator.startPos = {
        x: x,
        y: y,
        z: z,
    };

    simulator.generateParticles = true;

    // props.lastMousePos = {
    //     x: evt.clientX,
    //     y: evt.clientY,
    // };
}

renderer.domElement.onmousemove = (evt) => {
    if (!props.dragging) {
        return;
    }

    const x = (evt.clientX - 360) / 14;
    const y = -(evt.clientY - 250) / 14;
    const z = 0.1;

    props.pointLight.position.set(x, y, z);

    simulator.startPos = {
        x: x,
        y: y,
        z: z,
    };

    // const currMousePos = {
    //     x: evt.clientX,
    //     y: evt.clientY,
    // };
    //
    // const mousePosDiff = {
    //     x: currMousePos.x - props.lastMousePos.x,
    //     y: currMousePos.y - props.lastMousePos.y,
    // };
    //
    // const distXZ = Math.sqrt(props.cameraPos.x * props.cameraPos.x + props.cameraPos.z * props.cameraPos.z);
    // const dist = Math.sqrt(distXZ * distXZ + props.cameraPos.y * props.cameraPos.y);
    //
    // const currXZAngle = Math.atan2(props.cameraPos.z, props.cameraPos.x);
    // const newXZAngle = currXZAngle + mousePosDiff.x / 57.3;
    // const currYAngle = Math.atan2(props.cameraPos.y, distXZ);
    // const newYAngle = currYAngle + mousePosDiff.y / 57.3;
    //
    // props.cameraPos.x = dist * Math.cos(newYAngle) * Math.cos(newXZAngle);
    // props.cameraPos.z = dist * Math.cos(newYAngle) * Math.sin(newXZAngle);
    // props.cameraPos.y = dist * Math.sin(newYAngle);
    //
    // props.camera.position.set(props.cameraPos.x, props.cameraPos.y, props.cameraPos.z);
    // props.camera.lookAt(new THREE.Vector3(0, 0, 0));
    //
    // props.lastMousePos = currMousePos;
}

renderer.domElement.onmouseup = (evt) => {
    props.dragging = false;

    props.pointLight.intensity = 0;

    simulator.generateParticles = false;
}

function initCamera() {
    props.camera = new THREE.PerspectiveCamera(
        75,
        WIDTH / HEIGHT,
        0.1,
        1000
    );

    props.camera.position.set(props.cameraPos.x, props.cameraPos.y, props.cameraPos.z);
    props.camera.lookAt(new THREE.Vector3(0, 0, 0));
}

function initContainer() {
    simulator.clearStaticPlanes();

    const texture = textureLoader.load('img/metal.jpg');
    const nrmTexture = textureLoader.load('img/metal_NRM.jpg');
    const specTexture = textureLoader.load('img/metal_SPEC.jpg');

    const containerMaterial = new THREE.MeshPhongMaterial({
        color: 0x666666,
        // specular: 0x666666,
        transparent: false,
        map: texture,
        normalMap: nrmTexture,
        normalScale: {x: 0.1, y: 0.1},
        specularMap:  specTexture,
    });

    scene.remove(props.cone);

    simulator.addStaticPlane(new StaticPlane(new THREE.Vector3(0, -10, 0), new THREE.Vector3(0, 1, 0)));

    const planeGeometry = new THREE.PlaneGeometry(20, 20);
    const plane1 = new THREE.Mesh(planeGeometry, containerMaterial);
    // plane1.position.set(0, 0, 10);
    scene.add(plane1);
}

function initObjects() {

    const particles = new THREE.BufferGeometry();

    const positions = new Float32Array(Constants.SMOKE.PARTICLE_NUM * 3);
    const velocities = new Float32Array(Constants.SMOKE.PARTICLE_NUM * 3);
    const ages = new Float32Array(Constants.SMOKE.PARTICLE_NUM);
    const states = new Float32Array(Constants.SMOKE.PARTICLE_NUM);

    for (let i = 0; i < Constants.SMOKE.PARTICLE_NUM; i++) {
        states[i] = 0.0;
        ages[i] = 0.0;
    }

    particles.addAttribute('position', new THREE.BufferAttribute(positions, 3));
    particles.addAttribute('velocity', new THREE.BufferAttribute(velocities, 3));
    particles.addAttribute('age', new THREE.BufferAttribute(ages, 1));
    particles.addAttribute('state', new THREE.BufferAttribute(states, 1));

    simulator.setParticles(particles);

    const particleShader = new THREE.ShaderMaterial({
        vertexShader: document.getElementById('vertexShader').textContent,
        fragmentShader: document.getElementById('fragmentShader').textContent,
        blending: THREE.AdditiveBlending,
        transparent: true,
    });

    const particleSystem = new THREE.LineSegments(particles, particleShader);
    scene.add(particleSystem);

    const smokeParticles = new THREE.BufferGeometry();
    const smokePositions = new Float32Array(Constants.SMOKE.PARTICLE_NUM * 3);
    const smokeVelocities = new Float32Array(Constants.SMOKE.PARTICLE_NUM * 3);
    const smokeAges = new Float32Array(Constants.SMOKE.PARTICLE_NUM);
    const smokeStates = new Float32Array(Constants.SMOKE.PARTICLE_NUM);

    for (let i = 0; i < Constants.SMOKE.PARTICLE_NUM; i++) {
        smokeStates[i] = 0.0;
        smokeAges[i] = 0.0;
    }

    smokeParticles.addAttribute('position', new THREE.BufferAttribute(smokePositions, 3));
    smokeParticles.addAttribute('velocity', new THREE.BufferAttribute(smokeVelocities, 3));
    smokeParticles.addAttribute('age', new THREE.BufferAttribute(smokeAges, 1));
    smokeParticles.addAttribute('state', new THREE.BufferAttribute(smokeStates, 1));

    simulator.setSmokeParticles(smokeParticles);

    const texture = textureLoader.load('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAACPFJREFUeNrMmNtuE1kWhl0+24kd4iSQYeibUZ4AiVdBggcECYkHQVzPVaPumaF7gCSOHTs+lV3l+T6zasaKAgkMLbWl7Trs07/+ddyVrNfr0p/5Vy79yX9V/54/f/6j1ktoP0wlL168+AzwS7+XL1/eusiTJ08215OTE7VRzbKsXqlUFtznAXYD+N27dzcCf/v27Y3rPnv27H8M3vXHpCSArwHmfaXX6+U0N6/RdlarVReAY+6XWy1BgIr3r169yr5ZxXcEJkNukvG8Pj09bU6n0z0ADXwXfaUqvzzPO+VyWdAyOeO5lCRJmzZ9+vTplHcrgK5/tJO0aAe0Xdr+wcFBb4dft9v13Q6tC9jD2WzW4+qYBq3j2MVi8dfxePwT10PAOrYK0GRbK/8Xg1vCOH5PQDAkyDms3Av21qi2LXO8qxXqJYyVeT7ANruArzImZ4zjxwFSjWSF6XwzwJCwFszJSJt2j013aJUAJ/hLxzcajREAyjG+Ili03up0OiteV3k+4n09PD6Pbea0VNXfVcUbBwhwCtENNbrpg3huBZsCbtJ62hkM7XKtxrzycrmszefzQ/t4vs/1mOtxrNeKNQ9dk/1qd2EwiQ0rIams3Q8whZpdqIn61qiuBSguWZvWg60hz1eO1TkAp1fnjmN4t16vjwCZB0gdbBqhKN9i9IsAk2ilAPdTSHgQrJ2Hx24Wg51emqY9Nh2weYVnQSSoMlH9Amm1WplxEYANAOf0T3g/CHVKxJLXV8ydYB75XRgUWGEn3aB/J9jTIapsUqPVWbSD4e/KTrvdnsHekk20tQ0Yfg3eGWoyQM2Ys+LdmHtZnKsB1jg7Pz+vIGgN7199DWAR63YKm2N+k4U2nsV9KwBuVA8ope/Sv0ffgo0Xeixth/vZxcVFF8coA3iIEBVi5gV9KWx2EOZCPwLcaDAYrOkrcMxuA9gIlQpUdWnkaLBuoJU5g7AgexFqKrVabcx1TIwrA7qmB08mk93Ly8tNRsEGa8xpwdABYfNn1pjJPGMrjHsIaf+G5d+4Lkh7Xw0ztVDtXniX6tg1dbHASnti8YbxDAwbL6ZPoVYAuWBMQp/PzlkyJgeULO/T9wtNNf6F9+loNJoxJkc4HVAn+53n9dcCdRGT5gFOJlXHstls9iOwziOTtbVBmNEJFrQyG3f29/frbsLm2tWYcZpYyhUtN5qsMYTlPeYdI/iAZ+PjiL6+e5M6b80khQSTuG+ZO2n1ImZyf6naXRC1g2O5EhzA7qFSvXcFQJleItwalea0+tXV1d9ga4Cwov7A/QpwY9b4yLWPqpUiowBZXcdT3XrIIhs82Aq+G9UjcYXNlzGmA9Al6ryAkQQghpQyhp6E1wquBIgEQC0ATk2LzkOQKQKlmgn9Ok2Vdx0A6nSfYv9K7D2+yUlWoeoiHmpnZZoSyl4N1lTdDFArrg/sR20LgFk8CHjFZjsAyOmTvSme2hY44+Z4dsK4EX0ZAiJDc393d/cfMF8Km66HmY2v22BjyxbHEe8MoilNFmVozaIZm6UsXALIiBDSAVRFT+d5U6hC0n29lHdX6edfh7kWsznz9XSdQqZmOo32iMAPqYwMV3OEWtyUi7Otmk+PFlCZBXdhzcC7qfdcGOB9w44hRQ8A5L7qFTSqlgHjXkvCGLcP0CZr+K5HO+j3+4esm9I3YcyKefnR0dGM6qhyfHycE25WNzlJOVJaEWb0vDWTL1ncgF0CRF3PY3FZltkHpmNUZvrqyI7FqmC0N356cQm1Xuq5hiDYuQeTlmZnVjnI97u52nxuGEPY2XZVc92La6Hqz3rH+LUlww0b7qCqLq2iB2LYLfrMsxr7I+5TmDKTpABMsSsF2qgd+5oyp0Ze9lnvvQJYjYySME/GTYNqrA4+q5rBdS/eTnWlrXrN53o5fiw2N7xYygO+r9pR0b551RgIeLPLSIF0Ju6bVNIt7qt7e3u+HwPsjDUuaUNjZWBIADhHaE2hF6HO+nB9XcVFNVF4czWuZbOJnuizBq9aAdRHrftc634AQIApzC0A1cbOEu5Na2veawLOsUjom3GYc0jfnHc6SW71A6MZLPejHnDf5XUGRT0MgN2guaiYN2demDKLdC2vonpRxWuuO7Byht0d0TIDMwA/yLKFBv097FmvltkUwQ7C03P6lgJkzox3s8CRbXtxOYJzEQuzLa9exPkii/ysJ1fDozsw8Inw8C82/cRGH03+bDKEiSHPnlEeWeZb0QJuCYiFgAB7igBD37Nm4RSm1zlnk2WhzYLBIvYV5488Kt1KeHSpEEBncHPLJTYe663mZJ8N2njsQJtkjBHIksp+ptVkr2nhylgj9AAWtRcdqxr7p1/KxcUZ9iLSTC0GF58yxlHpWJxaVhluxnhcYzgcHlqpBPMG7SaMfvBqzARI6oHJipmfZ+QJ4E0AVjeYXVtBl1ELLm8rFrJgrryl7rMIPVbRBudVhIQBrQkzTatmY2OEJKsWS3yrmxkmYG40Yc8Bc65DuBf9u3EMKDS4RLW3lvzrrQNMsqX2RjjP1MO3lbnnB5iQjX+aaWzWjNarAPJ09yvsGZrM3wfMq/K8KdGiDEth2gpIMxm/fv06/9aD+3rLu2U29cBjcNbbAFBUOebmpQDw7pl9lvRxFjEwG9sWBnnZRbBJlHB6rac/w9f3ffqIk76SjWgWrhMWG9Des8mV6ck1rOdMb2w+QKWX9GtPc48LpLaHzgPM32nnCDmNauic9sF1ipDyXZ8+AuQqPk8k4UxF1fPIGAh7OknfbAEYz8cNGDPD6MUpAphZPM+kCKDBTs0kCDi5ye6+69tMAF1vfQ4xHZ2aVfR8w0ocAXQma0SrsAGs/WxwBmSDdxmVt2r3LHL65s2b/A/5BBxgDUNnADIon2J37wHmweIjLPY9CAFMT7fy/gio9zyPAGluPqfd6Tvhd3+jFiTNamYCOO3RJqtDD+a+Q53vw/OXIZAHr9/ik0f2+PHjH/MB82u/+LT73yPjycmJVbLhRpuzuk62okI5ksD6pqxx/fv0H/KVPwDrSH5rWeHF2bXQ1Qhi7vSF9T8CDAACzkItVG3/hQAAAABJRU5ErkJggg==');

    const smokeMaterial = new THREE.PointsMaterial({
        // color: 0xffffff,
        map: texture,
        size: 4,
        transparent: true,
    });

    const smokeShader = new THREE.ShaderMaterial({
        vertexShader: document.getElementById('smokeVertexShader').textContent,
        fragmentShader: document.getElementById('smokeFragmentShader').textContent,
        blending: THREE.AdditiveBlending,
        transparent: true,
        uniforms: {
            texture1: {
                type: 't',
                value: texture,
            }
        }
    });

    const smokeParticleSystem = new THREE.Points(smokeParticles, smokeShader);
    scene.add(smokeParticleSystem);
}

function initLight() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(0, 0, 30);
    scene.add(directionalLight);

    props.pointLight = new THREE.PointLight(0x7777ff, 0, 500);
    props.pointLight.position.set(0, 0, 0.1);
    scene.add(props.pointLight);
}

initCamera();
initObjects();
initContainer();
initLight();

function simulate() {
    for (let i = 0; i < props.stepsPerFrame; i++) {
        simulator.simulate(0.01 / props.stepsPerFrame);
    }

    simulator.refreshDispaly();

    if (props.pointLight.intensity !== 0) {
        props.pointLight.intensity = Math.random() * 160 + 60;
    }

    renderer.render(scene, props.camera);

    requestAnimationFrame(simulate);
}
simulate();

},{"./Constants":1,"./Simulator":2,"./StaticPlane":3}]},{},[4]);
