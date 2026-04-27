import { Processor } from "../Abstractions";
import Patch from "./Patch";
import context from "../test";

export type ModulationMode = "AM" | "FM" | "PM" | "RING";

class Modulator extends Processor {
    // Internal nodes for different mathematical routing
    amRingNode = new GainNode(context.audioContext, { gain: 0 }); 
    pmNode = new DelayNode(context.audioContext, { maxDelayTime: 1, delayTime: 0.001 });
    
    // The final output node
    signal = new GainNode(context.audioContext, { gain: 1 }); 
    
    modulatorInput: Patch | null = null;
    mode: ModulationMode = "AM";

    constructor() {
        super();
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
        
        this.amRingNode.disconnect();
        this.pmNode.disconnect();
    }

    private applyRouting() {
        const carrierNode = this.input?.getSignal();
        const modNode = this.modulatorInput?.getSignal();

        if (!carrierNode) return;

        switch (this.mode) {
            case "AM":
            case "RING":
                // Both use a GainNode as a multiplier
                carrierNode.connect(this.amRingNode);
                if (modNode)
                    modNode.connect(this.amRingNode.gain);
                this.amRingNode.connect(this.signal);
                break;
            case "PM":
                // PM modulates delay time at audio rate
                carrierNode.connect(this.pmNode);
                if (modNode)
                    modNode.connect(this.pmNode.delayTime);
                this.pmNode.connect(this.signal);
                break;
            case "FM":
                // Carrier goes straight to output, modulator targets the frequency param
                carrierNode.connect(this.signal); 
                if (modNode && 'frequency' in carrierNode)
                    //  @ts-ignore: We safely assume the carrier has a frequency AudioParam
                     modNode.connect(carrierNode.frequency);
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

    getSignal(): GainNode {
        return this.signal;
    }
}

export default Modulator;