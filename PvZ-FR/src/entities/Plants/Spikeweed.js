import Plant from "./Plant.js"
import Sprite from "../../../lib/Sprite.js"
import StateMachine from "../../../lib/StateMachine.js"
import { images, context, CANVAS_WIDTH, CANVAS_HEIGHT } from "../../globals.js"
import ImageName from "../../enums/ImageName.js"
import Direction from "../../enums/Direction.js"
import { input } from "../../globals.js"


export default class Spikeweed extends Plant {
    static WIDTH = 36;
    static HEIGHT = 18;
    static IS_DIRECTIONAL = false;
    static ANIMATION_FRAMES = [0, 1, 2, 3, 4, 5, 6];
    static ANIMATION_SPEED = 0.25;
    static DAMAGE = 15;

    constructor(level) {
        super(level, Spikeweed.WIDTH, Spikeweed.HEIGHT)

        this.setAnimations(
            Sprite.generateSpritesFromSpriteSheet(images.get(ImageName.Spikeweed), this.dimensions.x, this.dimensions.y),
            Spikeweed.ANIMATION_SPEED,
            Spikeweed.IS_DIRECTIONAL,
            Spikeweed.ANIMATION_FRAMES
        )

        this.damage = Spikeweed.DAMAGE

        this.stateMachine = this.initializeStateMachine()
    }

    update(dt) {
        //super.update(dt)
        this.stateMachine.update(dt)

        this.hitbox.set(this.position.x + (this.dimensions.x / 6.5), this.position.y + (this.dimensions.y / 3), 20, 10)
    }
}