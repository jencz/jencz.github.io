import GameEntity from "../../GameEntity.js"
import Sprite from "../../../../lib/Sprite.js"
import { images, context } from "../../../globals.js"
import ImageName from "../../../enums/ImageName.js"
import Explosion from "../../Explosion.js"
import Animation from "../../../../lib/Animation.js"
import Vector from "../../../../lib/Vector.js"
import EnemyStateName from "../../../enums/EnemyStateName.js"
import { DEBUG } from "../../../globals.js"



export default class PlantExplosion extends GameEntity {

	constructor(level, cherry, range) {
        super()
        this.level = level
        this.cherry = cherry
        this.range = range

        this.position.x = (this.cherry.hitbox.position.x + (this.cherry.hitbox.dimensions.x / 2))
        this.position.y = (this.cherry.hitbox.position.y + (this.cherry.hitbox.dimensions.y / 2))
        this.dimensions.x = this.cherry.hitbox.dimensions.x
        this.dimensions.y = this.cherry.hitbox.dimensions.y

        this.renderPosition = new Vector(this.position.x - (75 / 2), this.position.y - (75 / 2))
		
		this.sprites = Sprite.generateSpritesFromSpriteSheet(
            images.get(ImageName.Explosion),
            Explosion.EXPLOSION_WIDTH,
            Explosion.EXPLOSION_HEIGHT
        );
        
        this.currentAnimation = new Animation([0, 1, 2, 3, 4, 5, 6], 0.05, 1);

        this.cleanUp = false;

        this.exploded = false;
	}

	update(dt) {
		this.currentAnimation.update(dt);

        if (this.currentAnimation.isHalfwayDone() && !this.exploded) {
            this.exploded = true;
            let zombies = this.level.getZombiesInRadius(
                this.position, 
                this.range
            );
            zombies.forEach(zombie => {
                zombie.changeState(EnemyStateName.Dying)
            });

            this.remove();
        }
	}

	render(offset = { x: 0, y: 0 }) {
		const x = this.renderPosition.x
		const y = this.renderPosition.y

		this.sprites[this.currentAnimation.getCurrentFrame()].render(Math.floor(x), Math.floor(y), {x: 1, y: 1});

        if (DEBUG)
        {
             this.hitbox.render(context);
        }
	}

    remove() {
		let index = this.level.cherryExplosions.indexOf(this)
		if (index > -1) {
			this.level.cherryExplosions.splice(index, 1)
		}
	}
}