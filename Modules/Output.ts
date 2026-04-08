import context from "../test";
import Patch from "./Patch";

class Output {
	input: Patch | null = null;

	constructor(input?: Patch) {
		if (input) {
			this.input = input;
			this.input?.getSignal()?.connect(context.audioContext.destination);
		}
	}

	setInput(input: Patch | null) {
		this.input?.getSignal()?.disconnect(context.audioContext.destination);
		this.input = input;
		this.input?.getSignal()?.connect(context.audioContext.destination);
	}
}

export default Output;