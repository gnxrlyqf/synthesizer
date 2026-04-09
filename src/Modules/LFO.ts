import context from "../test";
import {Source} from "../Abstractions";

class Sync {
	division: 1 | 2 | 4 | 8 | 16 | 32;

	constructor(division: 1 | 2 | 4 | 8 | 16 | 32) {
		this.division = division;
	}

	getFrequency(): number {
		return ((context.tempo / 60) / this.division);
	}
}


class LFOscillator extends Source {
	signal: OscillatorNode;
	mode: Sync | null;

	constructor() {
		super();
		this.mode = new Sync(4);
		this.signal = new OscillatorNode(context.audioContext, {
			frequency: this.mode ? this.mode.getFrequency() : context.tempo,
			type: "sine"
		})
	}

	setSync(div: 0 | 1 | 2 | 4 | 8 | 16 | 32): void {
		let frequency = context.tempo;

		if (div === 0) {
			this.mode = null;
		} else {
			this.mode = new Sync(4);
			frequency = this.mode.getFrequency();
		}
		this.setFrequency(frequency);
	}

	setFrequency(newFrequency: number): void {
		this.signal.frequency.setValueAtTime(newFrequency, context.audioContext.currentTime);
	}
	
	setShape(newShape: OscillatorType): void {
		this.signal.type = newShape;
	}

	getSignal(): OscillatorNode {
		return (this.signal);
	}
}

export default LFOscillator;