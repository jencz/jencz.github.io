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
import { getRandomPositiveInteger } from "../../../lib/Random.js";
import { CANVAS_HEIGHT, CANVAS_WIDTH } from "../../globals.js";
import Level from "../../objects/Level.js";
import Hitbox from "../../../lib/Hitbox.js";
import EnemyIdleState from "../../states/entity/enemy/EnemyIdleState.js";

export default class DancingZombie extends Zombie {
    static ZOMBIE_WIDTH = 55.6
    static ZOMBIE_HEIGHT = 80
    static ZOMBIE_IDLE_WIDTH = 51
    static ZOMBIE_EATING_WIDTH = 53.1
    static ZOMBIE_DYING_WIDTH = 77
    
    constructor(level, direction) {
        super(level, direction)

        this.damageHitbox = new Hitbox(this.position.x, this.position.y, 10, 10, 'blue')
        this.baseSpeed = 15
        this.speed = this.baseSpeed;

        this.idleSprites = Sprite.generateSpritesFromSpriteSheet(
            images.get(ImageName.DancingIdle),
            DancingZombie.ZOMBIE_IDLE_WIDTH,
            DancingZombie.ZOMBIE_HEIGHT
        )

        this.walkingSprites = Sprite.generateSpritesFromSpriteSheet(
            images.get(ImageName.DancingZombieWalking),
            DancingZombie.ZOMBIE_WIDTH,
            DancingZombie.ZOMBIE_HEIGHT
        )

        this.hitWalkingSprites = Sprite.generateSpritesFromSpriteSheet(
            images.get(ImageName.DancingZombieHitWalking),
            DancingZombie.ZOMBIE_WIDTH,
            DancingZombie.ZOMBIE_HEIGHT
        )

        this.eatingSprites = Sprite.generateSpritesFromSpriteSheet(
            images.get(ImageName.DancingZombieEating),
            DancingZombie.ZOMBIE_EATING_WIDTH,
            DancingZombie.ZOMBIE_HEIGHT
        )

        this.hitEatingSprites = Sprite.generateSpritesFromSpriteSheet(
            images.get(ImageName.DacingZombieHitEating),
            DancingZombie.ZOMBIE_EATING_WIDTH,
            DancingZombie.ZOMBIE_HEIGHT
        )

        this.dyingSprites = Sprite.generateSpritesFromSpriteSheet(
            images.get(ImageName.DancingZombieDying),
            DancingZombie.ZOMBIE_DYING_WIDTH,
            DancingZombie.ZOMBIE_HEIGHT
        )

        this.sprites = this.walkingSprites

        this.initializeStateMachine()
    }

    render(offset = { x: 0, y: 0 }) {
        const x = this.position.x + offset.x;
        const y = this.position.y + offset.y;

        context.save()
        if (this.spawnDirection === Direction.Left) {

            context.translate(this.position.x + this.dimensions.x, this.position.y)
            context.scale(-1, 1)
            this.sprites[this.currentAnimation.getCurrentFrame()].render(0, 0, { x: 0.7, y: 0.7 });
        } else {
            this.sprites[this.currentAnimation.getCurrentFrame()].render(Math.floor(x), Math.floor(y), { x: 0.7, y: 0.7 });
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
        stateMachine.add(EnemyStateName.Walking, new EnemyWalkingState(this, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]));
        stateMachine.add(EnemyStateName.Eating, new EnemyEatingState(this, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]))
        stateMachine.add(EnemyStateName.Dying, new EnemyDyingState(this, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ,11 ,12, 13]))

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

            let hitboxOffsetX = 15
            let hitboxOffsetY = 40
            let hitboxOffsetWidth = -35
            let hitboxOffsetHeight = -40

            this.hitboxOffsets.set(hitboxOffsetX, hitboxOffsetY, hitboxOffsetWidth, hitboxOffsetHeight)

            let damageHitboxOffsetX = 15
            let damageHitboxOffsetY = 8
            let damageHitboxOffsetWidth = -35
            let damageHitboxOffsetHeight = -8

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
            let hitboxOffsetHeight = -40

            this.hitboxOffsets.set(hitboxOffsetX, hitboxOffsetY, hitboxOffsetWidth, hitboxOffsetHeight)

            let damageHitboxOffsetX = 20
            let damageHitboxOffsetY = 8
            let damageHitboxOffsetWidth = -35
            let damageHitboxOffsetHeight = -8

            this.damageHitboxOffsets.set(damageHitboxOffsetX, damageHitboxOffsetY, damageHitboxOffsetWidth, damageHitboxOffsetHeight)
        }
    }
}