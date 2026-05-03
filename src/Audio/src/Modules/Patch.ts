import {Source, Processor} from "../Abstractions";

class Patch {
	input: Source | Processor | null;

	constructor(input: Source | Processor | null) {
		this.input = input;
	}

	getSignal() {
		return (this.input?.getSignal());
	}
}

export default Patch;