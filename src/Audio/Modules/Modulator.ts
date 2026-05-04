import { Module } from "../Abstractions";
import Patch from "./Patch";

export type ModulationMode = "AM" | "FM" | "PM" | "RM";

class Modulator extends Module {
    // Internal nodes for different mathematical routing
    amRingNode: GainNode;
    pmNode: DelayNode;
    depthNode: GainNode;

    // The final output node
    signal: GainNode;

    modulatorInput: Patch | null = null;
    depthInput: Patch | null = null;
    mode: ModulationMode = "AM";

    constructor(audioContext: AudioContext) {
        super(audioContext);
        this.amRingNode = new GainNode(this.audioContext, { gain: 0 });
        this.pmNode = new DelayNode(this.audioContext, { maxDelayTime: 1, delayTime: 0.001 });
        this.depthNode = new GainNode(this.audioContext, { gain: 1 });
        this.signal = new GainNode(this.audioContext, { gain: 1 });
        this.amRingNode.connect(this.signal);
    }

    setMode(newMode: ModulationMode) {
        this.cleanRouting();
        this.mode = newMode;
        this.applyRouting();
    }

    private cleanRouting() {
        // Disconnect inputs to prevent signal leaking when switching modes
        this.input?.getSignal()?.disconnect();
        this.modulatorInput?.getSignal()?.disconnect();
        this.depthInput?.getSignal()?.disconnect(this.depthNode.gain);
        
        this.amRingNode.disconnect();
        this.pmNode.disconnect();
        this.depthNode.disconnect();
    }

    private applyRouting() {
        const carrierNode = this.input?.getSignal();
        const modNode = this.modulatorInput?.getSignal();

        if (!carrierNode) return;

        switch (this.mode) {
            case "AM":
            case "RM":
                // Both use a GainNode as a multiplier
                carrierNode.connect(this.amRingNode);
                if (modNode)
                    modNode.connect(this.depthNode);
                this.depthNode.connect(this.amRingNode.gain);
                this.amRingNode.connect(this.signal);
                break;
            case "PM":
                // PM modulates delay time at audio rate
                carrierNode.connect(this.pmNode);
                if (modNode)
                    modNode.connect(this.depthNode);
                this.depthNode.connect(this.pmNode.delayTime);
                this.pmNode.connect(this.signal);
                break;
            case "FM":
                // Carrier goes straight to output, modulator targets the frequency param
                carrierNode.connect(this.signal); 
                if (modNode)
                    modNode.connect(this.depthNode);
                if ("frequency" in carrierNode) {
                    const carrierFrequency = carrierNode.frequency as AudioParam;
                    this.depthNode.connect(carrierFrequency);
                }
                break;
        }
    }

    setInput(input: Patch | null) {
        this.input = input;
        this.applyRouting();
    }

    setModulator(modulator: Patch | null) {
        this.modulatorInput = modulator;
        this.applyRouting();
    }

    setDepth(modulator: Patch | null) {
        this.depthInput?.getSignal()?.disconnect(this.depthNode.gain);
        this.depthInput = modulator;
        modulator?.getSignal()?.connect(this.depthNode.gain);
    }

    setMod(key: string, patch: Patch | null): void {
        switch (key) {
            case "input":
                this.setInput(patch);
                break;
            case "modulator":
                this.setModulator(patch);
                break;
            case "depth":
                this.setDepth(patch);
                break;
        }
    }

    setParam(key: string, value: number | string): void {
        switch (key) {
            case "mode":
                this.setMode(value as ModulationMode);
                break;
            case "depth":
                this.depthNode.gain.value = value as number;
                break;
        }
    }

    getSignal(): GainNode {
        return this.signal;
    }
}

export default Modulator;