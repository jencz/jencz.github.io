import State from "../../../../lib/State.js";
import Animation from "../../../../lib/Animation.js";
import { input } from "../../../globals.js";
import Input from "../../../../lib/Input.js";
import WeaponStateName from "../../../enums/WeaponStateName.js";

export default class WeaponIdleState extends State {
    constructor(weapon, frames) {
        super()

        this.frames = frames

        this.weapon = weapon
    }

    enter() {
        this.weapon.currentAnimation = new Animation(this.frames)
    }

    update() {
        this.checkKeyPressed()
    }

    checkKeyPressed() {
        if (input.isKeyHeld(Input.KEYS.SPACE) && !this.weapon.isShooting) {
            this.weapon.changeState(WeaponStateName.Shooting)
        }
    }
}