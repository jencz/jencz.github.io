import WeaponType from "../enums/WeaponType.js"
import Peashooter from "../objects/Peashooters/Peashooter.js"

/**
 * Encapsulates all definitions for instantiating new enemies.
 */
export default class WeaponFactory {
	/**
	 * @param {string} type A string using the EnemyType enum.
	 * @param {array} sprites The sprites to be used for the enemy.
	 * @returns An instance of an enemy specified by EnemyType.
	 */
	static createInstance(type, level) {
		switch (type) {
			case WeaponType.RegPeashooter:
				return new Peashooter(level);
		}
	}
}