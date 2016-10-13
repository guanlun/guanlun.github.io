"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

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
        module.exports = function () {
            function Army(side) {
                _classCallCheck(this, Army);

                this.side = side;
                this.soldiers = [];
            }

            _createClass(Army, [{
                key: "simulate",
                value: function simulate(frame, state) {
                    var _this = this;

                    this.soldiers.forEach(function (s) {
                        if (_this.side === 'red') {
                            s.simulate(frame, _this, state.blueArmy, state.obstacles, _this.isDefending);
                        } else {
                            s.simulate(frame, _this, state.redArmy, state.obstacles, _this.isDefending);
                        }
                    });
                }
            }, {
                key: "render",
                value: function render(ctx) {
                    var color = this.side;
                    this.soldiers.forEach(function (s) {
                        s.render(ctx, color);
                    });
                }
            }, {
                key: "addSoldier",
                value: function addSoldier(s) {
                    s.army = this;

                    if (this.side === 'red') {
                        s.facing = {
                            x: 1,
                            y: 0
                        };
                    } else {
                        s.facing = {
                            x: -1,
                            y: 0
                        };
                    }
                    this.soldiers.push(s);

                    this.display.innerHTML = this.soldiers.length;
                }
            }, {
                key: "handleSoldierDeath",
                value: function handleSoldierDeath() {
                    this.display.innerHTML = parseInt(this.display.innerHTML) - 1;
                }
            }, {
                key: "clear",
                value: function clear() {
                    this.soldiers = [];
                }
            }]);

            return Army;
        }();
    }, {}], 2: [function (require, module, exports) {
        var Utils = require('./Utils');

        var Constants = require('./Constants');

        module.exports = function () {
            function Bow() {
                _classCallCheck(this, Bow);

                this.length = 400;
                this.minRange = 0;

                this.damage = 50;

                this.rotationSpeed = 0.04;

                this.currAttackFrame = 0;

                this.startPos = {
                    x: 2,
                    y: -5
                };

                this.offsetPos = 20;

                this.status = 'holding';

                this.type = 'bow';

                this.arrowVel = {
                    x: 0,
                    y: 0
                };

                this.arrowPos = {
                    x: 0,
                    y: 0
                };
            }

            _createClass(Bow, [{
                key: "simulate",
                value: function simulate(holder, target, facing) {
                    if (this.status === 'out') {
                        if (this.currAttackFrame === 0) {
                            this.arrowVel = {
                                x: Math.cos(facing) * 5,
                                y: Math.sin(facing) * 5
                            };

                            this.offsetPos = {
                                x: 0,
                                y: 0
                            };
                        }

                        this.currAttackFrame++;

                        if (this.currAttackFrame === 50) {
                            this.currAttackFrame = 0;
                        }

                        this.arrowPos.x += this.arrowVel.x;
                        this.arrowPos.y += this.arrowVel.y;
                    }
                }
            }, {
                key: "attack",
                value: function attack() {
                    if (this.status === 'holding') {
                        this.status = 'out';
                    }
                }
            }, {
                key: "defend",
                value: function defend(attackWeapon, attackAngle) {
                    var blockChance = Constants.BLOCK_CHANCE[this.type];

                    var rand = Math.random();

                    if (attackAngle < blockChance.angle) {
                        if (rand > blockChance[attackWeapon.type]) {
                            return attackWeapon.damage;
                        }
                    } else {
                        if (rand > 0.2) {
                            return attackWeapon.damage;
                        }
                    }

                    return 0;
                }
            }, {
                key: "render",
                value: function render(ctx) {
                    ctx.save();
                    ctx.translate(this.arrowPos.x, this.arrowPos.y);
                    ctx.beginPath();
                    ctx.moveTo(0, 0);
                    ctx.lineTo(0, 20);
                    ctx.closePath();
                    ctx.stroke();
                    ctx.restore();

                    ctx.beginPath();
                    ctx.moveTo(this.startPos.x, this.startPos.y);
                    ctx.lineTo(this.startPos.x - 10, this.startPos.y - 10);
                    ctx.quadraticCurveTo(this.startPos.x, this.startPos.y - 15, this.startPos.x + 10, this.startPos.y - 10);
                    ctx.closePath();
                    ctx.stroke();
                }
            }]);

            return Bow;
        }();
    }, { "./Constants": 3, "./Utils": 10 }], 3: [function (require, module, exports) {
        module.exports = {
            BLOCK_CHANCE: {
                sword: {
                    angle: -0.5,

                    sword: 0.8,
                    spear: 0.6,
                    shield: 0.3
                },
                spear: {
                    angle: -0.8,

                    sword: 0.3,
                    spear: 0.5,
                    shield: 0.1
                },
                shield: {
                    angle: 0,

                    sword: 0.9,
                    spear: 0.95,
                    shield: 0.9
                },
                bow: {
                    angle: -0.5,

                    sword: 0.2,
                    spear: 0.1,
                    shield: 0.3
                }
            }
        };
    }, {}], 4: [function (require, module, exports) {
        var Soldier = require('./Soldier');
        var Utils = require('./Utils');

        var OVERCHARGE_FRAME = 60;
        var COOLDOWN_FRAME = 20;

        module.exports = function (_Soldier) {
            _inherits(Horseman, _Soldier);

            function Horseman(x, y) {
                _classCallCheck(this, Horseman);

                var _this2 = _possibleConstructorReturn(this, (Horseman.__proto__ || Object.getPrototypeOf(Horseman)).call(this, x, y, 'sword'));

                _this2.maxMovingSpeed = 3;

                _this2.weapon.rotationSpeed = 0.04;

                _this2.overcharge = OVERCHARGE_FRAME;

                _this2.attackCooldown = 0;

                _this2.speed = 0;

                _this2.isHorseman = true;

                _this2.hp = 100;
                return _this2;
            }

            _createClass(Horseman, [{
                key: "simulate",
                value: function simulate(frame, friendly, enemy, obstacles) {
                    var _this3 = this;

                    if (!this.alive) {
                        return;
                    }

                    var target = this.findTarget(enemy.soldiers, Math.PI / 3);

                    var newFacingX = void 0,
                        newFacingY = void 0;

                    var obstacleApproaching = false;

                    if (!Utils.isZeroVec(this.velocity)) {
                        for (var oi = 0; oi < obstacles.length; oi++) {
                            var o = obstacles[oi];

                            var vecToObstacleCenter = Utils.sub(o.position, this.position);

                            var movingDir = Utils.normalize(this.velocity);
                            var closingDist = Utils.dot(vecToObstacleCenter, movingDir);

                            if (closingDist < 0 || closingDist > o.radius) {
                                continue;
                            }

                            var closestPosition = Utils.add(this.position, Utils.scalarMult(closingDist, movingDir));
                            var outwardDir = Utils.sub(closestPosition, o.position);
                            var closestDistToCenter = Utils.dim(outwardDir);

                            if (closestDistToCenter > o.radius) {
                                continue;
                            }

                            var outwardUnitDir = Utils.normalize(outwardDir);
                            var turningTargetPosition = Utils.add(o.position, Utils.scalarMult(o.radius, outwardUnitDir));

                            var turiningDirection = Utils.sub(turningTargetPosition, this.position);

                            newFacingX = turiningDirection.x;
                            newFacingY = turiningDirection.y;

                            obstacleApproaching = true;

                            break;
                        }
                    }

                    if (!obstacleApproaching) {
                        if (target === null) {
                            if (this.overcharge === 0) {
                                newFacingX = -this.facing.y;
                                newFacingY = this.facing.x;
                            } else {
                                newFacingX = this.facing.x;
                                newFacingY = this.facing.y;

                                this.overcharge--;
                            }
                        } else {
                            var dist = this.distTo(target);

                            newFacingX = (target.position.x - this.position.x) / dist;
                            newFacingY = (target.position.y - this.position.y) / dist;

                            this.overcharge = OVERCHARGE_FRAME;
                        }
                    }

                    var newFacingAngle = Math.atan2(newFacingY, newFacingX);
                    var currFacingAngle = Math.atan2(this.facing.y, this.facing.x);

                    var rotationSpeed = this.weapon.rotationSpeed;

                    if (newFacingAngle > currFacingAngle) {
                        if (newFacingAngle - currFacingAngle < Math.PI) {
                            currFacingAngle = Math.min(newFacingAngle, currFacingAngle + rotationSpeed);
                        } else {
                            currFacingAngle = Math.min(newFacingAngle, currFacingAngle - rotationSpeed);
                        }
                    } else {
                        if (currFacingAngle - newFacingAngle < Math.PI) {
                            currFacingAngle = Math.max(newFacingAngle, currFacingAngle - rotationSpeed);
                        } else {
                            currFacingAngle = Math.max(newFacingAngle, currFacingAngle + rotationSpeed);
                        }
                    }

                    this.facing.x = Math.cos(currFacingAngle);
                    this.facing.y = Math.sin(currFacingAngle);

                    if (this.state === 'moving') {
                        this.target = target;

                        if (this.attackCooldown > 0) {
                            this.attackCooldown--;
                        }

                        if (target && this.distTo(target) < this.weapon.length) {
                            if (this.attackCooldown === 0) {
                                this.speed *= 0.5;

                                var rand = Math.random();

                                if (rand > 0.8) {
                                    this.target.hp = 0; // Instant kill
                                } else if (rand > 0.2) {
                                    this.target.hp -= this.speed * 40;
                                }

                                if (this.target.hp <= 0) {
                                    this.target.alive = false;

                                    this.target.army.handleSoldierDeath();
                                }

                                this.attackCooldown = COOLDOWN_FRAME;
                            }
                        }

                        if (this.speed < this.maxMovingSpeed) {
                            this.speed += 0.05;
                        }

                        this.velocity.x = this.facing.x * this.speed;
                        this.velocity.y = this.facing.y * this.speed;

                        var speed = Utils.dim(this.velocity);

                        friendly.soldiers.forEach(function (f) {
                            if (f === _this3 || !f.alive) {
                                return;
                            }

                            var xDiff = f.position.x - _this3.position.x;
                            var yDiff = f.position.y - _this3.position.y;

                            var dist = Utils.distance(_this3.position, f.position);

                            if (dist < 25) {
                                _this3.velocity.x -= 1 / dist * xDiff;
                                _this3.velocity.y -= 1 / dist * yDiff;
                            }
                        });

                        if (speed > this.maxMovingSpeed) {
                            this.velocity.x *= this.maxMovingSpeed / speed;
                            this.velocity.y *= this.maxMovingSpeed / speed;
                        }

                        this.position.x += this.velocity.x;
                        this.position.y += this.velocity.y;
                    }
                }
            }, {
                key: "handleAttack",
                value: function handleAttack(attackWeapon, angle, relativeClosingSpeed) {
                    var damage = 0;

                    var rand = Math.random();

                    if (attackWeapon.type === 'spear') {
                        if (angle < -0.7) {
                            if (rand > 0.4) {
                                damage = Math.abs(relativeClosingSpeed) * 30;
                            }
                        } else {
                            if (rand > 0.9) {
                                damage = 20;
                            }
                        }
                    } else {
                        if (angle < -0.3) {
                            if (rand > 0.8) {
                                damage = 30;
                            }
                        } else {
                            if (rand > 0.9) {
                                damage = 10;
                            }
                        }
                    }

                    if (damage > 0) {
                        this.hp -= damage;

                        this.speed *= 0.7;

                        if (this.hp <= 0) {
                            this.alive = false;

                            this.army.handleSoldierDeath();
                        }
                    }
                }
            }, {
                key: "renderAlive",
                value: function renderAlive(ctx) {
                    ctx.beginPath();

                    ctx.moveTo(0, -15);
                    ctx.lineTo(10, 15);
                    ctx.lineTo(-10, 15);

                    ctx.closePath();

                    ctx.fill();
                }
            }]);

            return Horseman;
        }(Soldier);
    }, { "./Soldier": 7, "./Utils": 10 }], 5: [function (require, module, exports) {
        var mountainImage = document.getElementById('mountain');

        module.exports = function () {
            function Obstacle(x, y, radius) {
                _classCallCheck(this, Obstacle);

                this.position = {
                    x: x,
                    y: y
                };
                this.radius = radius;
            }

            _createClass(Obstacle, [{
                key: "render",
                value: function render(ctx) {
                    ctx.save();
                    ctx.fillStyle = '#999';

                    var scale = this.radius / 500;
                    ctx.translate(this.position.x - scale * 300, this.position.y - scale * 200);

                    ctx.scale(scale, scale);

                    ctx.drawImage(mountainImage, 0, 0);

                    ctx.fill();
                    ctx.restore();
                }
            }]);

            return Obstacle;
        }();
    }, {}], 6: [function (require, module, exports) {
        var Utils = require('./Utils');
        var Weapon = require('./Weapon');

        module.exports = function (_Weapon) {
            _inherits(Shield, _Weapon);

            function Shield() {
                _classCallCheck(this, Shield);

                var _this4 = _possibleConstructorReturn(this, (Shield.__proto__ || Object.getPrototypeOf(Shield)).call(this));

                _this4.length = 10;
                _this4.damage = 5;

                _this4.minRange = 0;

                _this4.rotationSpeed = 0.1;

                _this4.currAttackFrame = 0;

                _this4.startPos = {
                    x: -8,
                    y: -5
                };

                _this4.offsetPos = 20;

                _this4.status = 'holding';

                _this4.type = 'shield';
                return _this4;
            }

            _createClass(Shield, [{
                key: "simulate",
                value: function simulate(holder, target, facing) {
                    if (this.status === 'out') {
                        this.currAttackFrame++;

                        if (this.currAttackFrame === 20) {
                            this.status = 'back';
                        }

                        this.offsetPos = 20 - this.currAttackFrame;

                        var reach = this.length - this.offsetPos;

                        var headPos = {
                            x: holder.position.x + reach * Math.sin(facing),
                            y: holder.position.y - reach * Math.cos(facing)
                        };

                        var diff = {
                            x: target.position.x - holder.position.x,
                            y: target.position.y - holder.position.y
                        };

                        var dist = Utils.dim(Utils.sub(headPos, target.position));

                        if (dist < 5) {
                            this.status = 'back';

                            var combatDir = Utils.normalize(diff);
                            var attackAngle = Utils.dot(combatDir, target.facing);

                            target.handleAttack(this, attackAngle);
                        }
                    } else if (this.status === 'back') {
                        this.currAttackFrame--;

                        this.offsetPos = 20 - this.currAttackFrame;

                        if (this.currAttackFrame === 0) {
                            this.status = 'holding';
                        }
                    }
                }
            }, {
                key: "render",
                value: function render(ctx) {
                    ctx.save();

                    ctx.beginPath();
                    ctx.moveTo(this.startPos.x, this.startPos.y);
                    ctx.lineTo(this.startPos.x + 16, this.startPos.y);
                    ctx.closePath();
                    ctx.stroke();

                    ctx.restore();
                }
            }]);

            return Shield;
        }(Weapon);
    }, { "./Utils": 10, "./Weapon": 11 }], 7: [function (require, module, exports) {
        var Utils = require('./Utils');

        var Sword = require('./Sword');
        var Spear = require('./Spear');
        var Shield = require('./Shield');
        var Bow = require('./Bow');

        var CROSS_SIZE = 5;

        module.exports = function () {
            function Soldier(x, y, weaponType) {
                _classCallCheck(this, Soldier);

                this.attackInterval = 60;
                this.speedLimit = 1;
                this.dimension = 5;

                this.hp = 100;

                this.position = {
                    x: x,
                    y: y
                };

                this.velocity = {
                    x: 0,
                    y: 0
                };

                this.facing = {
                    x: 0,
                    y: -1
                };

                this.state = 'moving';
                this.target = null;

                this.alive = true;

                this.lastAttackFrame = 0;
                this.attackAnimationFrame = 0;
                this.attackCooldown = 0;

                switch (weaponType) {
                    case 'sword':
                        this.weapon = new Sword();
                        this.maxMovingSpeed = 1.0;
                        break;
                    case 'spear':
                        this.weapon = new Spear();
                        this.maxMovingSpeed = 0.4;
                        break;
                    case 'shield':
                        this.weapon = new Shield();
                        this.maxMovingSpeed = 0.4;
                        break;
                    case 'bow':
                        this.weapon = new Bow();
                        this.maxMovingSpeed = 0.7;
                        break;
                }
            }

            _createClass(Soldier, [{
                key: "simulate",
                value: function simulate(frame, friendly, enemy, obstacles, isDefending) {
                    var _this5 = this;

                    if (!this.alive) {
                        return;
                    }

                    var target = this.findTarget(enemy.soldiers);

                    if (target === null) {
                        return;
                    }

                    var dist = this.distTo(target);

                    var newFacingX = void 0,
                        newFacingY = void 0;

                    var obstacleApproaching = false;

                    if (!Utils.isZeroVec(this.velocity)) {
                        for (var oi = 0; oi < obstacles.length; oi++) {
                            var o = obstacles[oi];

                            var vecToObstacleCenter = Utils.sub(o.position, this.position);

                            var movingDir = Utils.normalize(this.velocity);
                            var closingDist = Utils.dot(vecToObstacleCenter, movingDir);

                            if (closingDist < 0 || closingDist > o.radius) {
                                continue;
                            }

                            var closestPosition = Utils.add(this.position, Utils.scalarMult(closingDist, movingDir));
                            var outwardDir = Utils.sub(closestPosition, o.position);
                            var closestDistToCenter = Utils.dim(outwardDir);

                            if (closestDistToCenter > o.radius) {
                                continue;
                            }

                            var outwardUnitDir = Utils.normalize(outwardDir);
                            var turningTargetPosition = Utils.add(o.position, Utils.scalarMult(o.radius, outwardUnitDir));

                            var turiningDirection = Utils.sub(turningTargetPosition, this.position);

                            newFacingX = turiningDirection.x;
                            newFacingY = turiningDirection.y;

                            obstacleApproaching = true;

                            break;
                        }
                    }

                    if (!obstacleApproaching) {
                        newFacingX = (target.position.x - this.position.x) / dist;
                        newFacingY = (target.position.y - this.position.y) / dist;
                    }

                    var newFacingAngle = Math.atan2(newFacingY, newFacingX);
                    var currFacingAngle = Math.atan2(this.facing.y, this.facing.x);

                    var rotationSpeed = this.weapon.rotationSpeed;

                    if (newFacingAngle > currFacingAngle) {
                        if (newFacingAngle - currFacingAngle < Math.PI) {
                            currFacingAngle = Math.min(newFacingAngle, currFacingAngle + rotationSpeed);
                        } else {
                            currFacingAngle = Math.min(newFacingAngle, currFacingAngle - rotationSpeed);
                        }
                    } else {
                        if (currFacingAngle - newFacingAngle < Math.PI) {
                            currFacingAngle = Math.max(newFacingAngle, currFacingAngle - rotationSpeed);
                        } else {
                            currFacingAngle = Math.max(newFacingAngle, currFacingAngle + rotationSpeed);
                        }
                    }

                    this.facing.x = Math.cos(currFacingAngle);
                    this.facing.y = Math.sin(currFacingAngle);

                    if (this.state === 'moving') {
                        this.target = target;

                        if (this.attackCooldown > 0) {
                            this.attackCooldown--;
                        }

                        if (dist > this.weapon.length) {
                            this.velocity.x += this.facing.x * 0.02;
                            this.velocity.y += this.facing.y * 0.02;

                            if (Utils.dim(this.velocity) > this.maxMovingSpeed) {
                                this.velocity = Utils.normalize(this.velocity);

                                this.velocity.x *= this.maxMovingSpeed;
                                this.velocity.y *= this.maxMovingSpeed;
                            }

                            friendly.soldiers.forEach(function (f) {
                                if (f === _this5 || !f.alive) {
                                    return;
                                }

                                var xDiff = f.position.x - _this5.position.x;
                                var yDiff = f.position.y - _this5.position.y;

                                var dist = Utils.distance(_this5.position, f.position);

                                if (dist < 10) {
                                    _this5.velocity.x -= 0.5 / dist * xDiff;
                                    _this5.velocity.y -= 0.5 / dist * yDiff;
                                }
                            });

                            if (!isDefending) {
                                this.position.x += this.velocity.x;
                                this.position.y += this.velocity.y;
                            }
                        } else if (dist < this.weapon.minRange) {
                            this.state = 'backing-up';
                        } else {
                            this.attack(target, frame);
                        }
                    } else if (this.state === 'backing-up') {
                        if (dist > this.weapon.minRange) {
                            this.state = 'moving';
                        }

                        this.position.x -= this.facing.x * 0.5;
                        this.position.y -= this.facing.y * 0.5;
                    }

                    if (this.attackCooldown === 0) {
                        var facing = Math.atan2(this.facing.y, this.facing.x) + Math.PI / 2;

                        this.weapon.simulate(this, target, facing);
                    }
                }
            }, {
                key: "attackCompleted",
                value: function attackCompleted() {
                    this.attackCooldown = 30;
                }
            }, {
                key: "handleAttack",
                value: function handleAttack(attackWeapon, angle) {
                    var damage = this.weapon.defend(attackWeapon, angle);

                    if (damage > 0) {
                        this.hp -= damage;

                        this.velocity.x = 0;
                        this.velocity.y = 0;

                        if (this.hp <= 0) {
                            this.alive = false;

                            this.army.handleSoldierDeath();
                        }
                    }
                }
            }, {
                key: "attack",
                value: function attack(target, frame) {
                    this.weapon.attack();
                }
            }, {
                key: "renderAlive",
                value: function renderAlive(ctx) {
                    ctx.arc(0, 0, this.dimension, 0, Math.PI * 2);
                    ctx.fill();

                    if (this.isGeneral) {
                        ctx.arc(0, 0, this.dimension * 2, 0, Math.PI * 2);
                        ctx.stroke();
                    }

                    this.weapon.render(ctx);
                }
            }, {
                key: "render",
                value: function render(ctx, color) {
                    var _position = this.position;
                    var x = _position.x;
                    var y = _position.y;


                    ctx.fillStyle = color;
                    ctx.strokeStyle = color;

                    ctx.save();

                    var facing = Math.atan2(this.facing.y, this.facing.x) + Math.PI / 2;
                    ctx.translate(x, y);
                    ctx.rotate(facing);

                    ctx.beginPath();
                    if (this.alive) {
                        this.renderAlive(ctx);
                    } else {
                        ctx.moveTo(-CROSS_SIZE, -CROSS_SIZE);
                        ctx.lineTo(CROSS_SIZE, CROSS_SIZE);
                        ctx.closePath();

                        ctx.moveTo(-CROSS_SIZE, CROSS_SIZE);
                        ctx.lineTo(CROSS_SIZE, -CROSS_SIZE);
                        ctx.closePath();
                        ctx.stroke();
                    }

                    ctx.restore();
                }
            }, {
                key: "distTo",
                value: function distTo(soldier) {
                    var xDiff = soldier.position.x - this.position.x;
                    var yDiff = soldier.position.y - this.position.y;

                    return Math.sqrt(xDiff * xDiff + yDiff * yDiff);
                }
            }, {
                key: "findTarget",
                value: function findTarget(enemySoldiers, angle) {
                    if (angle === undefined) {
                        angle = Math.PI;
                    }

                    var minDist = Number.MAX_VALUE;
                    var target = null;

                    for (var i = 0; i < enemySoldiers.length; i++) {
                        var es = enemySoldiers[i];

                        if (!es.alive) {
                            continue;
                        }

                        var diff = Utils.sub(es.position, this.position);
                        if (Utils.angleBetween(diff, this.facing) < Math.cos(angle)) {
                            continue;
                        }

                        var dist = this.distTo(es);

                        if (dist < minDist) {
                            minDist = dist;

                            target = es;
                        }
                    }

                    return target;
                }
            }]);

            return Soldier;
        }();
    }, { "./Bow": 2, "./Shield": 6, "./Spear": 8, "./Sword": 9, "./Utils": 10 }], 8: [function (require, module, exports) {
        var Utils = require('./Utils');
        var Weapon = require('./Weapon');

        module.exports = function (_Weapon2) {
            _inherits(Spear, _Weapon2);

            function Spear() {
                _classCallCheck(this, Spear);

                var _this6 = _possibleConstructorReturn(this, (Spear.__proto__ || Object.getPrototypeOf(Spear)).call(this));

                _this6.length = 60;
                _this6.minRange = 40;

                _this6.damage = 50;

                _this6.rotationSpeed = 0.04;

                _this6.currAttackFrame = 0;

                _this6.startPos = {
                    x: 2,
                    y: -5
                };

                _this6.offsetPos = 20;

                _this6.status = 'holding';

                _this6.type = 'spear';
                return _this6;
            }

            _createClass(Spear, [{
                key: "simulate",
                value: function simulate(holder, target, facing) {
                    if (this.status === 'out') {
                        this.currAttackFrame++;

                        if (this.currAttackFrame === 20) {
                            this.status = 'back';
                        }

                        this.offsetPos = 20 - this.currAttackFrame;

                        var reach = this.length - this.offsetPos;

                        var headPos = {
                            x: holder.position.x + reach * Math.sin(facing),
                            y: holder.position.y - reach * Math.cos(facing)
                        };

                        var diff = {
                            x: target.position.x - holder.position.x,
                            y: target.position.y - holder.position.y
                        };

                        var relativeVel = Utils.sub(target.velocity, holder.velocity);
                        var combatDir = Utils.normalize(diff);

                        var relativeClosingSpeed = Utils.dot(relativeVel, combatDir);

                        var attackFrameThreshold = 10 / relativeClosingSpeed;

                        var dist = Utils.dim(Utils.sub(headPos, target.position));

                        if (dist < 5 && this.currAttackFrame > attackFrameThreshold) {
                            this.status = 'back';

                            var attackAngle = Utils.dot(combatDir, target.facing);

                            target.handleAttack(this, attackAngle, relativeClosingSpeed);

                            holder.attackCompleted();
                        }
                    } else if (this.status === 'back') {
                        this.currAttackFrame--;

                        this.offsetPos = 20 - this.currAttackFrame;

                        if (this.currAttackFrame === 0) {
                            this.status = 'holding';
                        }
                    }
                }
            }, {
                key: "render",
                value: function render(ctx) {
                    ctx.save();
                    ctx.translate(0, this.offsetPos);

                    ctx.beginPath();
                    ctx.moveTo(this.startPos.x, this.startPos.y - this.length);
                    ctx.lineTo(this.startPos.x, this.startPos.y);
                    ctx.closePath();
                    ctx.stroke();

                    ctx.restore();
                }
            }]);

            return Spear;
        }(Weapon);
    }, { "./Utils": 10, "./Weapon": 11 }], 9: [function (require, module, exports) {
        var Utils = require('./Utils');
        var Weapon = require('./Weapon');

        module.exports = function (_Weapon3) {
            _inherits(Sword, _Weapon3);

            function Sword() {
                _classCallCheck(this, Sword);

                var _this7 = _possibleConstructorReturn(this, (Sword.__proto__ || Object.getPrototypeOf(Sword)).call(this));

                _this7.length = 20;
                _this7.damage = 30;

                _this7.minRange = 0;

                _this7.rotationSpeed = 0.1;

                _this7.currAttackFrame = 0;

                _this7.startPos = {
                    x: 2,
                    y: -5
                };

                _this7.offsetAngle = Math.PI / 4;

                _this7.status = 'holding';

                _this7.type = 'sword';
                return _this7;
            }

            _createClass(Sword, [{
                key: "simulate",
                value: function simulate(holder, target, facing) {
                    if (this.status === 'out') {
                        this.currAttackFrame++;

                        var pointing = facing - this.offsetAngle;

                        var normalX = Math.cos(pointing);
                        var normalY = Math.sin(pointing);

                        var diff = {
                            x: target.position.x - holder.position.x,
                            y: target.position.y - holder.position.y
                        };

                        var weaponDist = Math.abs(diff.x * normalX + diff.y * normalY);

                        if (weaponDist < 5) {
                            this.status = 'back';

                            var combatDir = Utils.normalize(diff);
                            var attackAngle = Utils.dot(combatDir, target.facing);

                            var targetDist = Utils.dim(Utils.sub(holder.position, target.position));

                            if (targetDist < 25) {
                                target.handleAttack(this, attackAngle);
                            }
                        }
                    } else if (this.status === 'back') {
                        this.currAttackFrame--;

                        if (this.currAttackFrame === 0) {
                            this.status = 'holding';
                        }
                    }
                }
            }, {
                key: "render",
                value: function render(ctx) {
                    this.offsetAngle = Math.PI / 4 * (1 - this.currAttackFrame / 30);
                    ctx.save();
                    ctx.rotate(this.offsetAngle);

                    ctx.beginPath();
                    ctx.moveTo(this.startPos.x, this.startPos.y);
                    ctx.lineTo(this.startPos.x, this.startPos.y - this.length);
                    ctx.quadraticCurveTo(this.startPos.x - 5, this.startPos.y + 3, this.startPos.x, this.startPos.y);
                    ctx.closePath();

                    ctx.moveTo(this.startPos.x - 4, this.startPos.y - 2);
                    ctx.lineTo(this.startPos.x + 3, this.startPos.y - 2);
                    ctx.closePath();
                    ctx.stroke();

                    ctx.restore();
                }
            }]);

            return Sword;
        }(Weapon);
    }, { "./Utils": 10, "./Weapon": 11 }], 10: [function (require, module, exports) {
        module.exports = function () {
            function Utils() {
                _classCallCheck(this, Utils);
            }

            _createClass(Utils, null, [{
                key: "dim",
                value: function dim(vec) {
                    return Math.sqrt(vec.x * vec.x + vec.y * vec.y);
                }
            }, {
                key: "add",
                value: function add(vec1, vec2) {
                    return {
                        x: vec1.x + vec2.x,
                        y: vec1.y + vec2.y
                    };
                }
            }, {
                key: "sub",
                value: function sub(vec1, vec2) {
                    return {
                        x: vec1.x - vec2.x,
                        y: vec1.y - vec2.y
                    };
                }
            }, {
                key: "dot",
                value: function dot(vec1, vec2) {
                    return vec1.x * vec2.x + vec1.y * vec2.y;
                }
            }, {
                key: "scalarMult",
                value: function scalarMult(s, v) {
                    return {
                        x: s * v.x,
                        y: s * v.y
                    };
                }
            }, {
                key: "normalize",
                value: function normalize(vec) {
                    var len = Math.sqrt(vec.x * vec.x + vec.y * vec.y);

                    return {
                        x: vec.x / len,
                        y: vec.y / len
                    };
                }
            }, {
                key: "angleBetween",
                value: function angleBetween(vec1, vec2) {
                    var dotProduct = Utils.dot(vec1, vec2);
                    var dimProduct = Utils.dim(vec1) * Utils.dim(vec2);

                    return dotProduct / dimProduct;
                }
            }, {
                key: "distance",
                value: function distance(vec1, vec2) {
                    var diffX = vec1.x - vec2.x;
                    var diffY = vec1.y - vec2.y;
                    return Math.sqrt(diffX * diffX + diffY * diffY);
                }
            }, {
                key: "isZeroVec",
                value: function isZeroVec(v) {
                    return Utils.dim(v) < 0.001;
                }
            }]);

            return Utils;
        }();
    }, {}], 11: [function (require, module, exports) {
        var Constants = require('./Constants');

        module.exports = function () {
            function Weapon() {
                _classCallCheck(this, Weapon);
            }

            _createClass(Weapon, [{
                key: "attack",
                value: function attack() {
                    if (this.status === 'holding') {
                        this.status = 'out';
                    }
                }
            }, {
                key: "defend",
                value: function defend(attackWeapon, attackAngle) {
                    var blockChance = Constants.BLOCK_CHANCE[this.type];

                    var rand = Math.random();

                    if (attackAngle < blockChance.angle) {
                        if (rand > blockChance[attackWeapon.type]) {
                            return attackWeapon.damage;
                        }
                    } else {
                        if (rand > 0.2) {
                            return attackWeapon.damage;
                        }
                    }

                    return 0;
                }
            }]);

            return Weapon;
        }();
    }, { "./Constants": 3 }], 12: [function (require, module, exports) {
        var Soldier = require('./Soldier');
        var Horseman = require('./Horseman');
        var Army = require('./Army');

        var Obstacle = require('./Obstacle');

        var canvas = document.getElementById('canvas');
        var context = canvas.getContext('2d');

        var state = {
            simulating: false,
            redArmy: new Army('red'),
            blueArmy: new Army('blue'),

            obstacles: []
        };

        state.redArmy.display = document.getElementById('red-display');
        state.blueArmy.display = document.getElementById('blue-display');

        var frame = 0;

        var currSoliderType = 'sword';

        function loadPreset1() {
            state.redArmy.clear();
            state.blueArmy.clear();
            state.obstacles = [];

            for (var i = 0; i < 250; i++) {
                var x = Math.random() * 300 + 50;
                var y = Math.random() * 500 + 150;

                state.redArmy.addSoldier(new Soldier(x, y, 'sword'));
            }

            for (var _i = 0; _i < 45; _i++) {
                var _x = 500 + Math.random() * 2;
                var _y = 60 + _i * 16;

                state.blueArmy.addSoldier(new Soldier(_x, _y, 'shield'));
            }

            for (var _i2 = 0; _i2 < 45; _i2++) {
                var _x2 = 510 + Math.random() * 2;
                var _y2 = 70 + _i2 * 16;

                state.blueArmy.addSoldier(new Soldier(_x2, _y2, 'shield'));
            }

            for (var _i3 = 0; _i3 < 40; _i3++) {
                var _x3 = 560 + Math.random() * 3;
                var _y3 = 130 + _i3 * 14;

                state.blueArmy.addSoldier(new Soldier(_x3, _y3, 'spear'));
            }

            for (var _i4 = 0; _i4 < 40; _i4++) {
                var _x4 = 600 + Math.random() * 3;
                var _y4 = 142 + _i4 * 14;

                state.blueArmy.addSoldier(new Soldier(_x4, _y4, 'spear'));
            }
        }

        function loadPreset2() {
            state.redArmy.clear();
            state.blueArmy.clear();
            state.obstacles = [];

            for (var i = 0; i < 40; i++) {
                state.redArmy.addSoldier(new Soldier(200 + Math.random() * 2, 120 + 15 * i, 'sword'));
            }

            for (var _i5 = 0; _i5 < 40; _i5++) {
                state.redArmy.addSoldier(new Soldier(220 + Math.random() * 2, 125 + 15 * _i5, 'sword'));
            }

            for (var _i6 = 0; _i6 < 40; _i6++) {
                state.redArmy.addSoldier(new Soldier(240 + Math.random() * 2, 130 + 15 * _i6, 'sword'));
            }

            for (var _i7 = 0; _i7 < 40; _i7++) {
                state.redArmy.addSoldier(new Soldier(260 + Math.random() * 2, 125 + 15 * _i7, 'sword'));
            }

            for (var _i8 = 0; _i8 < 15; _i8++) {
                var horseman = new Horseman(750 + Math.random() * 2, _i8 * 30 + 215);
                horseman.facing = {
                    x: -1,
                    y: 0
                };
                state.blueArmy.addSoldier(horseman);
            }

            for (var _i9 = 0; _i9 < 15; _i9++) {
                var _horseman = new Horseman(800 + Math.random() * 2, _i9 * 30 + 200);
                _horseman.facing = {
                    x: -1,
                    y: 0
                };
                state.blueArmy.addSoldier(_horseman);
            }

            for (var _i10 = 0; _i10 < 15; _i10++) {
                var _horseman2 = new Horseman(850 + Math.random() * 2, _i10 * 30 + 215);
                _horseman2.facing = {
                    x: -1,
                    y: 0
                };
                state.blueArmy.addSoldier(_horseman2);
            }

            for (var _i11 = 0; _i11 < 15; _i11++) {
                var _horseman3 = new Horseman(900 + Math.random() * 2, _i11 * 30 + 200);
                _horseman3.facing = {
                    x: -1,
                    y: 0
                };
                state.blueArmy.addSoldier(_horseman3);
            }
        }

        function loadPreset3() {
            state.redArmy.clear();
            state.blueArmy.clear();
            state.obstacles = [];

            for (var i = 0; i < 40; i++) {
                state.redArmy.addSoldier(new Soldier(200 + Math.random() * 2, 120 + 15 * i, 'spear'));
            }

            for (var _i12 = 0; _i12 < 40; _i12++) {
                state.redArmy.addSoldier(new Soldier(220 + Math.random() * 2, 125 + 15 * _i12, 'spear'));
            }

            for (var _i13 = 0; _i13 < 40; _i13++) {
                state.redArmy.addSoldier(new Soldier(240 + Math.random() * 2, 130 + 15 * _i13, 'spear'));
            }

            for (var _i14 = 0; _i14 < 40; _i14++) {
                state.redArmy.addSoldier(new Soldier(260 + Math.random() * 2, 125 + 15 * _i14, 'spear'));
            }

            for (var _i15 = 0; _i15 < 15; _i15++) {
                var horseman = new Horseman(750 + Math.random() * 2, _i15 * 30 + 215);
                horseman.facing = {
                    x: -1,
                    y: 0
                };
                state.blueArmy.addSoldier(horseman);
            }

            for (var _i16 = 0; _i16 < 15; _i16++) {
                var _horseman4 = new Horseman(800 + Math.random() * 2, _i16 * 30 + 200);
                _horseman4.facing = {
                    x: -1,
                    y: 0
                };
                state.blueArmy.addSoldier(_horseman4);
            }

            for (var _i17 = 0; _i17 < 15; _i17++) {
                var _horseman5 = new Horseman(850 + Math.random() * 2, _i17 * 30 + 215);
                _horseman5.facing = {
                    x: -1,
                    y: 0
                };
                state.blueArmy.addSoldier(_horseman5);
            }

            for (var _i18 = 0; _i18 < 15; _i18++) {
                var _horseman6 = new Horseman(900 + Math.random() * 2, _i18 * 30 + 200);
                _horseman6.facing = {
                    x: -1,
                    y: 0
                };
                state.blueArmy.addSoldier(_horseman6);
            }
        }

        function loadPreset4() {
            state.redArmy.clear();
            state.blueArmy.clear();
            state.obstacles = [new Obstacle(600, 250, 150), new Obstacle(580, 500, 130), new Obstacle(400, 400, 100)];

            for (var i = 0; i < 40; i++) {
                state.redArmy.addSoldier(new Soldier(200 + Math.random() * 2, 120 + 15 * i, 'spear'));
            }

            for (var _i19 = 0; _i19 < 40; _i19++) {
                state.redArmy.addSoldier(new Soldier(220 + Math.random() * 2, 125 + 15 * _i19, 'spear'));
            }

            for (var _i20 = 0; _i20 < 40; _i20++) {
                state.redArmy.addSoldier(new Soldier(240 + Math.random() * 2, 130 + 15 * _i20, 'spear'));
            }

            for (var _i21 = 0; _i21 < 40; _i21++) {
                state.redArmy.addSoldier(new Soldier(260 + Math.random() * 2, 125 + 15 * _i21, 'spear'));
            }

            for (var _i22 = 0; _i22 < 15; _i22++) {
                var horseman = new Horseman(750 + Math.random() * 2, _i22 * 30 + 215);
                horseman.facing = {
                    x: -1,
                    y: 0
                };
                state.blueArmy.addSoldier(horseman);
            }

            for (var _i23 = 0; _i23 < 15; _i23++) {
                var _horseman7 = new Horseman(800 + Math.random() * 2, _i23 * 30 + 200);
                _horseman7.facing = {
                    x: -1,
                    y: 0
                };
                state.blueArmy.addSoldier(_horseman7);
            }

            for (var _i24 = 0; _i24 < 15; _i24++) {
                var _horseman8 = new Horseman(850 + Math.random() * 2, _i24 * 30 + 215);
                _horseman8.facing = {
                    x: -1,
                    y: 0
                };
                state.blueArmy.addSoldier(_horseman8);
            }

            for (var _i25 = 0; _i25 < 15; _i25++) {
                var _horseman9 = new Horseman(900 + Math.random() * 2, _i25 * 30 + 200);
                _horseman9.facing = {
                    x: -1,
                    y: 0
                };
                state.blueArmy.addSoldier(_horseman9);
            }
        }

        function loadPreset5() {
            state.redArmy.clear();
            state.blueArmy.clear();

            state.obstacles = [];

            for (var i = 0; i < 20; i++) {
                state.obstacles.push(new Obstacle(1000 * Math.random(), 800 * Math.random(), 100));
            }

            return;

            for (var _i26 = 0; _i26 < 100; _i26++) {
                var x = Math.random() * 100 + 50;
                var y = Math.random() * 500 + 100;

                state.redArmy.addSoldier(new Soldier(x, y, 'sword'));
            }

            var swordsman = new Soldier(250, 300, 'sword');

            swordsman.hp = 5000;
            swordsman.isGeneral = true;
            state.redArmy.addSoldier(swordsman);

            for (var _i27 = 0; _i27 < 100; _i27++) {
                var _x5 = Math.random() * 10 + 6000;
                var _y5 = _i27 * 30 + 150;

                var horseman = new Horseman(_x5, _y5);
                horseman.hp = 10;

                state.redArmy.addSoldier(horseman);
            }

            for (var _i28 = 0; _i28 < 5; _i28++) {
                var _x6 = Math.random() * 5 + 1000;
                var _y6 = _i28 * 30 + 250;

                var _horseman10 = new Horseman(_x6, _y6);
                _horseman10.hp = 10;

                state.blueArmy.addSoldier(_horseman10);
            }

            for (var _i29 = 0; _i29 < 50; _i29++) {
                var _x7 = Math.random() * 1 + 1100;
                var _y7 = _i29 * 12 + 50;

                state.blueArmy.addSoldier(new Soldier(_x7, _y7, 'shield'));
            }

            for (var _i30 = 0; _i30 < 50; _i30++) {
                var _x8 = Math.random() * 1 + 1120;
                var _y8 = _i30 * 12 + 45;

                state.blueArmy.addSoldier(new Soldier(_x8, _y8, 'shield'));
            }

            for (var _i31 = 0; _i31 < 50; _i31++) {
                var _x9 = Math.random() * 1 + 1150;
                var _y9 = _i31 * 12 + 50;

                state.blueArmy.addSoldier(new Soldier(_x9, _y9, 'spear'));
            }

            for (var _i32 = 0; _i32 < 50; _i32++) {
                var _x10 = Math.random() * 1 + 1170;
                var _y10 = _i32 * 12 + 45;

                state.blueArmy.addSoldier(new Soldier(_x10, _y10, 'spear'));
            }
        }

        function simulate() {
            if (state.simulating) {
                state.redArmy.simulate(frame, state);
                state.blueArmy.simulate(frame, state);
            }

            context.clearRect(0, 0, 1440, 1000);

            state.obstacles.forEach(function (o) {
                o.render(context);
            });

            state.redArmy.render(context);
            state.blueArmy.render(context);

            requestAnimationFrame(simulate);

            frame++;
        }

        simulate();

        var startButton = document.getElementById('start-btn');
        startButton.onclick = function () {
            state.simulating = true;
        };

        var pauseButton = document.getElementById('pause-btn');
        pauseButton.onclick = function () {
            state.simulating = false;
        };

        var clearButton = document.getElementById('clear-btn');
        clearButton.onclick = function () {
            state.simulating = false;
            state.redArmy.clear();
            state.blueArmy.clear();

            state.obstacles = [];
        };

        var soldierSelect = document.getElementById('soldier-select');
        soldierSelect.onchange = function (evt) {
            if (soldierSelect.value === 'swordsman') {
                currSoliderType = 'sword';
            } else if (soldierSelect.value === 'shieldman') {
                currSoliderType = 'shield';
            } else if (soldierSelect.value === 'archer') {
                currSoliderType = 'bow';
            } else if (soldierSelect.value === 'spearman') {
                currSoliderType = 'spear';
            } else if (soldierSelect.value === 'horseman') {
                currSoliderType = 'horseman';
            }
        };

        document.getElementById('preset-btn-1').onclick = function () {
            loadPreset1();
        };

        document.getElementById('preset-btn-2').onclick = function () {
            loadPreset2();
        };

        document.getElementById('preset-btn-3').onclick = function () {
            loadPreset3();
        };

        document.getElementById('preset-btn-4').onclick = function () {
            loadPreset4();
        };

        document.getElementById('preset-btn-5').onclick = function () {
            loadPreset5();
        };

        canvas.onmouseup = function (evt) {
            evt.preventDefault();

            var selectedArmy = void 0;

            if (evt.button == 2) {
                selectedArmy = state.redArmy;
            } else {
                selectedArmy = state.blueArmy;
            }

            if (currSoliderType === 'horseman') {
                selectedArmy.addSoldier(new Horseman(evt.offsetX, evt.offsetY));
            } else {
                selectedArmy.addSoldier(new Soldier(evt.offsetX, evt.offsetY, currSoliderType));
            }
        };

        var keySoliderMapping = {
            1: 'swordsman',
            2: 'spearman',
            3: 'shieldman',
            4: 'horseman'
        };

        window.onkeydown = function (evt) {
            var soliderType = keySoliderMapping[evt.key];

            if (soliderType !== undefined) {
                soldierSelect.value = soliderType;
                soldierSelect.onchange();
            }
        };
    }, { "./Army": 1, "./Horseman": 4, "./Obstacle": 5, "./Soldier": 7 }] }, {}, [12]);
