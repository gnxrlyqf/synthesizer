type BaseModule = {
  id: string;
  type: 'oscillator' | 'gain' | 'envelope' | 'output' | 'lfo' | 'vcf' | 'distortion' | 'modulator';
  x: number;
  y: number;
}

type OscModule = BaseModule & {
	type: "oscillator";
	params: {
		f: number;
		w: "sine" | "square" | "triangle" | "saw";
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
    params: { f: number; w: "sine" | "square" | "triangle" | "saw"; s: boolean };
}

type VcfModule = BaseModule & {
    type: "vcf";
    params: { f: number; r: number; t: string };
}

type DistortModule = BaseModule & {
    type: "distortion";
    params: { a: number; t: string, w: "sine" | "square" | "triangle" | "saw"};
}

type ModulateModule = BaseModule & {
    type: "modulator";
    params: { m: "AM" | "FM" | "PM" | "RING"; d: number, w: "sine" | "square" | "triangle" | "saw" };
}

type Module = OscModule | EnvModule | GainModule | OutModule | LfoModule | VcfModule | DistortModule | ModulateModule;

type ModuleType =
	| "oscillator"
	| "gain"
	| "envelope"
	| "output"
	| "lfo"
	| "vcf"
	| "distortion"
	| "modulator";

export type {BaseModule, OscModule, EnvModule, GainModule, OutModule, Module,
						LfoModule, VcfModule, DistortModule, ModulateModule, ModuleType
};