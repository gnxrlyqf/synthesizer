class Context {
	public audioContext: AudioContext;
	public tempo: number;

	constructor() {
		this.audioContext = new AudioContext();
		this.tempo = 120;
	}

	setTempo(newTempo: number): void {
		this.tempo = newTempo
	}
}

export default Context;