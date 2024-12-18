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

export default class GatlingPeashooter extends Peashooter {
    static WIDTH = 40
    static HEIGHT = 22
    constructor(player) {
        super(player)

        this.damage = 8

        this.sprites = Sprite.generateSpritesFromSpriteSheet(
            images.get(ImageName.GatlingPeashooter),
            GatlingPeashooter.WIDTH,
            GatlingPeashooter.HEIGHT
        )

        this.type = WeaponType.GatlingPeashooter
    }

    initializeStateMachine() {
		const stateMachine = new StateMachine();

        stateMachine.add(WeaponStateName.Idle, new WeaponIdleState(this, [0]))
		stateMachine.add(WeaponStateName.Shooting, new WeaponShootingState(this, [1, 2 , 2]));
        

        stateMachine.change(WeaponStateName.Idle)
        return stateMachine
    }
}