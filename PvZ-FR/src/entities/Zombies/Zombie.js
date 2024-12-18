import GameEntity from "../GameEntity.js";
import Sprite from "../../../lib/Sprite.js"
import { CANVAS_HEIGHT, CANVAS_WIDTH, debug, DEBUG, images, sounds } from "../../globals.js";
import ImageName from "../../enums/ImageName.js";
import StateMachine from "../../../lib/StateMachine.js";
import EnemyStateName from "../../enums/EnemyStateName.js";
import EnemyIdleState from "../../states/entity/enemy/EnemyEatingState.js";
import EnemyWalkingState from "../../states/entity/enemy/EnemyWalkingState.js";
import EnemyEatingState from "../../states/entity/enemy/EnemyEatingState.js";
import { context } from "../../globals.js";
import Direction from "../../enums/Direction.js";
import EnemyDyingState from "../../states/entity/enemy/EnemyDyingState.js";
import Coin from "../../objects/Currency/Currency.js";
import Vector from "../../../lib/Vector.js";
import Currency from "../../objects/Currency/Currency.js";
import CurrencyType from "../../enums/CurrencyType.js";
import { getRandomPositiveInteger, pickRandomElement } from "../../../lib/Random.js";
import Level from "../../objects/Level.js";
import Hitbox from "../../../lib/Hitbox.js";
import CurrencyFactory from "../../services/CurrencyFactory.js";
import SoundName from "../../enums/SoundName.js";
import HealthBar from "../../user-interface/HealthBar.js";
import { roundedRectangle } from "../../../lib/Drawing.js";
import Color from "../../enums/Color.js";
import { timer } from "../../globals.js";
import Easing from "../../../lib/Easing.js";

export default class Zombie extends GameEntity {
    static ZOMBIE_WIDTH = 50
    static ZOMBIE_HEIGHT = 53
    static ZOMBIE_DYING_WIDTH = 52
    static ZOMBIE_DYING_HEIGHT = 33

    constructor(level, direction) {
        super()

        this.level = level
        this.spawnDirection = direction
        this.health = 80
        this.isEating = false
        this.isDead = false
        this.dimensions.x = Zombie.ZOMBIE_WIDTH;
        this.dimensions.y = Zombie.ZOMBIE_HEIGHT;
        this.changedToHitSprites = false
        this.baseSpeed = 10
        this.isEatingVan = false
        this.lastDamageTime = 0
        this.healthBarWidth = 20

        this.damageHitbox = new Hitbox(this.position.x, this.position.y, 10, 10, 'blue')

        this.idleSprites = Sprite.generateSpritesFromSpriteSheet(
            images.get(ImageName.ZombieIdle),
            Zombie.ZOMBIE_WIDTH,
            Zombie.ZOMBIE_HEIGHT
        )

        this.walkingSprites = Sprite.generateSpritesFromSpriteSheet(
            images.get(ImageName.ZombieWalking),
            Zombie.ZOMBIE_WIDTH,
            Zombie.ZOMBIE_HEIGHT
        )

        this.hitWalkingSprites = Sprite.generateSpritesFromSpriteSheet(
            images.get(ImageName.ZombieHitWalking),
            Zombie.ZOMBIE_WIDTH,
            Zombie.ZOMBIE_HEIGHT
        )

        this.eatingSprites = Sprite.generateSpritesFromSpriteSheet(
            images.get(ImageName.ZombieEating),
            Zombie.ZOMBIE_WIDTH - 5,
            Zombie.ZOMBIE_HEIGHT
        )

        this.hitEatingSprites = Sprite.generateSpritesFromSpriteSheet(
            images.get(ImageName.ZombieHitEating),
            Zombie.ZOMBIE_WIDTH - 5,
            Zombie.ZOMBIE_HEIGHT
        )

        this.dyingSprites = Sprite.generateSpritesFromSpriteSheet(
            images.get(ImageName.ZombieDying),
            Zombie.ZOMBIE_WIDTH,
            Zombie.ZOMBIE_HEIGHT
        )

        this.healthBarSprites = Sprite.generateSpritesFromSpriteSheet(
            images.get(ImageName.HealthBar),
            HealthBar.HEALTH_BAR_WIDTH,
            HealthBar.HEALTH_BAR_HEIGHT
        )

        this.animationFrames = {
            idle: [0],
            walk: [0, 1, 2, 3, 4, 5, 6],
            eat: [0, 1, 2, 3, 4, 5, 6],
            die: [0, 1, 2, 3, 4, 5, 6, 7, 8, 8, 8]
        }

        this.sprites = this.walkingSprites

        this.stateMachine = this.initializeStateMachine()
        this.setHitboxes()
    }

    render(offset = { x: 0, y: 0 }) {
        const x = this.position.x + offset.x;
        const y = this.position.y + offset.y;

        context.save()
        if (this.spawnDirection === Direction.Left) {

            context.translate(this.position.x + this.dimensions.x, this.position.y)
            context.scale(-1, 1)
            this.sprites[this.currentAnimation.getCurrentFrame()].render(0, 0);
        } else {
            this.sprites[this.currentAnimation.getCurrentFrame()].render(Math.floor(x), Math.floor(y));
        }
        context.restore()

        this.stateMachine.render();

        if (DEBUG) {
            this.damageHitbox.render(context)
            this.hitbox.render(context)
        }

        if (!this.isDying) {
            context.save()
            this.renderHealthBarBackground()
            this.renderHealthBarForeground()
            context.restore()
        }

    }

    initializeStateMachine() {
        const stateMachine = new StateMachine();

        stateMachine.add(EnemyStateName.Idle, new EnemyWalkingState(this, this.animationFrames.idle));
        stateMachine.add(EnemyStateName.Walking, new EnemyWalkingState(this, this.animationFrames.walk));
        stateMachine.add(EnemyStateName.Eating, new EnemyEatingState(this, this.animationFrames.eat))
        stateMachine.add(EnemyStateName.Dying, new EnemyDyingState(this, this.animationFrames.die))

        stateMachine.change(EnemyStateName.Walking)
        return stateMachine
    }

    takeDamage(damage) {
        if (this.health <= 0) {
            this.stateMachine.change(EnemyStateName.Dying)
        }
        this.health -= damage
        this.diminishHealthBarAnimation(damage)
    }

    setHitboxes() {
        if (this.spawnDirection === Direction.Right) {
            this.position.x = CANVAS_WIDTH;
            this.position.y = getRandomPositiveInteger(
                0,
                CANVAS_HEIGHT - (Level.BOTTOM_BAR_HEIGHT + Zombie.ZOMBIE_HEIGHT)
            );

            let hitboxOffsetX = 15
            let hitboxOffsetY = 40
            let hitboxOffsetWidth = -35
            let hitboxOffsetHeight = -42

            this.hitboxOffsets.set(hitboxOffsetX, hitboxOffsetY, hitboxOffsetWidth, hitboxOffsetHeight)

            let damageHitboxOffsetX = 15
            let damageHitboxOffsetY = 8
            let damageHitboxOffsetWidth = -35
            let damageHitboxOffsetHeight = -10

            this.damageHitboxOffsets.set(damageHitboxOffsetX, damageHitboxOffsetY, damageHitboxOffsetWidth, damageHitboxOffsetHeight)
        }
        else {
            this.position.x = -40;
            this.position.y = getRandomPositiveInteger(
                0,
                CANVAS_HEIGHT - (Level.BOTTOM_BAR_HEIGHT + Zombie.ZOMBIE_HEIGHT)
            );

            let hitboxOffsetX = 20
            let hitboxOffsetY = 40
            let hitboxOffsetWidth = -35
            let hitboxOffsetHeight = -42

            this.hitboxOffsets.set(hitboxOffsetX, hitboxOffsetY, hitboxOffsetWidth, hitboxOffsetHeight)

            let damageHitboxOffsetX = 20
            let damageHitboxOffsetY = 8
            let damageHitboxOffsetWidth = -35
            let damageHitboxOffsetHeight = -10

            this.damageHitboxOffsets.set(damageHitboxOffsetX, damageHitboxOffsetY, damageHitboxOffsetWidth, damageHitboxOffsetHeight)
        }
    }

    dropCurrency() {
        sounds.play(SoundName.CoinDrop)
        let currencyType = CurrencyType[pickRandomElement(Object.keys(CurrencyType))]

        let currency = CurrencyFactory.createInstance(
            currencyType,
            new Vector(Currency.WIDTH, Currency.HEIGHT),
            new Vector(this.position.x + (this.dimensions.x / 2), this.position.y + (this.dimensions.y / 2)),
            this.level
        )

        this.level.currency.push(currency)
    }

    renderHealthBarBackground() {
        if (this.spawnDirection === Direction.Left) {
            context.fillStyle = Color.Black
            roundedRectangle(
                context,
                this.position.x + (this.dimensions.x / 2 - 5),
                this.position.y,
                20,
                5,
                2,
                true,
                false
            )
        }
        else {
            context.fillStyle = Color.Black
            roundedRectangle(
                context,
                this.position.x + 10,
                this.position.y,
                20,
                5,
                2,
                true,
                false
            )
        }
    }

    renderHealthBarForeground() {
        if (this.spawnDirection === Direction.Left) {
            context.fillStyle = Color.Crimson
            roundedRectangle(
                context,
                this.position.x + (this.dimensions.x / 2 - 5),
                this.position.y + 1,
                this.healthBarWidth,
                3,
                2,
                true,
                false
            )
        }
        else {
            context.fillStyle = Color.Crimson
            roundedRectangle(
                context,
                this.position.x + 10,
                this.position.y + 1,
                Math.max(0, this.healthBarWidth),
                3,
                2,
                true,
                false
            )
        }
    }

    diminishHealthBarAnimation(damage) {
        this.healthBarWidth = this.healthBarWidth - damage * (this.healthBarWidth / (this.health + 40))
    }
}