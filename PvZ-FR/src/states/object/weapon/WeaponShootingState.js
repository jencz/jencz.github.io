import State from "../../../../lib/State.js";
import Animation from "../../../../lib/Animation.js";
import WeaponStateName from "../../../enums/WeaponStateName.js";
import Bullet from "../../../objects/Bullet.js"
import Hitbox from "../../../../lib/Hitbox.js";
import WeaponType from "../../../enums/WeaponType.js";
import { input } from "../../../globals.js";
import Input from "../../../../lib/Input.js";
import Direction from "../../../enums/Direction.js";

export default class WeaponShootingState extends State {
    constructor(weapon, frames) {
        super();

        this.weapon = weapon

        this.animation = new Animation(frames, 0.2, 1)

        this.shootTimer = 0
        this.fireRate = 0.1
    }

    enter() {
        if (this.weapon.type === WeaponType.SplitPeashooter) {
            this.shootBullet(Direction.Left)
            this.shootBullet(Direction.Right)
        }
        else {
           this.shootBullet(); 
        }
        
        this.weapon.isShooting = true;
        this.animation.refresh();
        this.weapon.currentAnimation = this.animation;
    }

    update(dt) {
        if (this.weapon.type === WeaponType.GatlingPeashooter && input.isKeyHeld(Input.KEYS.SPACE)) {
            this.shootTimer += dt;

            if (this.shootTimer >= this.fireRate) {
                this.shootBullet();
                this.shootTimer = 0;
            }
        }
        else if (this.weapon.type === WeaponType.GatlingPeashooter && !input.isKeyHeld(Input.KEYS.SPACE)) {
            this.weapon.isShooting = false;
            this.weapon.changeState(WeaponStateName.Idle);
        }

        if (this.weapon.type !== WeaponType.GatlingPeashooter && this.weapon.currentAnimation.isDone()) {
            this.weapon.isShooting = false;
            this.weapon.changeState(WeaponStateName.Idle);
        }


    }

    shootBullet(direction = null) {
        if (direction === null) {
            this.weapon.level.pushBullet(new Bullet(this.weapon, this.weapon.player.facing, this.weapon.bulletSprites))
        }
        else {
            this.weapon.level.pushBullet(new Bullet(this.weapon, direction, this.weapon.bulletSprites))
        }
        
        this.weapon.bulletSpawned = true;
    }
}
