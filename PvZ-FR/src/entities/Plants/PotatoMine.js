import Plant from "./Plant.js"
import Sprite from "../../../lib/Sprite.js"
import StateMachine from "../../../lib/StateMachine.js"
import { images, context, CANVAS_WIDTH, CANVAS_HEIGHT } from "../../globals.js"
import ImageName from "../../enums/ImageName.js"
import Direction from "../../enums/Direction.js"
import { input } from "../../globals.js"
import Animation from "../../../lib/Animation.js"
import EnemyStateName from "../../enums/EnemyStateName.js"

export default class PotatoMine extends Plant {
    static WIDTH = 30;
    static HEIGHT = 25;
    static IS_DIRECTIONAL = true; // If true, you need left and right animation frames.
    static ANIMATION_FRAMES = [0, 1, 3, 4, 3, 2];
    static ANIMATION_FRAMES_LEFT = [8, 9, 11, 12, 11, 10];
    static ANIMATION_SPEED = 0.1;
    static LEFT_FRAME = 8

    static RANGE = 20;

    constructor(level) {
        super(level, PotatoMine.WIDTH, PotatoMine.HEIGHT)

        this.setAnimations(
            Sprite.generateSpritesFromSpriteSheet(images.get(ImageName.PotatoMine), this.dimensions.x, this.dimensions.y),
            PotatoMine.ANIMATION_SPEED,
            PotatoMine.IS_DIRECTIONAL,
            PotatoMine.ANIMATION_FRAMES,
            PotatoMine.ANIMATION_FRAMES_LEFT,
            PotatoMine.LEFT_FRAME
        )

        this.stateMachine = this.initializeStateMachine()

        if (this.isPlanted) {
            this.hitbox.set(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, 10, 10)
        }

        this.hasExploded = false;
    }

    update(dt) {
        super.update(dt)

        if (this.isPlanted) {
            // Check for zombie collosion.
            let zombies = this.level.checkZombiesCollision(this)
            if (zombies.length !== 0)
            {
                zombies.forEach(zombie => {
                    zombie.changeState(EnemyStateName.Dying)
                })
                this.explode()
            }

            
        }
    }

    explode() {
        this.hasExploded = true;

        this.level.spawnPlantExplosion(this, PotatoMine.RANGE)

        this.remove()
    }
}