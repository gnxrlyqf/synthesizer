import Oscillator from "../Modules/Oscillator";
import Gain from "../Modules/Gain";
import Envelope from "../Modules/Envelope";
import Output from "../Modules/Output";
import LFO from "../Modules/LFO";
import VCF from "./Filter";
import Distortion from "../Modules/Distortion";
import Modulator from "../Modules/Modulator";

export interface ModuleProps {
  id: string;
  x: number;
  y: number;
  cameraX: number;
  cameraY: number;
}

export { Oscillator, Gain, Envelope, Output, LFO, VCF, Distortion, Modulator };