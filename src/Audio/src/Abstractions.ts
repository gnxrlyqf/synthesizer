import Patch from "./Modules/Patch";

abstract class Source {
	abstract signal: AudioNode;

	abstract getSignal(): AudioNode;
}

abstract class Processor {
	input: Patch | null = null;

	abstract getSignal(): AudioNode;
}

export {Source, Processor};