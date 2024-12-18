import Input from "../../../../lib/Input.js";
import State from "../../../../lib/State.js";
import Zombie from "../../../entities/Zombies/Zombie.js"
import Direction from "../../../enums/Direction.js";
import PlayerStateName from "../../../enums/PlayerStateName.js";
import { input, stateStack, timer } from "../../../globals.js";
import Level from "../../../objects/Level.js";
import Animation from "../../../../lib/Animation.js"

export default class PlantedState extends State {
    constructor(plant) {
        super();

        this.plant = plant;
        this.level = this.plant.level;

        this.sprites = this.plant.sprites;
    }

    enter() {
    }

    update(dt) {
        this.plant.updateAnimation(dt)
    }

    render() {
        this.sprites[this.plant.animation.getCurrentFrame()].render(this.plant.position.x, this.plant.position.y)
    }
}
