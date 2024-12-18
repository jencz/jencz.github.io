import Sprite from "../../../lib/Sprite.js";
import ImageName from "../../enums/ImageName.js";
import { DEBUG, images } from "../../globals.js";
import Zombie from "./Zombie.js";
import StateMachine from "../../../lib/StateMachine.js";
import EnemyStateName from "../../enums/EnemyStateName.js";
import EnemyDyingState from "../../states/entity/enemy/EnemyDyingState.js";
import EnemyWalkingState from "../../states/entity/enemy/EnemyWalkingState.js";
import EnemyEatingState from "../../states/entity/enemy/EnemyEatingState.js";
import Direction from "../../enums/Direction.js";
import { context } from "../../globals.js";
import { CANVAS_WIDTH, CANVAS_HEIGHT } from "../../globals.js";
import { getRandomPositiveInteger } from "../../../lib/Random.js";
import Level from "../../objects/Level.js";
import Hitbox from "../../../lib/Hitbox.js";
import EnemyIdleState from "../../states/entity/enemy/EnemyIdleState.js";
import Color from "../../enums/Color.js";
import { roundedRectangle } from "../../../lib/Drawing.js";

export default class Yeti extends Zombie {
    static YETI_WIDTH = 59
    static YETI_HEIGHT = 80
    static YETI_IDLE_WIDTH = 52
    static YETI_EATING_WIDTH = 55
    static YETI_DYING_WIDTH = 100
    
    constructor(level, direction) {
        super(level, direction)  
           
        this.health = 140
        this.damage = 3
        this.damageHitbox = new Hitbox(this.position.x, this.position.y, 10, 10, 'blue')
        this.baseSpeed = 8
        this.speed = this.baseSpeed

        this.idleSprites = Sprite.generateSpritesFromSpriteSheet(
            images.get(ImageName.YetiIdle),
            Yeti.YETI_IDLE_WIDTH,
            Yeti.YETI_HEIGHT
        )

        this.walkingSprites = Sprite.generateSpritesFromSpriteSheet(
            images.get(ImageName.Yeti),
            Yeti.YETI_WIDTH,
            Yeti.YETI_HEIGHT
        )

        this.hitWalkingSprites = Sprite.generateSpritesFromSpriteSheet(
            images.get(ImageName.YetiHitWalking),
            Yeti.YETI_WIDTH,
            Yeti.YETI_HEIGHT
        )

        this.eatingSprites = Sprite.generateSpritesFromSpriteSheet(
            images.get(ImageName.YetiEating),
            Yeti.YETI_EATING_WIDTH,
            Yeti.YETI_HEIGHT
        )

        this.hitEatingSprites = Sprite.generateSpritesFromSpriteSheet(
            images.get(ImageName.YetiHitEating),
            Yeti.YETI_EATING_WIDTH,
            Yeti.YETI_HEIGHT
        )

        this.dyingSprites = Sprite.generateSpritesFromSpriteSheet(
            images.get(ImageName.YetiDying),
            Yeti.YETI_DYING_WIDTH,
            Yeti.YETI_HEIGHT
        )

        this.sprites = this.walkingSprites

        this.setHitboxes()

        this.initializeStateMachine()
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

        stateMachine.add(EnemyStateName.Idle, new EnemyIdleState(this, [0]))
        stateMachine.add(EnemyStateName.Walking, new EnemyWalkingState(this, [0, 1, 2, 3, 4, 5]));
        stateMachine.add(EnemyStateName.Eating, new EnemyEatingState(this, [0, 1, 2, 3]))
        stateMachine.add(EnemyStateName.Dying, new EnemyDyingState(this, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]))

        stateMachine.change(EnemyStateName.Walking)
        return stateMachine
    }

    setHitboxes() {
        if (this.spawnDirection === Direction.Right) {
            this.position.x = CANVAS_WIDTH;
            this.position.y = getRandomPositiveInteger(
                0,
                CANVAS_HEIGHT - (Level.BOTTOM_BAR_HEIGHT + Zombie.ZOMBIE_HEIGHT)
            );

            let hitboxOffsetX = 16
            let hitboxOffsetY = 65
            let hitboxOffsetWidth = -25
            let hitboxOffsetHeight = -42

            this.hitboxOffsets.set(hitboxOffsetX, hitboxOffsetY, hitboxOffsetWidth, hitboxOffsetHeight)

            let damageHitboxOffsetX = 16
            let damageHitboxOffsetY = 20
            let damageHitboxOffsetWidth = -25
            let damageHitboxOffsetHeight = 4

            this.damageHitboxOffsets.set(damageHitboxOffsetX, damageHitboxOffsetY, damageHitboxOffsetWidth, damageHitboxOffsetHeight)
        }
        else {       
            this.position.x = -40;
            this.position.y = getRandomPositiveInteger(
                0,
                CANVAS_HEIGHT - (Level.BOTTOM_BAR_HEIGHT + Zombie.ZOMBIE_HEIGHT)
            );

            let hitboxOffsetX = 8
            let hitboxOffsetY = 65
            let hitboxOffsetWidth = -25
            let hitboxOffsetHeight = -42

            this.hitboxOffsets.set(hitboxOffsetX, hitboxOffsetY, hitboxOffsetWidth, hitboxOffsetHeight)

            let damageHitboxOffsetX = 8
            let damageHitboxOffsetY = 20
            let damageHitboxOffsetWidth = -25
            let damageHitboxOffsetHeight = 4

            this.damageHitboxOffsets.set(damageHitboxOffsetX, damageHitboxOffsetY, damageHitboxOffsetWidth, damageHitboxOffsetHeight)
        }
    }

    renderHealthBarBackground() {
        if (this.spawnDirection === Direction.Left) {
            context.fillStyle = Color.Black
            roundedRectangle(
                context,
                this.position.x + 15,
                this.position.y + 5,
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
                this.position.x + 15,
                this.position.y + 5,
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
                this.position.x + 15,
                this.position.y + 6,
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
                this.position.x + 15,
                this.position.y + 6,
                this.healthBarWidth,
                3,
                2,
                true,
                false
            )
        }
    }
}