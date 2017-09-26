import * as React from 'react';
import './Metronome.css';

const click1 = require('./resources/click1.wav');
const click2 = require('./resources/click2.wav');

class Metronome extends React.Component<MetronomeProps, MetronomeState> {

    self: Metronome;

    constructor(props: MetronomeProps) {
        super(props);

        this.self = this;

        this.state = {
            playing: false,
            count: 0,
            bpm: 100,
            beatsPerMeasure: 4,
            sounds: new Sounds(click1, click2)
        };
    }

    handleBpmChange(event: React.ChangeEvent<HTMLInputElement>) {
        this.setState({
            bpm: +event.target.value
        });
    }

    startStop(_ = '') {
        this.state.sounds.click1.play();
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
}

interface MetronomeProps {

}

export default Metronome;
