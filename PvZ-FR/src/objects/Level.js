import { images, input, musicPlayer, sounds, timer } from "../globals.js"
import ImageName from "../enums/ImageName.js"
import { CANVAS_WIDTH, CANVAS_HEIGHT, stateStack } from "../globals.js"
import EnemyType from "../enums/EnemyType.js"
import EnemyFactory from "../services/EnemyFactory.js"
import HealthBar from "../user-interface/HealthBar.js"
import EnemyStateName from "../enums/EnemyStateName.js"
import Vector from "../../lib/Vector.js"
import BottomBarMenu from "../user-interface/BottomBarMenu.js"
import Direction from "../enums/Direction.js"
import ImageButton from "../user-interface/elements/ImageButton.js"
import { getRandomPositiveNumber, pickRandomElement } from "../../lib/Random.js"
import WeaponType from "../enums/WeaponType.js"
import ButtonType from "../enums/ButtonType.js"
import { context } from "../globals.js"
import EnemyEatingState from "../states/entity/enemy/EnemyEatingState.js"
import CloseButton from "../user-interface/elements/CloseButton.js"
import Explosion from "../entities/Explosion.js"
import Times from "../enums/Times.js"
import Easing from "../../lib/Easing.js"
import Player from "../entities/Player.js"
import Van from "./Van.js"
import Walnut from "../entities/Plants/Walnut.js"
import Spikeweed from "../entities/Plants/Spikeweed.js"
import Cherrybomb from "../entities/Plants/Cherrybomb.js"
import PlantExplosion from "../entities/Plants/SubPlantEntities/PlantExplosion.js"
import SoundName from "../enums/SoundName.js"
import Input from "../../lib/Input.js"
import PauseState from "../states/PauseState.js"

export default class Level {
    static LEFT_EDGE = 20
    static TOP_EDGE = 40
    static BOTTOM_EDGE = CANVAS_HEIGHT - 55
    static RIGHT_EDGE = CANVAS_WIDTH - 20

    static BOTTOM_BAR_HEIGHT = 48
    static BOTTOM_BAR_START_HEIGHT = CANVAS_HEIGHT - Level.BOTTOM_BAR_HEIGHT

    constructor(username) {
        this.player = new Player(this, username);
        this.van = new Van(new Vector(Van.VAN_WIDTH, Van.VAN_HEIGHT), new Vector(CANVAS_WIDTH / 2 - (Van.VAN_WIDTH / 2), CANVAS_HEIGHT / 2 - Van.VAN_HEIGHT))

        // entities
        this.enemies = this.generateEnemies()
        this.currency = []
        this.bullets = []
        this.plants = [];
        this.explosions = []
        this.cherryExplosions = []

        this.wave = 0
        this.waveAmount = 3
        this.waveInProgress = true
        this.explosionPushed = false

        this.gracePeriodTimer = 10
        this.dayNightTransitionTriggered = false;
        this.transitionComplete = true;
        this.timeTransitionAlphaObject = { alpha: 1 };
        this.renderQueue = this.buildRenderQueue();
        this.currentTime = Times.Day // Times.Night
        this.timer = 0
        this.winSoundPlayed = false
        this.waveStatus = 'WAVE IN PROGRESS'

        // user interface
        this.vanHealthBar = new HealthBar(this.van)
        this.exitButton = new CloseButton(CANVAS_WIDTH - 27, 3, ButtonType.Pause ,this)
        this.bottomBarMenu = new BottomBarMenu(0, Level.BOTTOM_BAR_START_HEIGHT, CANVAS_WIDTH, Level.BOTTOM_BAR_HEIGHT, this); 
    }

    update(dt) {

        if (input.isKeyPressed(Input.KEYS.ESCAPE))
        {
            stateStack.push(new PauseState()); 
            musicPlayer.pause();
        }

        this.checkNewWave(dt)

        this.renderQueue = this.buildRenderQueue()

        if (this.van.hasDied && !this.explosionPushed) {
            sounds.play(SoundName.Explosion)
            this.explosions.push(new Explosion(new Vector(this.van.position.x - 20, this.van.position.y - 20), this))
            this.explosionPushed = true
        }

        this.cherryExplosions = this.cherryExplosions.filter(explosion => !explosion.currentAnimation.isDone())
        this.cherryExplosions.forEach(explosion => explosion.update(dt))

        this.explosions.forEach(explosion => explosion.update(dt))
        this.player.update(dt)
        this.bullets.forEach(bullet => bullet.update(dt))
        this.van.update(dt)

        this.plants.forEach(plant => {
            plant.update(dt)
        })

        this.enemies.forEach(enemy => {
            enemy.update(dt)

            this.checkPlantAndEnemyCollision()

            this.checkEnemyAndVanCollision(enemy)
        })

        if (this.van.didCollideWithEntity(this.player.hitbox)) {
            this.van.onCollision(this.player)
        }

        this.bullets.forEach(bullet => {
            this.checkBulletAndEnemyCollision(bullet)
        })

        this.currency.forEach(currency => {
            if (currency.didCollideWithEntity(this.player.hitbox)) {
                currency.onConsume(this.player)
            }
        })

        this.bottomBarMenu.update(dt);
        this.exitButton.update(dt)
        this.currency.forEach(currency => currency.update(dt))
    }

    render() {
        this.renderBackground()

        this.renderQueue.forEach((elementToRender) => {
            elementToRender.render(this.adjacentOffset);
        });

        this.bullets.forEach(bullet => bullet.render())

        this.cherryExplosions.forEach(explosion => explosion.render())


        this.explosions.forEach(explosion => explosion.render())
        this.vanHealthBar.render()

        if (this.van.health > 0) {
            this.renderWaveStatus()
        }


        this.exitButton.render()
        this.bottomBarMenu.render()
    }

    renderBackground() {
        const day = ImageName.DayMap
        const night = ImageName.NightMap

        let number = null
        if (!this.transitionComplete) {
            if (this.currentTime === Times.Day) {
                // From day to night
                images.render(day, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT - 48)
                context.save()
                context.globalAlpha = this.timeTransitionAlphaObject.alpha
                images.render(night, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT - 48)
                context.restore()
                number = 1
            }
            else if (this.currentTime === Times.Night) {
                // From night to day
                images.render(night, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT - 48)
                context.save()
                context.globalAlpha = this.timeTransitionAlphaObject.alpha
                images.render(day, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT - 48)
                context.restore()
                number = 2
            }
        }
        else {
            if (this.currentTime === Times.Day) {
                images.render(day, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT - 48)
                number = 3
            }
            else if (this.currentTime === Times.Night) {
                images.render(night, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT - 48)
                number = 4
            }
        }
    }

    generateEnemies() {
        let enemies = new Array()

        for (let i = 0; i < this.waveAmount; i++) {
            let enemyType = EnemyType[pickRandomElement(Object.keys(EnemyType))]
            let direction = Direction[pickRandomElement(Object.keys({ Left: 2, Right: 3 }))]

            enemies.push(EnemyFactory.createInstance(enemyType, this, direction))
        }

        return enemies
    }

    checkNewWave(dt) {
        if (this.enemies.length === 0) {
            if (!this.winSoundPlayed) {
                sounds.play(SoundName.Siren)
                this.winSoundPlayed = true
            }
            if (!this.dayNightTransitionTriggered && this.wave % 5 === 0) {
                this.triggerDayNightSwitch()
            }

            this.waveInProgress = false
            this.gracePeriodTimer -= dt
            if (this.gracePeriodTimer <= 0) {
                this.wave++
                if (this.wave % 3 === 0) {
                    this.waveAmount += 2
                }
                this.dayNightTransitionTriggered = false;
                this.enemies = this.generateEnemies()
                this.gracePeriodTimer = 10
                this.waveInProgress = true
                this.winSoundPlayed = false
                sounds.play(SoundName.WaveStart)
            }
        }
    }

    getZombiesRemaining() {
        return this.enemies.filter((enemy) => !enemy.isDying).length
    }

    plant(plant) {
        this.plants.push(plant)
    }

    triggerDayNightSwitch() {
        this.transitionComplete = false;
        this.dayNightTransitionTriggered = true;
        this.timeTransitionAlphaObject.alpha = 0;
        timer.tween(
            this.timeTransitionAlphaObject,
            { alpha: 1 },
            5,
            Easing.linear,
            () => {
                this.timeTransitionAlphaObject.alpha = 1;
                this.transitionComplete = true;

                if (this.currentTime === Times.Day) {
                    this.currentTime = Times.Night
                }
                else if (this.currentTime === Times.Night) {
                    this.currentTime = Times.Day
                }
            }
        )
    }

    renderWaveStatus() {
        context.save();
        context.font = `12px SamDanEvil`;
        context.fillStyle = 'black';
        context.textBaseline = 'middle';
        context.textAlign = 'center';

        if (this.waveInProgress) {
            this.waveStatus = 'WAVE IN PROGRESS'
            context.font = `12px SamDanEvil`;
            context.fillText(this.waveStatus, CANVAS_WIDTH / 2 - 1, CANVAS_HEIGHT / 10 - 1)
            context.fillText(this.waveStatus, CANVAS_WIDTH / 2 - 1, CANVAS_HEIGHT / 10 + 1)
            context.fillText(this.waveStatus, CANVAS_WIDTH / 2 + 1, CANVAS_HEIGHT / 10 - 1)
            context.fillText(this.waveStatus, CANVAS_WIDTH / 2 + 1, CANVAS_HEIGHT / 10 + 1)
            context.fillStyle = 'white';
            context.fillText(this.waveStatus, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 10)
        }
        else {
            this.waveStatus = 'TIME UNTIL NEXT WAVE: '
            context.font = `12px SamDanEvil`;
            context.fillText(this.waveStatus + Math.floor(this.gracePeriodTimer), CANVAS_WIDTH / 2 - 1, CANVAS_HEIGHT / 10 - 1)
            context.fillText(this.waveStatus + Math.floor(this.gracePeriodTimer), CANVAS_WIDTH / 2 - 1, CANVAS_HEIGHT / 10 + 1)
            context.fillText(this.waveStatus + Math.floor(this.gracePeriodTimer), CANVAS_WIDTH / 2 + 1, CANVAS_HEIGHT / 10 - 1)
            context.fillText(this.waveStatus + Math.floor(this.gracePeriodTimer), CANVAS_WIDTH / 2 + 1, CANVAS_HEIGHT / 10 + 1)
            context.fillStyle = 'white';
            context.fillText(this.waveStatus + Math.floor(this.gracePeriodTimer), CANVAS_WIDTH / 2, CANVAS_HEIGHT / 10)
        }

        context.restore()
    }

    /**
     * Order the entities by their renderPriority fields. If the renderPriority
     * is the same, then sort the entities by their bottom positions. This will
     * put them in an order such that entities higher on the screen will appear
     * behind entities that are lower down.
     *
     * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
     *
     * The spread operator (...) returns all the elements of an array separately
     * so that you can pass them into functions or create new arrays. What we're
     * doing below is combining both the entities and objects arrays into one.
     *
     * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax
     */
    buildRenderQueue() {

        //this.van.render()
        //this.currency.forEach(currency => currency.render())
        //this.plants.forEach(plant => plant.render())
        //this.enemies.forEach(enemy => enemy.render())
        //this.player.render()

        return [this.player, this.van, ...this.plants, ...this.enemies, ...this.currency].sort((a, b) => {
            let order = 0;
            const bottomA = a.hitbox.position.y + a.hitbox.dimensions.y;
            const bottomB = b.hitbox.position.y + b.hitbox.dimensions.y;

            if (a.renderPriority < b.renderPriority) {
                order = -1;
            } else if (a.renderPriority > b.renderPriority) {
                order = 1;
            } else if (bottomA < bottomB) {
                order = -1;
            } else {
                order = 1;
            }

            return order;
        });
    }

    pushBullet(bullet) {
        this.bullets.push(bullet);
        sounds.play(SoundName.Shoot)
    }

    spawnPlantExplosion(plant, range) {
        this.cherryExplosions.push(new PlantExplosion(this, plant, range))
        sounds.play(SoundName.Explosion)
    }

    getZombiesInRadius(position, radius) {
        let enemiesInRange = this.enemies.filter(zombie => {
            let x = Math.floor(zombie.hitbox.position.x - (zombie.hitbox.dimensions.x / 2))
            let y = Math.floor(zombie.hitbox.position.y - (zombie.hitbox.dimensions.y / 2))
            let zombiePosition = new Vector(x, y)

            let xDiff = zombiePosition.x - position.x
            let yDiff = zombiePosition.y - position.y

            let distance = Math.ceil(Math.sqrt(xDiff * xDiff + yDiff * yDiff))

            if (distance <= radius) {
                return true;
            }
            else {
                return false;
            }
        })

        return enemiesInRange
    }

    getDistanceBetweenTwoPoints(one, two) {
        return Math.ceil(Math.sqrt((two.x - one.x) ** 2) + ((two.y - one.y) ** 2))
    }

    checkZombiesCollision(plant) {
        return this.enemies.filter(zombie => {
            if (zombie.didCollideWithEntity(plant.hitbox)) {
                return true;
            }
            return false;
        })
    }

    checkForValidPlacement(hitbox) {
        let valid = true;
        if (this.plants.forEach(plant => {
            if (plant.didCollideWithEntity(hitbox)) {
                valid = false;
            }
        }))

        if (this.van.didCollideWithEntity(hitbox)) {
            valid = false;
        }

        if (this.player.didCollideWithEntity(hitbox)) {
            valid = false;
        }

        return valid;
    }

    checkPlantAndEnemyCollision() {
        this.plants.forEach(plant => {
            this.enemies.forEach(eatingEnemy => {
                if (eatingEnemy.didCollideWithEntity(plant.hitbox)) {
                    if (plant instanceof Walnut) {
                        eatingEnemy.changeState(EnemyStateName.Eating);

                        const DAMAGE_INTERVAL = 1000

                        if (Date.now() - plant.lastDamageTime >= DAMAGE_INTERVAL) {
                            if (!plant.isDead) {
                                plant.takeDamage(eatingEnemy.damage);
                                plant.lastDamageTime = Date.now()
                                sounds.play(SoundName.ZombieEating)
                            }
                        }

                        if (plant.health <= 0) {
                            plant.isDead = true
                            eatingEnemy.changeState(EnemyStateName.Walking);
                            eatingEnemy.speed = eatingEnemy.baseSpeed;
                        }
                    }

                    else if (plant instanceof (Spikeweed)) {
                        const DAMAGE_INTERVAL = 1000

                        if (Date.now() - eatingEnemy.lastDamageTime >= DAMAGE_INTERVAL) {
                            if (!plant.isDead) {
                                eatingEnemy.takeDamage(plant.damage);
                                eatingEnemy.lastDamageTime = Date.now()
                            }
                        }

                        if (eatingEnemy.health <= 0) {
                            eatingEnemy.isDead = true
                            eatingEnemy.changeState(EnemyStateName.Dying);
                        }
                    }
                }
            })
        })
    }

    checkEnemyAndVanCollision(enemy) {
        if (this.van.didCollideWithEntity(enemy.hitbox)) {
            this.van.onCollision(enemy)
            if (!enemy.isEating) {
                enemy.speed = 0
                enemy.isEating = true
                enemy.changeState(EnemyStateName.Eating)
                enemy.isEatingVan = true
            }
        }
    }

    checkBulletAndEnemyCollision(bullet) {
        this.enemies.forEach(enemy => {
            if (bullet.didCollideWithEntity(enemy.damageHitbox) && !bullet.collided) {
                bullet.stopAtCollision(new Vector(bullet.position.x, bullet.position.y))
                bullet.explodeAnimation()
                bullet.powerUp(enemy)

                if (!enemy.isInvincible) {
                    sounds.play(SoundName.Splat);
                    enemy.takeDamage(this.player.weapon.damage)
                }
            }
        })
    }
}