import {Source} from "./Abstractions";
import context from "../test";

class Oscillator extends Source {
	signal: OscillatorNode;

	constructor() {
		super();
		this.signal = new OscillatorNode(context.audioContext, {
			frequency: 440,
			type: "sine"
		})
	}

	setFrequency(newFrequency: number): void {
		this.signal.frequency.setValueAtTime(newFrequency, context.audioContext.currentTime);
	}
	
	setShape(newShape: OscillatorType): void {
		this.signal.type = newShape;
	}

	oscillate() {
		this.signal.start();
		this.signal.stop(context.audioContext.currentTime + 2);
	}
	
	getSignal(): OscillatorNode {
		return (this.signal);
	}
}

export default Oscillator;