import Vector from "../../lib/Vector.js"
import Hitbox from "../../lib/Hitbox.js"
import Direction from "../enums/Direction.js";
import Debug from "../../lib/Debug.js";
import { debug, context, images, DEBUG, stateStack, timer, musicPlayer, sounds } from "../globals.js";
import Sprite from "../../lib/Sprite.js";
import ImageName from "../enums/ImageName.js";
import Animation from "../../lib/Animation.js";
import EnemyStateName from "../enums/EnemyStateName.js";
import GameOverState from "../states/GameOverState.js";
import SoundName from "../enums/SoundName.js";

export default class Explosion {
    static EXPLOSION_WIDTH = 199.5;
    static EXPLOSION_HEIGHT = 67;
    static GAME_OVER_DELAY = 3; 

    constructor(position, level) {
        this.level = level;
        this.position = position;

        this.sprites = Sprite.generateSpritesFromSpriteSheet(
            images.get(ImageName.Explosion),
            Explosion.EXPLOSION_WIDTH,
            Explosion.EXPLOSION_HEIGHT
        );

        this.currentAnimation = new Animation([0, 1, 2, 3, 4, 5, 6], 0.2, 1);
        this.gameOverTimer = null; 
        this.hasExploded = false

        musicPlayer.pause()
        sounds.play(SoundName.GameOver)
    }

    update(dt) {
        this.currentAnimation.update(dt);

        if (this.currentAnimation.isHalfwayDone()) {
            this.level.enemies.forEach(enemy => {
                if (enemy.state !== EnemyStateName.Dying) {
                    enemy.healthBarWidth = 0;
                    enemy.changeState(EnemyStateName.Dying, false);
                    this.level.van.sprites = this.level.van.craterSprite;
                }
            });
        }

        if (this.currentAnimation.isDone() && this.gameOverTimer === null) {
            this.hasExploded = true
            this.gameOverTimer = Explosion.GAME_OVER_DELAY;
        }

        if (this.gameOverTimer !== null) {
            this.gameOverTimer -= dt;

            if (this.gameOverTimer <= 0) {
                stateStack.push(new GameOverState(this.level.player.username, this.level.wave));
            }
        }
    }

    render(offset = { x: 0, y: 0 }) {
        const x = this.position.x + offset.x;
        const y = this.position.y + offset.y;

        if (!this.hasExploded) {
            this.sprites[this.currentAnimation.getCurrentFrame()].render(Math.floor(x), Math.floor(y), { x: 1.5, y: 1.5 });
        }
        
    }
}
