import { Processor } from "./Abstractions";
import Patch from "./Patch";
import context from "../test";

class Gain extends Processor {
	signal = new GainNode(context.audioContext, { gain: 1 });

	setGain(value: number) {
		this.signal.gain.value = value;
	}

	setInput(input: Patch | null) {
		this.input?.getSignal()?.disconnect(this.signal);
		this.input = input;
		this.input?.getSignal()?.connect(this.signal);
	}

	getSignal(): GainNode {
		return (this.signal);
	}
}

export default Gain;