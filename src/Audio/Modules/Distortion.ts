import { Module } from "../Abstractions";
import Patch from "./Patch";

export type DistortionType = "sine" | "soft" | "hard" | "downsample";

class Distortion extends Module {
    signal: WaveShaperNode;
    amount: AudioParam;
    amountInput: Patch | null = null;
    type: DistortionType = "soft";

    constructor(audioContext: AudioContext) {
        super(audioContext);
        const amountControl = new GainNode(this.audioContext, { gain: 50 });
        this.amount = amountControl.gain;
        this.signal = new WaveShaperNode(this.audioContext);
        this.setCurve();
    }

    setDistortionType(type: DistortionType) {
        this.type = type;
        this.setCurve();
    }

    setAmount(value: number) {
        // Clamp amount between 0-100 for safety
        this.amount.value = Math.max(0, Math.min(100, value));
        this.setCurve();
    }

    setAmountModulator(modulator: Patch | null) {
        this.amountInput?.getSignal()?.disconnect(this.amount);
        this.amountInput = modulator;
        modulator?.getSignal()?.connect(this.amount);
    }

    private setCurve() {
        const n_samples = 44100;
        const curve = new Float32Array(n_samples);
        
        for (let i = 0; i < n_samples; ++i) {
            const x = (i * 2) / n_samples - 1; // Input signal from -1 to 1

            switch (this.type) {
                case "sine":
                    // Smooth hyperbolic tangent curve (Analog feel)
                    // Formula: f(x) = tanh(k * x) / tanh(k)
                    const k = this.amount.value / 10;
                    curve[i] = Math.tanh(x * k) / Math.tanh(k);
                    break;

                case "soft":
                    // Aggressive digital clipping
                    const threshold = 1 - (this.amount.value / 105); 
                    if (x > threshold) curve[i] = threshold;
                    else if (x < -threshold) curve[i] = -threshold;
                    else curve[i] = x;
                    break;

                case "hard":
                    // Soft-clipping with gain boost
                    const drive = this.amount.value / 10;
                    curve[i] = (1 + drive) * x / (1 + drive * Math.abs(x));
                    break;

                case "downsample":
                    // Simulates phase warping by using an asymmetric sine-shaper
                    // This creates the "pinched" harmonic look of PD synths
                    const warp = (this.amount.value / 100) * Math.PI;
                    curve[i] = Math.sin(x * Math.PI + warp * Math.sin(x * Math.PI));
                    break;
            }
        }
        this.signal.curve = curve;
    }

    setInput(input: Patch | null) {
        this.input?.getSignal()?.disconnect(this.signal);
        this.input = input;
        this.input?.getSignal()?.connect(this.signal);
    }

    setParam(key: string, patch: Patch | null): void {
        switch (key) {
            case "amount":
                this.setAmountModulator(patch);
                break;
            case "input":
                this.setInput(patch);
                break;
        }
    }

    getSignal(): WaveShaperNode {
        return this.signal;
    }
}

export default Distortion;