import GameEntity from "../GameEntity.js";
import Sprite from "../../../lib/Sprite.js"
import { CANVAS_HEIGHT, CANVAS_WIDTH, DEBUG, images, input } from "../../globals.js";
import ImageName from "../../enums/ImageName.js";
import StateMachine from "../../../lib/StateMachine.js";
import EnemyStateName from "../../enums/EnemyStateName.js";
import EnemyIdleState from "../../states/entity/enemy/EnemyEatingState.js";
import EnemyWalkingState from "../../states/entity/enemy/EnemyWalkingState.js";
import EnemyEatingState from "../../states/entity/enemy/EnemyEatingState.js";
import Direction from "../../enums/Direction.js";
import EnemyDyingState from "../../states/entity/enemy/EnemyDyingState.js";
import Coin from "../../objects/Currency/Currency.js";
import Vector from "../../../lib/Vector.js";
import Currency from "../../objects/Currency/Currency.js";
import CurrencyType from "../../enums/CurrencyType.js";
import PlantingState from "../../states/entity/plant/PlantingState.js";
import PlantedState from "../../states/entity/plant/PlantedState.js";
import PlantStateName from "../../enums/PlantStateName.js";
import { context } from "../../globals.js";
import PlantDyingState from "../../states/entity/plant/PlantDyingState.js";
import Animation from "../../../lib/Animation.js";

export default class Plant extends GameEntity {

    constructor(level, width, height) {
        super()

        this.level = level

        this.health = 50

        let mousePos = input.getMousePosition();

        this.facing = Direction.Right;

        this.position.x = mousePos.x
        this.position.y = mousePos.y
        this.dimensions.x = width
        this.dimensions.y = height

        this.isDead = false

        this.cleanUp = false;
        this.isPlanted = false
        this.lastDamageTime = 0
    }

    update(dt) {
        //super.update(dt)
        this.stateMachine.update(dt)
    }

    updateAnimation(dt) {
        if (this.isDirectional) {
            if (this.facing === Direction.Right && this.animation != this.rightAnimation) {
                this.animation = this.rightAnimation
            }
            else if (this.facing === Direction.Left && this.animation != this.leftAnimation) {
                this.animation = this.leftAnimation
            }
        }
        this.animation.update(dt);
    }

    render() {
        //super.render()
        this.stateMachine.render()

        if (DEBUG) {
            this.hitbox.render(context)
        }
        else {
            if (!this.isPlanted) {
                this.hitbox.render(context)
            }
        }
    }

    initializeStateMachine() {
        const stateMachine = new StateMachine();

        stateMachine.add(PlantStateName.Planting, new PlantingState(this));
        stateMachine.add(PlantStateName.Planted, new PlantedState(this))
        stateMachine.add(PlantStateName.Dying, new PlantDyingState(this))

        stateMachine.change(PlantStateName.Planting)
        return stateMachine
    }

    takeDamage(damage) {
        if (this.health <= 1) {
            this.stateMachine.change(PlantStateName.Dying)

        }
        this.health -= damage
    }

    remove() {
        let index = this.level.plants.indexOf(this)
        if (index > -1) {
            this.level.plants.splice(index, 1)
        }
    }

    plant() {
        this.level.plant(this)
        this.stateMachine.change(PlantStateName.Planted)
        this.isPlanted = true;
    }

    setAnimations(sprites, animationSpeed, isDirectional, animationFrames, leftAnimationFrames = null, leftFrameIndex = null) {
        this.sprites = sprites;
        this.sprite = sprites[0];
        this.isDirectional = isDirectional;

        if (isDirectional) {
            this.rightSprite = this.sprites[0]
            this.leftSprite = this.sprites[leftFrameIndex]

            this.rightAnimation = new Animation(animationFrames, animationSpeed);
            this.leftAnimation = new Animation(leftAnimationFrames, animationSpeed);

            if (this.facing === Direction.Right) {
                this.animation = this.rightAnimation
            }
            else if (this.facing === Direction.Left) {
                this.animation = this.leftAnimation
            }
        }
        else if (!isDirectional) {
            this.animation = new Animation(animationFrames, animationSpeed);
        }
    }
}