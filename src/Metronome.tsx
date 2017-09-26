import * as React from 'react';
import './Metronome.css';

const click1 = require('./resources/click1.wav');
const click2 = require('./resources/click2.wav');

class Metronome extends React.Component<MetronomeProps, MetronomeState> {

    constructor(props: MetronomeProps) {
        super(props);

        this.state = {
            playing: false,
            count: 0,
            bpm: 100,
            beatsPerMeasure: 4,
            sounds: new Sounds(click1, click2)
        };
    }

    handleBpmChange(event: React.ChangeEvent<HTMLInputElement>) {

        const bpm = event.target.value;

        if(this.state.playing) {
            // Stop the old timer and start a new one
            global.clearInterval(this.state.timer!);

            const ms: number = (60 / +bpm) * 1000;

            // Set the new BPM, and reset the beat counter
            this.setState({
                timer: global.setInterval(() => this.playClick(), ms),
                count: 0,
                bpm: +bpm
            });
        } else {
            // Otherwise just update the BPM
            this.setState({ bpm: +bpm });
        }
    }

    startStop(_ = '') {
        this.state.sounds.click1.play();

        if (this.state.playing) {
            // Stop the timer
            global.clearInterval(this.state.timer!);
            this.setState({
                playing: false
            });
        } else {
            // Start a timer with the current BPM
            const ms: number = (60 / this.state.bpm) * 1000;

            this.setState({
                timer: global.setInterval(() => this.playClick(), ms),
                count: 0,
                playing: true
                // Play a click "immediately" (after setState finishes)
            },            this.playClick);
        }
    }

    playClick() {
        const { count, beatsPerMeasure } = this.state;

        // The first beat will have a different sound than the others
        if (count % beatsPerMeasure === 0) {
            this.state.sounds.click2.play();
            console.log("Tick!");
        } else {
            this.state.sounds.click1.play();
            console.log("Tock!");
        }

        // Keep track of which beat we're on
        this.setState(state => ({
            count: (state.count + 1) % state.beatsPerMeasure
        }));
    }

    render() {
        const {playing, bpm} = this.state;

        return (
            <div className="metronome">
                <div className="bpm-slider">
                    <div>{bpm} BPM</div>
                    <input
                        type="range"
                        min="60"
                        max="240"
                        value={bpm}
                        onChange={e => this.handleBpmChange(e)}
                    />
                </div>
                <button onClick={e => this.startStop()}>
                    {playing ? 'Stop' : 'Start'}
                </button>
            </div>
        );
    }
}

class Sounds {
    click1: HTMLAudioElement;
    click2: HTMLAudioElement;

    constructor(click1Resource: string, click2Resource: string) {
        this.click1 = new Audio(click1Resource);
        this.click2 = new Audio(click2Resource);
    }
}

interface MetronomeState {
    playing: boolean;
    count: number;
    bpm: number;
    beatsPerMeasure: number;
    sounds: Sounds;
    timer?: NodeJS.Timer;
}

interface MetronomeProps {

}

export default Metronome;
