type BaseModule = {
  id: string;
  type: 'oscillator' | 'gain' | 'envelope' | 'output' | 'lfo' | 'filter' | 'distortion' | 'modulator';
  x: number;
  y: number;
}

type OscModule = BaseModule & {
	type: "oscillator";
	params: {
		f: number;
		w: "sine" | "square" | "triangle" | "sawtooth";
	};
}

type GainModule = BaseModule & {
	type: "gain";
	params: {
		g: number;
	};
}

type EnvModule = BaseModule & {
	type: "envelope";
	params: {
		a: number;
		d: number;
		s: number;
		r: number;
	};
}

type OutModule = BaseModule & {
	type: "output";
	params: {
		m: number;
	};
}

type LfoModule = BaseModule & {
    type: "lfo";
    params: { f: number; w: "sine" | "square" | "triangle" | "sawtooth"; s: boolean };
}

type FilterModule = BaseModule & {
    type: "filter";
    params: { f: number; r: number; t: string };
}

type DistortModule = BaseModule & {
    type: "distortion";
    params: { a: number; t: "soft" | "hard" | "sine" | "downsample" };
}

type ModulateModule = BaseModule & {
    type: "modulator";
    params: { m: "AM" | "FM" | "PM" | "RM"; d: number };
}

type Module = OscModule | EnvModule | GainModule | OutModule | LfoModule | FilterModule | DistortModule | ModulateModule;

type ModuleType =
	| "oscillator"
	| "gain"
	| "envelope"
	| "output"
	| "lfo"
	| "filter"
	| "distortion"
	| "modulator";

export type {BaseModule, OscModule, EnvModule, GainModule, OutModule, Module,
						LfoModule, FilterModule, DistortModule, ModulateModule, ModuleType
};