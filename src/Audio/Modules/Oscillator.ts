import { Module } from "../Abstractions";
import Patch from "./Patch";

class Oscillator extends Module {
	signal: OscillatorNode;

    constructor(audioContext: AudioContext) {
        super(audioContext);
        this.signal = new OscillatorNode(this.audioContext, {
            frequency: 440,
            type: "sine"
        });
		this.oscillate();
    }

	setFrequency(newFrequency: number): void {
		this.signal.frequency.setValueAtTime(newFrequency, this.audioContext.currentTime);
	}
	
	setShape(newShape: OscillatorType): void {
		this.signal.type = newShape;
	}

	oscillate() {
		this.signal.start();
		// this.signal.stop(this.audioContext.currentTime + 2);
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

export default Oscillator;