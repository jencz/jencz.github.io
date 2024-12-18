import Plant from "./Plant.js"
import Sprite from "../../../lib/Sprite.js"
import StateMachine from "../../../lib/StateMachine.js"
import { images, context, CANVAS_WIDTH, CANVAS_HEIGHT } from "../../globals.js"
import ImageName from "../../enums/ImageName.js"
import Direction from "../../enums/Direction.js"
import { input } from "../../globals.js"
import Animation from "../../../lib/Animation.js"


export default class Walnut extends Plant {
    static WIDTH = 30;
    static HEIGHT = 35;
    static IS_DIRECTIONAL = true; // If true, you need left and right animation frames.
    static ANIMATION_FRAMES = [0,1,2,3,4];
    static ANIMATION_FRAMES_LEFT = [5,6,7,8,9];
    static ANIMATION_SPEED = 0.25;
    static LEFT_FRAME = 5
    static HEALTH = 10
    
    constructor(level) {
        super(level, Walnut.WIDTH, Walnut.HEIGHT)

        this.health = Walnut.HEALTH

        this.setAnimations(
            Sprite.generateSpritesFromSpriteSheet(images.get(ImageName.Walnut), this.dimensions.x, this.dimensions.y),
            Walnut.ANIMATION_SPEED,
            Walnut.IS_DIRECTIONAL, 
            Walnut.ANIMATION_FRAMES,
            Walnut.ANIMATION_FRAMES_LEFT,
            Walnut.LEFT_FRAME          
        )

        this.stateMachine = this.initializeStateMachine()

        if (this.isPlanted) {
            this.hitbox.set(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, 10, 10) 
        }      
    }
}