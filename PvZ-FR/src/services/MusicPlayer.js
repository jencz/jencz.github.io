import { getRandomPositiveInteger, pickRandomElement } from "../../lib/Random.js";
import SoundName from "../enums/SoundName.js";
import { MusicName } from "../enums/SoundName.js";

/**
 * Keeps track of which song is playing and can switch it to another. Also plays sounds.
 */
export default class MusicPlayer {
    /**
     * Creates a new MusicPlayer
     * @param {Sounds} sounds - Access to the game sounds.
     */
    constructor(sounds) {
        this.sounds = sounds;
        this.currentName = null;
    }

    /**
     * Switches from the current song to another.
     * @param {string} name Name of song to switch to.
     */
    SwitchSong(name) {
        if (this.currentName)
            this.sounds.stop(this.currentName)

        this.sounds.play(name)
        this.currentName = name
    }

    SwitchSongTween(name, time) {
        if (this.currentName)
            this.sounds.stop(this.currentName)
    
            this.sounds.play(name)
            this.currentName = name
    }

    /**
     * Switches from the current song to a random terraria song.
     */
    SwitchSongDay() {
        let names = [MusicName.Day1,MusicName.Day2,MusicName.Day3,MusicName.Day1,MusicName.Day2,MusicName.Day3,MusicName.Night1,MusicName.Night2]

        let songName = pickRandomElement(names)

        if (this.currentName)
            this.sounds.stop(this.currentName)

        this.sounds.play(songName)
        this.currentName = songName
    }

    pause() {
        this.sounds.pause(this.currentName)
    }

    unpause() {
        this.sounds.play(this.currentName)
    }

    playRandomCoin() {
        let names = [SoundName.Coin1, SoundName.Coin2, SoundName.Coin3]

        this.sounds.play(pickRandomElement(names))
    }
}