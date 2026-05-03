import {Source} from "../Abstractions";
import context from "../test";

class Envelope extends Source {
	signal: ConstantSourceNode;

	attack: number;
	decay: number;
	sustain: number;
	release: number;

	constructor() {
		super();
		this.signal = new ConstantSourceNode(context.audioContext);
		this.signal.start();
		this.signal.offset.setValueAtTime(0, context.audioContext.currentTime);
		this.attack = .05;
		this.decay = .25;
		this.sustain = .5;
		this.release = .3;
	}

	trigger(): void {
		const env = this.signal.offset;
		const now = context.audioContext.currentTime;

		env.cancelScheduledValues(now);
		env.setValueAtTime(0, now);
		env.linearRampToValueAtTime(1, now + this.attack);
		env.linearRampToValueAtTime(this.sustain, now + this.attack + this.decay);
	}

	stop(): void {
		const env = this.signal.offset;
		const now = context.audioContext.currentTime;
		
		env.cancelScheduledValues(now);
		env.linearRampToValueAtTime(0, now + this.release);
	}

	getSignal(): ConstantSourceNode {
		return (this.signal);
	}
}

export default Envelope;