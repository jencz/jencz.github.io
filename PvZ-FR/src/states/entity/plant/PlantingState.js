import Input from "../../../../lib/Input.js";
import State from "../../../../lib/State.js";
import Zombie from "../../../entities/Zombies/Zombie.js"
import Direction from "../../../enums/Direction.js";
import PlayerStateName from "../../../enums/PlayerStateName.js";
import { context, input, sounds, stateStack, timer } from "../../../globals.js";
import Level from "../../../objects/Level.js";
import Animation from "../../../../lib/Animation.js"
import PlantStateName from "../../../enums/PlantStateName.js";
import SoundName from "../../../enums/SoundName.js";

export default class PlantingState extends State {
    constructor(plant) {
        super();

        this.plant = plant;
        this.level = this.plant.level;

        if (this.plant.isDirectional) {
            this.sprite = this.plant.rightSprite

            this.rightSprite = this.plant.rightSprite
            this.leftSprite = this.plant.leftSprite
        }
        else {
            this.sprite = this.plant.sprite
        }

        this.prevMousePos = input.getMousePosition();

        this.validPlacement = false;
    }

    enter() {

    }

    update(dt) {
        let mousePos = input.getMousePosition();

        this.plant.hitbox.set(this.plant.position.x + (this.plant.dimensions.x / 5), this.plant.position.y + (this.plant.dimensions.y / 1.5), 20, 10)

        if (this.prevMousePos !== mousePos) {
            this.plant.position.x = Math.floor(mousePos.x - (this.plant.dimensions.x / 2))
            this.plant.position.y = Math.floor(mousePos.y - (this.plant.dimensions.y / 2))

            if (this.plant.isDirectional) {

                if (mousePos.x > this.prevMousePos.x && this.plant.facing !== Direction.Right) {
                    this.sprite = this.rightSprite
                    this.plant.facing = Direction.Right
                }
                if (mousePos.x < this.prevMousePos.x && this.plant.facing !== Direction.Left) {
                    this.sprite = this.leftSprite
                    this.plant.facing = Direction.Left
                }
            }
        }

        this.validPlacement = this.level.checkForValidPlacement(this.plant.hitbox)

        if (this.validPlacement) {
            this.plant.hitbox.colour = 'blue'
        }
        else {
            this.plant.hitbox.colour = 'red'
        }

        if (input.isMouseButtonPressed(0)) {
            if (this.validPlacement) {
                sounds.play(SoundName.Planting)
                this.plantPlanty()
            }
        }

        this.prevMousePos = mousePos
    }

    render() {
        context.save()

        context.globalAlpha = 0.75
        this.sprite.render(this.plant.position.x, this.plant.position.y)

        context.restore()
    }

    plantPlanty() {
        this.plant.plant()

        // Get out of GamePlantingState and Back to PlayState
        stateStack.pop();
        stateStack.top().enter();
    }
}
