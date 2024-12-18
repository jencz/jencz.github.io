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
import { context } from "../../globals.js";
import Direction from "../../enums/Direction.js";

export default class SplitPeashooter extends Peashooter {
    static WIDTH = 38
    static HEIGHT = 18
    constructor(player) {
        super(player)

        this.damage = 20

        this.sprites = Sprite.generateSpritesFromSpriteSheet(
            images.get(ImageName.SplitPeashooter),
            SplitPeashooter.WIDTH,
            SplitPeashooter.HEIGHT
        )

        this.type = WeaponType.SplitPeashooter
    }

    initializeStateMachine() {
		const stateMachine = new StateMachine();

        stateMachine.add(WeaponStateName.Idle, new WeaponIdleState(this, [0]))
		stateMachine.add(WeaponStateName.Shooting, new WeaponShootingState(this, [1, 2 , 2]));
        

        stateMachine.change(WeaponStateName.Idle)
        return stateMachine
    }

    render(offset = { x: 0, y: 0 }) {
        context.save()
        this.stateMachine.render()

        const x = this.position.x  - 24
		const y = this.position.y + 2;

        
		if (this.player.facing === Direction.Left) {
            
            context.translate(this.position.x + this.dimensions.x + 24, this.position.y + 2)
            context.scale(-1, 1)
		    this.sprites[this.currentAnimation.getCurrentFrame()].render(0, 0);
            
        } 
        else {
            this.sprites[this.currentAnimation.getCurrentFrame()].render(Math.floor(x), Math.floor(y));
        }

        context.restore()
        
        if (this.bulletSpawned) {
            this.bullets.forEach(bullet => {
                bullet.render()
            })
        } 
	}
}