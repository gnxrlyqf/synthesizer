import { Module } from "../Abstractions";
import Patch from "./Patch";

class Output extends Module {
	signal: AudioDestinationNode;

	constructor(audioContext: AudioContext) {
		super(audioContext);
		this.signal = this.audioContext.destination;
	}

	setInput(input: Patch | null) {
		this.input?.getSignal()?.disconnect(this.signal);
		this.input = input;
		this.input?.getSignal()?.connect(this.signal);
	}

	setParam(key: string, patch: Patch | null): void {
		switch (key) {
			case "master":
				this.setInput(patch);
				break;
			case "input":
				this.setInput(patch);
				break;
		}
	}

	getSignal(): AudioDestinationNode {
		return this.signal;
	}
}

export default Output;