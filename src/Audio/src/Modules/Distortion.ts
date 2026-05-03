import { Processor } from "../Abstractions";
import Patch from "./Patch";
import context from "../test";

export type DistortionType = "overdrive" | "saturation" | "hardClipping" | "phaseDistortion";

class Distortion extends Processor {
    signal = new WaveShaperNode(context.audioContext);
    amount: number = 50;
    type: DistortionType = "saturation";

    constructor() {
        super();
        this.setCurve();
    }

    setDistortionType(type: DistortionType) {
        this.type = type;
        this.setCurve();
    }

    setAmount(value: number) {
        // Clamp amount between 0-100 for safety
        this.amount = Math.max(0, Math.min(100, value));
        this.setCurve();
    }

    private setCurve() {
        const n_samples = 44100;
        const curve = new Float32Array(n_samples);
        
        for (let i = 0; i < n_samples; ++i) {
            const x = (i * 2) / n_samples - 1; // Input signal from -1 to 1

            switch (this.type) {
                case "saturation":
                    // Smooth hyperbolic tangent curve (Analog feel)
                    // Formula: f(x) = tanh(k * x) / tanh(k)
                    const k = this.amount / 10;
                    curve[i] = Math.tanh(x * k) / Math.tanh(k);
                    break;

                case "hardClipping":
                    // Aggressive digital clipping
                    const threshold = 1 - (this.amount / 105); 
                    if (x > threshold) curve[i] = threshold;
                    else if (x < -threshold) curve[i] = -threshold;
                    else curve[i] = x;
                    break;

                case "overdrive":
                    // Soft-clipping with gain boost
                    const drive = this.amount / 10;
                    curve[i] = (1 + drive) * x / (1 + drive * Math.abs(x));
                    break;

                case "phaseDistortion":
                    // Simulates phase warping by using an asymmetric sine-shaper
                    // This creates the "pinched" harmonic look of PD synths
                    const warp = (this.amount / 100) * Math.PI;
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

    getSignal(): WaveShaperNode {
        return this.signal;
    }
}

export default Distortion;