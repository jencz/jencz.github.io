import GameEntity from "./GameEntity.js";
import Sprite from "../../lib/Sprite.js"
import { CANVAS_HEIGHT, CANVAS_WIDTH, context, DEBUG, images } from "../globals.js";
import ImageName from "../enums/ImageName.js";
import StateMachine from "../../lib/StateMachine.js";
import PlayerStateName from "../enums/PlayerStateName.js";
import PlayerWalkingState from "../states/entity/player/PlayerWalkingState.js";
import PlayerIdleState from "../states/entity/player/PlayerIdleState.js";
import Animation from "../../lib/Animation.js";
import Direction from "../enums/Direction.js";
import Peashooter from "../objects/Peashooters/Peashooter.js";

export default class Player extends GameEntity {
    static PLAYER_WIDTH = 30
    static PLAYER_HEIGHT = 35
	constructor(level, username) {
        super()

        this.username = username

        this.level = level;

        this.hitboxOffsets.set(8, 30, -15, -30)

        this.sprites = Sprite.generateSpritesFromSpriteSheet(
            images.get(ImageName.PlayerWalking),
            Player.PLAYER_WIDTH,
            Player.PLAYER_HEIGHT
        )

        this.idleSprite = this.sprites[0]
        this.idleSpriteLeft = this.sprites[5]

        this.spriteIndexs = {
            idle_right: [0],
            idle_left: [5],
            walking_right: [0,1,2,3,4],
            walking_left: [5,6,7,8,9]
        }

        this.idleAnimation = new Animation([0], 1, 1)

        this.currentAnimation = this.idleAnimation

        this.position.x = CANVAS_WIDTH / 2;
		this.position.y = CANVAS_HEIGHT / 2;
		this.dimensions.x = Player.PLAYER_WIDTH;
		this.dimensions.y = Player.PLAYER_HEIGHT;
        this.speed = 150;
        this.speedV = 125;

        // Player left or right
        this.facing = Direction.Right

        this.accountBalance = 0;

        this.weapon = new Peashooter(this)

        this.stateMachine = this.initializeStateMachine()
    }

    initializeStateMachine() {
		const stateMachine = new StateMachine();

        stateMachine.add(PlayerStateName.Idle, new PlayerIdleState(this))
		stateMachine.add(PlayerStateName.Walking, new PlayerWalkingState(this));
        

        stateMachine.change(PlayerStateName.Idle)
        return stateMachine
    }

    update(dt) {
        super.update(dt)
        this.weapon.update(dt)
    }

    render(offset = { x: 0, y: 0 }) {
        this.stateMachine.render()

        const x = this.position.x + offset.x;
		const y = this.position.y + offset.y;

        context.save()
		if (this.facing === Direction.Right) {
            this.sprites[this.currentAnimation.getCurrentFrame()].render(Math.floor(x), Math.floor(y));
        } 
        else {
		    this.sprites[this.currentAnimation.getCurrentFrame()].render(Math.floor(x), Math.floor(y));
        }
        context.restore()

        this.weapon.render()

        if (DEBUG) {
			this.hitbox.render(context)
		}
	}
}