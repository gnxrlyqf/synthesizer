import { Module } from "../Abstractions";
import Patch from "./Patch";

class Sync {
	division: 1 | 2 | 4 | 8 | 16 | 32;
	tempo: number;

	constructor(division: 1 | 2 | 4 | 8 | 16 | 32, tempo: number) {
		this.division = division;
		this.tempo = tempo;
	}

	getFrequency(): number {
		return ((this.tempo / 60) / this.division);
	}
}


class LFOscillator extends Module {
	signal: OscillatorNode;
	mode: Sync | null;
	protected tempo: number;

	constructor(audioContext: AudioContext, tempo: number = 120) {
		super(audioContext);
		this.tempo = tempo;
		this.mode = new Sync(4, this.tempo);
		this.signal = new OscillatorNode(this.audioContext, {
			frequency: this.mode ? this.mode.getFrequency() : this.tempo,
			type: "sine"
		});
	}

	setSync(div: 0 | 1 | 2 | 4 | 8 | 16 | 32): void {
		let frequency = this.tempo;

		if (div === 0) {
			this.mode = null;
		} else {
			this.mode = new Sync(div as any, this.tempo);
			frequency = this.mode.getFrequency();
		}
		this.setFrequency(frequency);
	}

	setFrequency(newFrequency: number): void {
		this.signal.frequency.setValueAtTime(newFrequency, this.audioContext.currentTime);
	}

	setShape(newShape: OscillatorType): void {
		this.signal.type = newShape;
	}

	setFreqModulator(modulator: Patch | null) {
		modulator?.getSignal()?.connect(this.signal.frequency);
	}

	setParam(key: string, patch: Patch | null): void {
		switch (key) {
			case "frequency":
				this.setFreqModulator(patch);
				break;
			case "input":
				this.setInput(patch);
				break;
		}
	}

	setInput(input: Patch | null) {
		this.input?.getSignal()?.disconnect(this.signal);
		this.input = input;
		this.input?.getSignal()?.connect(this.signal);
	}

	getSignal(): OscillatorNode {
		return (this.signal);
	}
}

export default LFOscillator;