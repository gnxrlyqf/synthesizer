import { Module } from "../Abstractions";
import Patch from "./Patch";

class Gain extends Module {
	signal: GainNode;
	modulator: Patch | null = null;

	constructor(audioContext: AudioContext) {
		super(audioContext);
		this.signal = new GainNode(this.audioContext, { gain: 1 });
	}

	setGain(value: number) {
		this.signal.gain.value = value;
	}


    setModulator(modulator: Patch | null) {
        this.modulator?.getSignal()?.disconnect(this.signal.gain);
        this.modulator = modulator;
        this.modulator?.getSignal()?.connect(this.signal.gain);
    }

    setInput(input: Patch | null) {
        this.input?.getSignal()?.disconnect(this.signal);
        this.input = input;
        this.input?.getSignal()?.connect(this.signal);
    }

	setParam(key: string, patch: Patch | null): void {
		switch (key) {
			case "gain":
				this.setModulator(patch);
				break;
			case "modulator":
				this.setModulator(patch);
				break;
			case "input":
				this.setInput(patch);
				break;
		}
	}

	getSignal(): GainNode {
		return (this.signal);
	}
}

export default Gain;