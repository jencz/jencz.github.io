import Peashooter from "./Peashooter.js";
import Animation from "../../../lib/Animation.js";
import WeaponStateName from "../../enums/WeaponStateName.js";
import StateMachine from "../../../lib/StateMachine.js";
import WeaponIdleState from "../../states/object/weapon/WeaponIdleState.js";
import WeaponShootingState from "../../states/object/weapon/WeaponShootingState.js";
import WeaponType from "../../enums/WeaponType.js";
import Bullet from "../Bullet.js";
import Sprite from "../../../lib/Sprite.js";
import { images } from "../../globals.js";
import ImageName from "../../enums/ImageName.js";

export default class SnowPeashooter extends Peashooter {
    static BULLET_WIDTH = 19
    static BULLET_HEIGHT = 32
    constructor(player) {
        super(player)

        this.type = WeaponType.SnowPeashooter
    }

    initializeStateMachine() {
		const stateMachine = new StateMachine();

        stateMachine.add(WeaponStateName.Idle, new WeaponIdleState(this, [6]))
		stateMachine.add(WeaponStateName.Shooting, new WeaponShootingState(this, [7, 8 , 8]));
        

        stateMachine.change(WeaponStateName.Idle)
        return stateMachine
    }
}