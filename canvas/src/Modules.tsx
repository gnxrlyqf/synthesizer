type BaseModule = {
  id: string;
  type: 'oscillator' | 'gain' | 'envelope' | 'output';
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

type Module = OscModule | EnvModule | GainModule | OutModule;

export type {BaseModule, OscModule, EnvModule, GainModule, OutModule, Module};