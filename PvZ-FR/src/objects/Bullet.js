import Sprite from "../../lib/Sprite.js"
import Vector from "../../lib/Vector.js"
import { CANVAS_WIDTH, DEBUG, images } from "../globals.js"
import ImageName from "../enums/ImageName.js"
import Direction from "../enums/Direction.js"
import { context } from "../globals.js"
import Hitbox from "../../lib/Hitbox.js"
import Animation from "../../lib/Animation.js"
import WeaponType from "../enums/WeaponType.js"
import { getRandomPositiveNumber } from "../../lib/Random.js"
import EnemyStateName from "../enums/EnemyStateName.js"

export default class Bullet {
    static BULLET_WIDTH = 14
    static BULLET_HEIGHT = 34
    constructor(weapon, direction) {
        this.weapon = weapon

        this.direction = direction

        this.position = this.determinePosition()

        this.hitboxOffsets = new Hitbox();
        this.hitboxOffsets.set(2.5, 12.5, -5, -25)
        this.hitbox = new Hitbox(
            this.position.x + this.hitboxOffsets.position.x,
            this.position.y + this.hitboxOffsets.position.y,
            Bullet.BULLET_WIDTH + this.hitboxOffsets.dimensions.x,
            Bullet.BULLET_HEIGHT + this.hitboxOffsets.dimensions.y,
        );

        this.sprites = this.determineSprites()

        this.explode = false
        this.collided = false
        this.hasExploded = false
        this.bulletDirection = direction
        this.die = false

        this.currentAnimation = new Animation([0])

        this.isMoving = false

        this.speed = 250
    }

    update(dt) {
        if (!this.collided) {
            if (this.bulletDirection === Direction.Left) {

                if (this.position.x > CANVAS_WIDTH || this.position.x < 0) {
                    this.die = true
                }
                this.position.x -= this.speed * dt
            }
            else {
                if (this.position.x > CANVAS_WIDTH || this.position.x < 0) {
                    this.die = true
                }
                this.position.x += this.speed * dt
            }


            this.hitbox.set(
                this.position.x + this.hitboxOffsets.position.x,
                this.position.y + this.hitboxOffsets.position.y,
                Bullet.BULLET_WIDTH + this.hitboxOffsets.dimensions.x,
                Bullet.BULLET_HEIGHT + this.hitboxOffsets.dimensions.y,
            );
        }

        if (this.explode) {
            this.currentAnimation.update(dt)
        }

        if (this.explode && this.currentAnimation.isDone()) {
            this.hasExploded = true
        }
    }

    render() {
        context.save()
        if (!this.hasExploded && !this.die) {
            if (this.weapon.player.facing === Direction.Left) {
                this.sprites[this.currentAnimation.getCurrentFrame()].render(-this.position.x, this.position.y)
            }
            this.sprites[this.currentAnimation.getCurrentFrame()].render(this.position.x, this.position.y)

            if (DEBUG) {
                this.hitbox.render(context)
            }
        }
        context.restore()
    }

    didCollideWithEntity(hitbox) {
        return this.hitbox.didCollide(hitbox);
    }

    explodeAnimation() {
        this.explode = true
        this.currentAnimation = new Animation([1, 2, 2], 0.05, 1)
    }

    stopAtCollision(position) {
        this.collided = true
        this.position = position
    }

    powerUp(enemy) {
        if (this.weapon.type === WeaponType.SnowPeashooter) {
            let rdm = Math.floor(getRandomPositiveNumber(0, 2))

            if (rdm === 1) {
                enemy.speed = 0
                enemy.isFrozen = true
                enemy.changeState(EnemyStateName.Idle)
            }
        }
        else if (this.weapon.type === WeaponType.GoldPeashooter) {
            let rdm = Math.floor(getRandomPositiveNumber(0, 10))

            if (rdm === 1) {
                enemy.dropCurrency()
            }
        }
    }

    determinePosition() {
        if (this.weapon.type === WeaponType.GatlingPeashooter && this.direction === Direction.Left) {
            return new Vector((this.weapon.position.x - this.weapon.measurements.x - 12), this.weapon.position.y - this.weapon.measurements.y + 8)
        }
        else if (this.weapon.type === WeaponType.GatlingPeashooter && this.direction === Direction.Right) {
            return new Vector((this.weapon.position.x + this.weapon.measurements.x - 4), this.weapon.position.y - this.weapon.measurements.y + 10)
        }
        else if (this.weapon.type === WeaponType.SplitPeashooter && this.direction === Direction.Left) {
            return new Vector((this.weapon.position.x - this.weapon.measurements.x), this.weapon.position.y - this.weapon.measurements.y + 7)
        }
        else if (this.weapon.type === WeaponType.SplitPeashooter && this.direction === Direction.Right) {
            return new Vector((this.weapon.position.x + this.weapon.measurements.x - 25), this.weapon.position.y - this.weapon.measurements.y + 7)
        }
        else if (this.weapon.type !== WeaponType.GatlingPeashooter && this.direction === Direction.Left) {
            return new Vector((this.weapon.position.x - this.weapon.measurements.x), this.weapon.position.y - this.weapon.measurements.y + 5)
        }
        else {
            return new Vector((this.weapon.position.x + this.weapon.measurements.x - 10), this.weapon.position.y - this.weapon.measurements.y + 5)
        }
    }

    determineSprites() {
        if (this.weapon.type === WeaponType.GoldPeashooter) {
            return Sprite.generateSpritesFromSpriteSheet(
                images.get(ImageName.GoldBullet),
                Bullet.BULLET_WIDTH,
                Bullet.BULLET_HEIGHT
            )
        }
        else if (this.weapon.type === WeaponType.SnowPeashooter) {
            return Sprite.generateSpritesFromSpriteSheet(
                images.get(ImageName.SnowBullet),
                Bullet.BULLET_WIDTH,
                Bullet.BULLET_HEIGHT
            )
        }
        else {
            return Sprite.generateSpritesFromSpriteSheet(
                images.get(ImageName.RegBullet),
                Bullet.BULLET_WIDTH,
                Bullet.BULLET_HEIGHT
            )
        }
    }
}