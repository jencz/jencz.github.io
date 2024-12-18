import EnemyType from "../enums/EnemyType.js"
import Zombie from "../entities/Zombies/Zombie.js"
import DancingZombie from "../entities/Zombies/DancingZombie.js";
import Yeti from "../entities/Zombies/Yeti.js";

/**
 * Encapsulates all definitions for instantiating new enemies.
 */
export default class EnemyFactory {
	/**
	 * @param {string} type A string using the EnemyType enum.
	 * @param {array} sprites The sprites to be used for the enemy.
	 * @returns An instance of an enemy specified by EnemyType.
	 */
	static createInstance(type, level, direction) {
		switch (type) {
			case EnemyType.Zombie:
				return new Zombie(level, direction);
			case EnemyType.DancingZombie:
				return new DancingZombie(level, direction)
			case EnemyType.Yeti:
				return new Yeti(level, direction)
		}
	}
}