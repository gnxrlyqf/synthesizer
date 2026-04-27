import { useEffect, useRef, useState } from "react";
import Knob from "../Inputs/Knob";

function Distortion(props: {id: string, x: number, y: number, cameraX: number, cameraY: number}) {
  const [position, setPosition] = useState({ x: props.x, y: props.y });
  const [amount, setAmount] = useState(50);
  const [type, setType] = useState('saturation');

  const modes = ['saturation', 'hard', 'overdrive', 'phase'];

  return (
    <div className="absolute m-4 w-[240px] h-[460px] flex flex-col bg-yellow-500 text-white rounded-3xl overflow-hidden font-lexend"
      style={{ left: position.x, top: position.y }}>
      <div className="w-full bg-yellow-500 px-4 pt-2 text-center cursor-move"><span className="text-4xl">Distort</span></div>
      <div className="mx-1.5 mt-2 mb-1.5 flex flex-1 flex-col gap-4 items-center rounded-2xl bg-black py-4 px-2">
        
        {/* Radio Selectors for Waveshaping */}
        <div className="flex flex-col gap-2 w-full px-4">
          {modes.map(m => (
            <label key={m} className={`flex items-center justify-between px-3 py-1.5 rounded-xl border-2 transition cursor-pointer ${type === m ? 'border-yellow-500 bg-yellow-500/20' : 'border-gray-800'}`}>
              <span className="text-[10px] uppercase tracking-tighter">{m}</span>
              <input type="radio" name="distType" value={m} checked={type === m} onChange={() => setType(m)} className="accent-yellow-500" />
            </label>
          ))}
        </div>

        <div className="px-3 pt-2 pb-1 rounded-xl border-2 border-yellow-500 flex flex-col items-center">
          <span className="text-[10px] uppercase mb-1">Amount</span>
          <Knob max={100} min={0} step={1} value={amount} onChange={setAmount} size={90} unit="%" />
        </div>

        <div className="w-full flex items-center mt-auto">
          <span data-port-id={`${props.id}.input`} data-port-side="left" className="h-1 bg-yellow-500 flex-1" />
          <button className="px-4 py-2 border-2 border-yellow-500 rounded-xl text-xl">OUT</button>
          <span data-port-id={`${props.id}.output`} data-port-side="right" className="h-1 bg-yellow-500 flex-1" />
        </div>
      </div>
    </div>
  );
}

export default Distortion;