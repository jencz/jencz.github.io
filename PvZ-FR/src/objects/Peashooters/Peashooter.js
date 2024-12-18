import Weapon from "../Weapon.js";
import Animation from "../../../lib/Animation.js";
import Sprite from "../../../lib/Sprite.js";
import ImageName from "../../enums/ImageName.js";
import { images } from "../../globals.js";
import StateMachine from "../../../lib/StateMachine.js";
import { context } from "../../globals.js";
import Direction from "../../enums/Direction.js";
import WeaponStateName from "../../enums/WeaponStateName.js"
import WeaponShootingState from "../../states/object/weapon/WeaponShootingState.js";
import WeaponIdleState from "../../states/object/weapon/WeaponIdleState.js";
import Bullet from "../Bullet.js";
import Vector from "../../../lib/Vector.js";
import WeaponType from "../../enums/WeaponType.js";

export default class Peashooter extends Weapon{
    static PEASHOOTER_WIDTH = 32;
    static PEASHOOTER_HEIGHT = 16;
    constructor(player) {
        super(player)

        this.sprites = Sprite.generateSpritesFromSpriteSheet(
            images.get(ImageName.Peashooters),
            Peashooter.PEASHOOTER_WIDTH,
            Peashooter.PEASHOOTER_HEIGHT
        )

        this.type = WeaponType.RegPeashooter

        this.measurements = new Vector(Peashooter.PEASHOOTER_WIDTH, Peashooter.PEASHOOTER_HEIGHT)

        this.stateMachine = this.initializeStateMachine()
    }

    render(offset = { x: 0, y: 0 }) {
        context.save()
        this.stateMachine.render()

        const x = this.position.x + offset.x;
		const y = this.position.y + offset.y;

        
		if (this.player.facing === Direction.Left) {
            
            context.translate(this.position.x + this.dimensions.x, this.position.y )
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

    initializeStateMachine() {
		const stateMachine = new StateMachine();

        stateMachine.add(WeaponStateName.Idle, new WeaponIdleState(this, [0]))
		stateMachine.add(WeaponStateName.Shooting, new WeaponShootingState(this, [1, 2 , 2]));
        

        stateMachine.change(WeaponStateName.Idle)
        return stateMachine
    }
}