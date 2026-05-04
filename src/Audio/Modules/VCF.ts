import { Module } from "../Abstractions";
import Patch from "./Patch";

class VCF extends Module {
    signal: BiquadFilterNode;
    
    freqModulator: Patch | null = null;
    qModulator: Patch | null = null;

    constructor(audioContext: AudioContext) {
        super(audioContext);
        this.signal = new BiquadFilterNode(this.audioContext, {
            type: "lowpass",
            frequency: 1000,
            Q: 1
        });
    }

    setType(type: BiquadFilterType) {
        this.signal.type = type;
    }

    setFrequency(value: number) {
        this.signal.frequency.setValueAtTime(value, this.audioContext.currentTime);
    }

    setQ(value: number) {
        this.signal.Q.setValueAtTime(value, this.audioContext.currentTime);
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

    setQModulator(modulator: Patch | null) {
        this.qModulator?.getSignal()?.disconnect(this.signal.Q);
        this.qModulator = modulator;
        this.qModulator?.getSignal()?.connect(this.signal.Q);
    }

    setMod(key: string, patch: Patch | null): void {
        switch (key) {
            case "frequency":
                this.setFreqModulator(patch);
                break;
            case "freqModulator":
                this.setFreqModulator(patch);
                break;
            case "Q":
                this.setQModulator(patch);
                break;
            case "qModulator":
                this.setQModulator(patch);
                break;
            case "input":
                this.setInput(patch);
                break;
        }
    }

    setParam(key: string, value: number | string): void {
        switch (key) {
            case "frequency":
                this.setFrequency(value as number);
                break;
            case "Q":
                this.setQ(value as number);
                break;
            case "type":
                this.setType(value as BiquadFilterType);
                break;
        }
    }

    getSignal(): BiquadFilterNode {
        return this.signal;
    }
}

export default VCF;