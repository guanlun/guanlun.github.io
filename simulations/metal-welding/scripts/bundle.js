"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function e(t, n, r) {
    function s(o, u) {
        if (!n[o]) {
            if (!t[o]) {
                var a = typeof require == "function" && require;if (!u && a) return a(o, !0);if (i) return i(o, !0);var f = new Error("Cannot find module '" + o + "'");throw f.code = "MODULE_NOT_FOUND", f;
            }var l = n[o] = { exports: {} };t[o][0].call(l.exports, function (e) {
                var n = t[o][1][e];return s(n ? n : e);
            }, l, l.exports, e, t, n, r);
        }return n[o].exports;
    }var i = typeof require == "function" && require;for (var o = 0; o < r.length; o++) {
        s(r[o]);
    }return s;
})({ 1: [function (require, module, exports) {
        module.exports = {
            SMOKE: {
                PARTICLE_NUM: 2000
            },
            SPARK: {
                PARTICLE_NUM: 2000
            },
            VORTEX: {
                PARTICLE_NUM: 20
            }
        };
    }, {}], 2: [function (require, module, exports) {
        var Constants = require('./Constants');

        module.exports = function () {
            function Simulator() {
                _classCallCheck(this, Simulator);

                this._objects = [];
                this._triangles = [];

                this._currGenerated = 0;
                this._currSmokeGenerated = 0;
                this._currVortexGenerated = 0;

                this.startPos = {
                    x: 0,
                    y: 0,
                    z: 0
                };

                this.generateParticles = false;

                this._vortices = [];

                this._lastPos = [];
            }

            _createClass(Simulator, [{
                key: "addTriangle",
                value: function addTriangle(vertices, normal) {
                    this._triangles.push({
                        vertices: vertices,
                        normal: normal
                    });
                }
            }, {
                key: "setWelderPosition",
                value: function setWelderPosition(pos) {
                    this._welderPosition = pos;
                }
            }, {
                key: "setParticles",
                value: function setParticles(particles) {
                    this._particles = particles;
                }
            }, {
                key: "setSmokeParticles",
                value: function setSmokeParticles(smokeParticles) {
                    this._smokeParticles = smokeParticles;
                }
            }, {
                key: "simulate",
                value: function simulate() {
                    this.simulateVortices();
                    this.simulateSmoke();
                    this.simulateSpark();
                }
            }, {
                key: "simulateVortices",
                value: function simulateVortices() {
                    if (this.generateParticles) {
                        if (Math.random() > 0.9) {
                            var vIndex = this._currVortexGenerated % Constants.VORTEX.PARTICLE_NUM;

                            var vortex = {
                                pos: {
                                    x: this.startPos.x,
                                    y: this.startPos.y + 1.5,
                                    z: this.startPos.z
                                },
                                vel: {
                                    x: Math.random() * 0.01 - 0.005,
                                    y: Math.random() * 0.03 + 0.05,
                                    z: 0
                                },
                                radius: Math.random() * 1.5,
                                angularVel: Math.random() * 1 - 0.5,
                                age: 0,
                                active: true
                            };

                            this._vortices[vIndex] = vortex;

                            this._currVortexGenerated++;
                        }

                        for (var i = 0; i < Constants.VORTEX.PARTICLE_NUM; i++) {
                            var _vortex = this._vortices[i];

                            if (!_vortex || !_vortex.active) {
                                continue;
                            }

                            _vortex.pos.x += _vortex.vel.x;
                            _vortex.pos.y += _vortex.vel.y;
                            _vortex.pos.z += _vortex.vel.z;

                            _vortex.age += 0.01;

                            if (_vortex.age >= 1) {
                                _vortex.age = 0;
                                _vortex.active = false;
                            }
                        }
                    }
                }
            }, {
                key: "simulateSmoke",
                value: function simulateSmoke() {
                    var sp = this._smokeParticles.attributes.position.array;
                    var sv = this._smokeParticles.attributes.velocity.array;
                    var sa = this._smokeParticles.attributes.age.array;
                    var ss = this._smokeParticles.attributes.state.array;

                    if (this.generateParticles) {
                        var lastSmokeParticleIndex = this._currSmokeGenerated;

                        this._currSmokeGenerated += Math.floor(Math.random() * 2 + 2);

                        for (var i = lastSmokeParticleIndex; i < this._currSmokeGenerated; i++) {
                            var idx = i % Constants.SMOKE.PARTICLE_NUM;
                            ss[idx] = 1;
                            sa[idx] = 0;

                            sp[idx * 3] = this.startPos.x;
                            sp[idx * 3 + 1] = this.startPos.y;
                            sp[idx * 3 + 2] = this.startPos.z;

                            sv[idx * 3] = Math.random() * 0.01 - 0.005;
                            sv[idx * 3 + 1] = Math.random() * 0.03 + 0.05;
                            sv[idx * 3 + 2] = 0;
                        }
                    }

                    for (var _i = 0; _i < Constants.SMOKE.PARTICLE_NUM; _i++) {
                        if (ss[_i] === 1) {
                            for (var j = 0; j < this._vortices.length; j++) {
                                var vortex = this._vortices[j];

                                if (!vortex.active) {
                                    continue;
                                }

                                var diffX = sp[_i * 3] - vortex.pos.x;
                                var diffY = sp[_i * 3 + 1] - vortex.pos.y;

                                var dist = Math.sqrt(diffX * diffX + diffY * diffY);

                                if (dist < vortex.radius) {
                                    var p = 0.008 / (1 + dist * dist);
                                    var aVel = vortex.angularVel;

                                    sv[_i * 3] += -p * diffY * aVel;
                                    sv[_i * 3 + 1] += p * diffX * aVel;
                                }
                            }

                            sv[_i * 3] *= 0.98;
                            sv[_i * 3 + 1] *= 0.995;
                            sv[_i * 3 + 2] *= 0.995;

                            sp[_i * 3] += sv[_i * 3];
                            sp[_i * 3 + 1] += sv[_i * 3 + 1];
                            sp[_i * 3 + 2] += sv[_i * 3 + 2];

                            sa[_i] += 0.01;

                            if (sa[_i] > 3) {
                                // Recycle particles if the age is too large
                                sa[_i] = 0;
                                ss[_i] = 0;
                            }
                        }
                    }

                    this._smokeParticles.attributes.velocity.needsUpdate = true;
                    this._smokeParticles.attributes.position.needsUpdate = true;
                    this._smokeParticles.attributes.age.needsUpdate = true;
                    this._smokeParticles.attributes.state.needsUpdate = true;
                }
            }, {
                key: "simulateSpark",
                value: function simulateSpark() {
                    var p = this._particles.attributes.position.array;
                    var v = this._particles.attributes.velocity.array;
                    var a = this._particles.attributes.age.array;
                    var s = this._particles.attributes.state.array;

                    if (this.generateParticles) {
                        var lastParticleIndex = this._currGenerated;

                        this._currGenerated += Math.floor(Math.random() * 30 + 10);

                        for (var i = lastParticleIndex; i < this._currGenerated; i++) {
                            var idx = i % Constants.SPARK.PARTICLE_NUM;
                            s[idx] = 1;
                            a[idx] = 0;

                            p[idx * 3] = this.startPos.x;
                            p[idx * 3 + 1] = this.startPos.y;
                            p[idx * 3 + 2] = this.startPos.z;

                            v[idx * 3] = Math.random() * 0.1 - 0.05;
                            v[idx * 3 + 1] = Math.random() * 0.25;
                            v[idx * 3 + 2] = Math.random() * 0.05 + 0.05;

                            this._lastPos[idx * 3] = p[idx * 3];
                            this._lastPos[idx * 3 + 1] = p[idx * 3 + 1];
                            this._lastPos[idx * 3 + 2] = p[idx * 3 + 2];
                        }
                    }

                    for (var _i2 = 0; _i2 < Constants.SPARK.PARTICLE_NUM; _i2 += 2) {
                        if (s[_i2] === 1) {
                            v[_i2 * 3 + 1] -= 0.01;

                            p[_i2 * 3] = p[_i2 * 3 + 3];
                            p[_i2 * 3 + 1] = p[_i2 * 3 + 4];
                            p[_i2 * 3 + 2] = p[_i2 * 3 + 5];

                            p[_i2 * 3 + 3] += 2 * v[_i2 * 3];
                            p[_i2 * 3 + 4] += 2 * v[_i2 * 3 + 1];
                            p[_i2 * 3 + 5] += 2 * v[_i2 * 3 + 2];

                            var x = p[_i2 * 3 + 3];
                            var y = p[_i2 * 3 + 4];
                            var z = p[_i2 * 3 + 5];

                            a[_i2] += 0.002;
                            a[_i2 + 1] += 0.002;

                            var lp = this._lastPos;

                            var xr = x - this.startPos.x;
                            var yr = y - this.startPos.y;
                            var zr = z - this.startPos.z;

                            // Check AABB before doing point-triangle collision detection
                            if (xr > -1.25 && xr < 1.25 && yr > -6 && yr < 0 && zr > 0 && zr < 6.5) {
                                for (var ti = 0; ti < this._triangles.length; ti++) {
                                    var t = this._triangles[ti];

                                    // Any vertex on triangle
                                    var tv = t.vertices[0];
                                    var tp = {
                                        x: tv.x + this.startPos.x,
                                        y: tv.y + this.startPos.y,
                                        z: tv.z + this.startPos.z
                                    };
                                    var tn = t.normal;

                                    // point to point distance
                                    var diffX = x - tp.x;
                                    var diffY = y - tp.y;
                                    var diffZ = z - tp.z;
                                    var d = diffX * tn.x + diffY * tn.y + diffZ * tn.z;

                                    var lastDiffX = lp[_i2 * 3 + 3] - tp.x;
                                    var lastDiffY = lp[_i2 * 3 + 4] - tp.y;
                                    var lastDiffZ = lp[_i2 * 3 + 5] - tp.z;
                                    var lastD = lastDiffX * tn.x + lastDiffY * tn.y + lastDiffZ * tn.z;

                                    if (d < 0 && lastD > 0) {
                                        if (this._pointInTriangle(x - this.startPos.x, y - this.startPos.y, z - this.startPos.z, t.vertices)) {
                                            var dotVN = v[_i2 * 3] * tn.x + v[_i2 * 3 + 1] * tn.y + v[_i2 * 3 + 2] * tn.z;

                                            var vNormalX = tn.x * dotVN;
                                            var vNormalY = tn.y * dotVN;
                                            var vNormalZ = tn.z * dotVN;

                                            var vTangentX = v[_i2 * 3] - vNormalX;
                                            var vTangentY = v[_i2 * 3 + 1] - vNormalY;
                                            var vTangentZ = v[_i2 * 3 + 2] - vNormalZ;

                                            v[_i2 * 3] = -vNormalX + vTangentX * Math.random();
                                            v[_i2 * 3 + 1] = -vNormalY + vTangentY * Math.random();
                                            v[_i2 * 3 + 2] = -vNormalZ + vTangentZ * Math.random();
                                            a[_i2] = 0;
                                            break;
                                        }
                                    }
                                }
                            }

                            lp[_i2 * 3 + 3] = x;
                            lp[_i2 * 3 + 4] = y;
                            lp[_i2 * 3 + 5] = z;

                            if (a[_i2] > 1) {
                                // Recycle particles if the age is too large
                                a[_i2] = 0;
                                s[_i2] = 0;
                            }
                        }
                    }

                    this._particles.attributes.position.needsUpdate = true;
                    this._particles.attributes.velocity.needsUpdate = true;
                    this._particles.attributes.age.needsUpdate = true;
                    this._particles.attributes.state.needsUpdate = true;
                }
            }, {
                key: "_pointInTriangle",
                value: function _pointInTriangle(px, py, pz, vertices) {
                    var p1 = vertices[0];
                    var p2 = vertices[1];
                    var p3 = vertices[2];

                    var a = ((p2.z - p3.z) * (px - p3.x) + (p3.x - p2.x) * (pz - p3.z)) / ((p2.z - p3.z) * (p1.x - p3.x) + (p3.x - p2.x) * (p1.z - p3.z));
                    var b = ((p3.z - p1.z) * (px - p3.x) + (p1.x - p3.x) * (pz - p3.z)) / ((p2.z - p3.z) * (p1.x - p3.x) + (p3.x - p2.x) * (p1.z - p3.z));
                    var c = 1 - a - b;

                    return a > 0 && b > 0 && c > 0;
                }
            }]);

            return Simulator;
        }();
    }, { "./Constants": 1 }], 3: [function (require, module, exports) {
        var Constants = require('./Constants');
        var Simulator = require('./Simulator');
        var scene = new THREE.Scene();

        var WIDTH = 1000;
        var HEIGHT = 600;

        var props = {
            stepsPerFrame: 1,

            camera: null,
            cameraPos: {
                x: 0,
                y: 0,
                z: 20
            },

            dragging: false,
            lastMousePos: null,

            pointLight: null,

            welder: null
        };

        var simulator = new Simulator();

        var renderer = new THREE.WebGLRenderer({
            antialias: true
        });

        var raycaster = new THREE.Raycaster();
        var mouseVec = new THREE.Vector2();

        var textureLoader = new THREE.TextureLoader();
        var objLoader = new THREE.OBJLoader();

        objLoader.load('obj/welder.obj', function (obj) {
            obj.traverse(function (child) {
                if (child.type === 'Mesh') {
                    (function () {
                        var welder = child;

                        welder.material = new THREE.MeshPhongMaterial({
                            color: 0x333333
                        });
                        scene.add(welder);

                        var welderGeometry = new THREE.Geometry().fromBufferGeometry(welder.geometry);
                        welderGeometry.faces.forEach(function (f) {
                            var v1 = welderGeometry.vertices[f.a];
                            var v2 = welderGeometry.vertices[f.b];
                            var v3 = welderGeometry.vertices[f.c];

                            simulator.addTriangle([v1, v2, v3], f.normal);
                        });

                        props.welder = welder;
                    })();
                }
            });
        });

        renderer.setSize(WIDTH, HEIGHT);
        renderer.setClearColor(0x000000, 1);
        document.body.appendChild(renderer.domElement);

        renderer.domElement.onwheel = function (evt) {
            evt.preventDefault(0);
            var multiplier = 1 + evt.deltaY * 0.001;

            props.cameraPos.x *= multiplier;
            props.cameraPos.z *= multiplier;
            props.cameraPos.y *= multiplier;

            props.camera.position.set(props.cameraPos.x, props.cameraPos.y, props.cameraPos.z);
            props.camera.lookAt(new THREE.Vector3(0, 0, 0));
        };

        function handleMousePos(evt) {
            mouseVec.x = event.clientX / WIDTH * 2 - 1;
            mouseVec.y = -(event.clientY / HEIGHT) * 2 + 1;

            raycaster.setFromCamera(mouseVec, props.camera);
            var intersects = raycaster.intersectObjects(scene.children);
            if (intersects.length > 0) {
                var p = intersects[0].point;

                var x = p.x;
                var y = p.y;
                var z = 0.1;

                simulator.startPos = {
                    x: x,
                    y: y,
                    z: z
                };

                props.pointLight.position.set(x, y, z);
                props.welder.position.set(x, y, z);
                simulator.setWelderPosition(x, y, z);
            }
        }

        renderer.domElement.onmousedown = function (evt) {
            props.dragging = true;

            props.pointLight.intensity = 50;

            handleMousePos(evt);

            simulator.generateParticles = true;
        };

        renderer.domElement.onmousemove = function (evt) {
            if (!props.dragging) {
                return;
            }

            handleMousePos(evt);
        };

        renderer.domElement.onmouseup = function (evt) {
            props.dragging = false;

            props.pointLight.intensity = 0;

            simulator.generateParticles = false;
        };

        function initCamera() {
            props.camera = new THREE.PerspectiveCamera(75, WIDTH / HEIGHT, 0.1, 1000);

            props.camera.position.set(props.cameraPos.x, props.cameraPos.y, props.cameraPos.z);
            props.camera.lookAt(new THREE.Vector3(0, 0, 0));
        }

        function initContainer() {
            var texture = textureLoader.load('img/metal.jpg');
            var specTexture = textureLoader.load('img/metal_SPEC.jpg');

            var containerMaterial = new THREE.MeshPhongMaterial({
                color: 0x666666,
                transparent: false,
                map: texture,
                specularMap: specTexture
            });

            scene.remove(props.cone);

            var planeGeometry = new THREE.PlaneGeometry(20, 20);
            var plane1 = new THREE.Mesh(planeGeometry, containerMaterial);
            scene.add(plane1);
        }

        function initObjects() {
            var particles = new THREE.BufferGeometry();

            var positions = new Float32Array(Constants.SMOKE.PARTICLE_NUM * 3);
            var velocities = new Float32Array(Constants.SMOKE.PARTICLE_NUM * 3);
            var ages = new Float32Array(Constants.SMOKE.PARTICLE_NUM);
            var states = new Float32Array(Constants.SMOKE.PARTICLE_NUM);

            for (var i = 0; i < Constants.SMOKE.PARTICLE_NUM; i++) {
                states[i] = 0.0;
                ages[i] = 0.0;
            }

            particles.addAttribute('position', new THREE.BufferAttribute(positions, 3));
            particles.addAttribute('velocity', new THREE.BufferAttribute(velocities, 3));
            particles.addAttribute('age', new THREE.BufferAttribute(ages, 1));
            particles.addAttribute('state', new THREE.BufferAttribute(states, 1));

            simulator.setParticles(particles);

            var particleShader = new THREE.ShaderMaterial({
                vertexShader: document.getElementById('vertexShader').textContent,
                fragmentShader: document.getElementById('fragmentShader').textContent,
                blending: THREE.AdditiveBlending,
                transparent: true
            });

            var particleSystem = new THREE.LineSegments(particles, particleShader);
            scene.add(particleSystem);

            var smokeParticles = new THREE.BufferGeometry();
            var smokePositions = new Float32Array(Constants.SMOKE.PARTICLE_NUM * 3);
            var smokeVelocities = new Float32Array(Constants.SMOKE.PARTICLE_NUM * 3);
            var smokeAges = new Float32Array(Constants.SMOKE.PARTICLE_NUM);
            var smokeStates = new Float32Array(Constants.SMOKE.PARTICLE_NUM);

            for (var _i3 = 0; _i3 < Constants.SMOKE.PARTICLE_NUM; _i3++) {
                smokeStates[_i3] = 0.0;
                smokeAges[_i3] = 0.0;
            }

            smokeParticles.addAttribute('position', new THREE.BufferAttribute(smokePositions, 3));
            smokeParticles.addAttribute('velocity', new THREE.BufferAttribute(smokeVelocities, 3));
            smokeParticles.addAttribute('age', new THREE.BufferAttribute(smokeAges, 1));
            smokeParticles.addAttribute('state', new THREE.BufferAttribute(smokeStates, 1));

            simulator.setSmokeParticles(smokeParticles);

            var texture = textureLoader.load('img/smoke-sprite.png');

            var smokeShader = new THREE.ShaderMaterial({
                vertexShader: document.getElementById('smokeVertexShader').textContent,
                fragmentShader: document.getElementById('smokeFragmentShader').textContent,
                blending: THREE.AdditiveBlending,
                transparent: true,
                uniforms: {
                    texture1: {
                        type: 't',
                        value: texture
                    }
                }
            });

            var smokeParticleSystem = new THREE.Points(smokeParticles, smokeShader);
            scene.add(smokeParticleSystem);
        }

        function initLight() {
            var ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
            scene.add(ambientLight);

            var directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
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
            for (var i = 0; i < props.stepsPerFrame; i++) {
                simulator.simulate(0.01 / props.stepsPerFrame);
            }

            if (props.pointLight.intensity !== 0) {
                props.pointLight.intensity = Math.random() * 160 + 60;
            }

            renderer.render(scene, props.camera);

            requestAnimationFrame(simulate);
        }
        simulate();
    }, { "./Constants": 1, "./Simulator": 2 }] }, {}, [3]);
