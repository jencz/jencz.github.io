import Peashooter from "./Peashooter.js";
import Animation from "../../../lib/Animation.js";
import WeaponStateName from "../../enums/WeaponStateName.js";
import StateMachine from "../../../lib/StateMachine.js";
import WeaponIdleState from "../../states/object/weapon/WeaponIdleState.js";
import WeaponShootingState from "../../states/object/weapon/WeaponShootingState.js";
import Bullet from "../Bullet.js";
import WeaponType from "../../enums/WeaponType.js";

export default class GoldPeashooter extends Peashooter {
    constructor(player) {
        super(player)

        this.type = WeaponType.GoldPeashooter
    }

    initializeStateMachine() {
		const stateMachine = new StateMachine();

        stateMachine.add(WeaponStateName.Idle, new WeaponIdleState(this, [3]))
		stateMachine.add(WeaponStateName.Shooting, new WeaponShootingState(this, [4, 5 , 5]));
        

        stateMachine.change(WeaponStateName.Idle)
        return stateMachine
    }
}