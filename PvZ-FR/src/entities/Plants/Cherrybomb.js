import Plant from "./Plant.js"
import Sprite from "../../../lib/Sprite.js"
import StateMachine from "../../../lib/StateMachine.js"
import { images, context, CANVAS_WIDTH, CANVAS_HEIGHT } from "../../globals.js"
import ImageName from "../../enums/ImageName.js"
import Direction from "../../enums/Direction.js"
import { input } from "../../globals.js"
import Animation from "../../../lib/Animation.js"


export default class Cherrybomb extends Plant {
    static WIDTH = 50;
    static HEIGHT = 38;
    static IS_DIRECTIONAL = false;
    static ANIMATION_FRAMES = [0, 1, 2, 5];
    static ANIMATION_SPEED = 0.1;

    static RANGE = 100;

    constructor(level) {
        super(level, Cherrybomb.WIDTH, Cherrybomb.HEIGHT)

        this.setAnimations()

        this.stateMachine = this.initializeStateMachine()

        if (this.isPlanted) {
            this.hitbox.set(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, 10, 10)
        }

        this.hasExploded = false;
    }

    update(dt)
    {
        super.update(dt)

        if (this.animation.isDone() && !this.hasExploded)
        {
            this.explode()
        }
    }

    setAnimations() {
        /*
        super.setAnimations(
            Sprite.generateSpritesFromSpriteSheet(images.get(ImageName.CherryBomb), this.dimensions.x, this.dimensions.y),
            Cherrybomb.ANIMATION_SPEED,
            Cherrybomb.IS_DIRECTIONAL,
            Cherrybomb.ANIMATION_FRAMES
        )
        */

        this.sprites = Sprite.generateSpritesFromSpriteSheet(images.get(ImageName.CherryBomb), this.dimensions.x, this.dimensions.y);
        this.sprite = this.sprites[0];

        this.animation = new Animation(Cherrybomb.ANIMATION_FRAMES, Cherrybomb.ANIMATION_SPEED, 1);
    }

    explode() {
        this.hasExploded = true;

        this.level.spawnPlantExplosion(this, Cherrybomb.RANGE)

        this.remove()
    }
}