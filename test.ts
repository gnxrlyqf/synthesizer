import Oscillator from "./Modules/VCO";
import Patch from "./Modules/Patch";
import Output from "./Modules/Output";
import Gain from "./Modules/Gain";
import Context from "./Modules/Context";

const context = new Context;

function test() {
	const osc = new Oscillator();
	
	const patch1 = new Patch(osc);

	const gain = new Gain();
	gain.setGain(.5);
	gain.setInput(patch1);

	const patch2 = new Patch(gain);

	const output = new Output();
	output.setInput(patch2);

	osc.oscillate();
}

function main() {
	window.addEventListener("pointerdown", test);
}

main();

export default context;