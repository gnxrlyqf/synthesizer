import { useEffect, useRef, useState } from "react";
import Knob from "../Inputs/Knob";

function VCF(props: {
  id: string, x: number, y: number,
  f: number, r: number, t: string,
  cameraX: number, cameraY: number
}) {
  const [frequency, setFrequency] = useState(props.f);
  const [resonance, setResonance] = useState(1);
  const [filterType, setFilterType] = useState('lowpass');

  return (
    <div className="absolute m-4 w-[224px] h-[450px] flex flex-col bg-orange-500 text-white rounded-3xl overflow-hidden font-lexend">
        <div className="w-full bg-orange-500 px-4 pt-2 text-center cursor-move"><span className="text-4xl">VCF</span></div>
        <div className="mx-1.5 mt-2 mb-1.5 flex flex-1 flex-col gap-4 items-center rounded-2xl bg-black py-5">
          <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="bg-orange-900 border border-orange-500 rounded-lg text-xs p-1">
            <option value="lowpass">Low Pass</option>
            <option value="highpass">High Pass</option>
            <option value="bandpass">Band Pass</option>
          </select>
          <div className="flex flex-col items-center gap-1 border-2 border-orange-500 p-2 rounded-xl">
            <span className="text-[10px] uppercase">Cutoff</span>
            <Knob max={10000} min={20} step={1} value={frequency} onChange={setFrequency} size={80} unit="Hz" />
          </div>
          <div className="flex flex-col items-center gap-1 border-2 border-orange-500 p-2 rounded-xl">
            <span className="text-[10px] uppercase">Resonance</span>
            <Knob max={20} min={0.1} step={0.1} value={resonance} onChange={setResonance} size={80} unit="Q" />
          </div>
          <div className="w-full flex items-center mt-auto">
            <span data-port-id={`${props.id}.input`} data-port-side="left" className="h-1 bg-orange-500 flex-1" />
            <button className="px-3 py-1 border-2 border-orange-500 rounded-lg text-sm">IN</button>
            <span className="flex-1" />
            <button className="px-3 py-1 border-2 border-orange-500 rounded-lg text-sm">OUT</button>
            <span data-port-id={`${props.id}.output`} data-port-side="right" className="h-1 bg-orange-500 flex-1" />
          </div>
        </div>
    </div>
  );
}

export default VCF;