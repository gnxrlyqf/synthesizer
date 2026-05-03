import { Processor } from "../Abstractions";
import Patch from "./Patch";
import context from "../test";

class VCF extends Processor {
    signal = new BiquadFilterNode(context.audioContext, {
        type: "lowpass",
        frequency: 1000,
        Q: 1
    });
    
    freqModulator: Patch | null = null;
    qModulator: Patch | null = null;

    setType(type: BiquadFilterType) {
        this.signal.type = type;
    }

    setFrequency(value: number) {
        this.signal.frequency.setValueAtTime(value, context.audioContext.currentTime);
    }

    setQ(value: number) {
        this.signal.Q.setValueAtTime(value, context.audioContext.currentTime);
    }

    // Allows an LFO or Envelope to modulate the cutoff frequency
    setFreqModulator(modulator: Patch | null) {
        this.freqModulator?.getSignal()?.disconnect(this.signal.frequency);
        this.freqModulator = modulator;
        this.freqModulator?.getSignal()?.connect(this.signal.frequency);
    }

    // Standard input routing
    setInput(input: Patch | null) {
        this.input?.getSignal()?.disconnect(this.signal);
        this.input = input;
        this.input?.getSignal()?.connect(this.signal);
    }

    getSignal(): BiquadFilterNode {
        return this.signal;
    }
}

export default VCF;