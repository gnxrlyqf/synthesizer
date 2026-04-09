import Oscillator from "./Modules/Oscillator";
import Patch from "./Modules/Patch";
import Output from "./Modules/Output";
import Gain from "./Modules/Gain";
import Context from "./Context";
import Envelope from "./Modules/Envelope";

const context = new Context;

function test() {
	const osc = new Oscillator();
	
	const patch1 = new Patch(osc);

	const gain = new Gain();
	gain.setGain(0);
	gain.setInput(patch1);

	const patch2 = new Patch(gain);

	const output = new Output();
	output.setInput(patch2);

	const env = new Envelope();
	let isFHeld = false;

	const patch3 = new Patch(env);

	gain.setModulator(patch3);

	document.addEventListener("keydown", (event: KeyboardEvent): void => {
		if (event.key.toLowerCase() !== "f" || event.repeat || isFHeld) {
			return;
		}

		isFHeld = true;
		env.trigger();
	});

	document.addEventListener("keyup", (event: KeyboardEvent): void => {
		if (event.key.toLowerCase() !== "f") {
			return;
		}

		isFHeld = false;
		env.stop();
	});

	osc.oscillate();
}

function main() {
	window.addEventListener("pointerdown", test, { once: true });
}

main();

export default context;