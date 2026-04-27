import { useEffect, useRef, useState } from "react";
import Knob from "../Inputs/Knob";
import { wouldOverlap } from "../Utils/wouldOverlap";

const GRID_SIZE = 16;
const MODULE_WIDTH = 224;
const MODULE_HEIGHT = 440;

function Modulator(props: {id: string, x: number, y: number, cameraX: number, cameraY: number}) {
  const moduleRef = useRef<HTMLDivElement | null>(null);
  const [position, setPosition] = useState({ x: props.x, y: props.y });
  const [mode, setMode] = useState<'AM' | 'FM' | 'PM' | 'RING'>('AM');
  const [depth, setDepth] = useState(50);

  const handleHeaderMouseDown = (e: React.MouseEvent) => {
    if (!moduleRef.current) return;
    const start = position;
    const offsetX = e.clientX - props.cameraX - start.x;
    const offsetY = e.clientY - props.cameraY - start.y;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const worldX = moveEvent.clientX - props.cameraX - offsetX;
      const worldY = moveEvent.clientY - props.cameraY - offsetY;
      const snappedX = Math.round(worldX / GRID_SIZE) * GRID_SIZE;
      const snappedY = Math.round(worldY / GRID_SIZE) * GRID_SIZE;
      setPosition(prev => wouldOverlap(snappedX, snappedY, moduleRef.current!) ? prev : { x: snappedX, y: snappedY });
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  return (
    <div ref={moduleRef} data-patch-module="true" data-module-id={props.id} 
      style={{ width: MODULE_WIDTH, height: MODULE_HEIGHT, left: position.x, top: position.y }}
      className="absolute m-4 flex flex-col bg-cyan-600 text-white rounded-3xl overflow-hidden font-lexend">
        <div className="w-full bg-cyan-600 px-4 pt-2 cursor-move select-none text-center" onMouseDown={handleHeaderMouseDown}>
          <span className="text-white text-4xl leading-none">Modulator</span>
        </div>
        <div className="mx-1.5 mt-2 mb-1.5 flex flex-1 flex-col gap-3 items-center rounded-2xl bg-black py-5">
          
          {/* Radio Selectors for Modulation Mode */}
          <div className="grid grid-cols-2 gap-2 w-full px-4 mb-2">
            {['AM', 'FM', 'PM', 'RING'].map((m) => (
              <label key={m} className={`flex items-center justify-between px-2 py-1 rounded-lg border transition cursor-pointer ${mode === m ? 'border-cyan-500 bg-cyan-500/20' : 'border-gray-800'}`}>
                <span className="text-[10px] font-bold">{m}</span>
                <input 
                  type="radio" 
                  name={`modMode-${props.id}`} 
                  value={m} 
                  checked={mode === m} 
                  onChange={() => setMode(m as any)} 
                  className="accent-cyan-500 w-3 h-3" 
                />
              </label>
            ))}
          </div>

          <div className="px-3 pt-2 pb-1 rounded-xl border-2 border-cyan-500 flex flex-col items-center">
            <span className="text-[10px] uppercase mb-1">Depth / Index</span>
            <Knob max={100} min={0} step={1} value={depth} onChange={setDepth} size={90} unit="%" />
          </div>

          <div className="w-full flex flex-col gap-2 mt-auto">
             <div className="flex items-center w-full">
                <span data-port-id={`${props.id}.carrier`} data-port-side="left" className="h-1 bg-cyan-500 flex-1" />
                <button className="px-3 py-1 border-2 border-cyan-500 rounded-lg text-[10px] uppercase">Carrier</button>
                <span className="flex-1" />
             </div>
             <div className="flex items-center w-full">
                <span data-port-id={`${props.id}.modulator`} data-port-side="left" className="h-1 bg-cyan-500 flex-1" />
                <button className="px-3 py-1 border-2 border-cyan-500 rounded-lg text-[10px] uppercase">Mod In</button>
                <span className="flex-1" />
             </div>
             <div className="flex items-center w-full mt-1">
                <span className="flex-1" />
                <button className="px-4 py-2 bg-cyan-600 rounded-xl text-white text-xl uppercase leading-none">Output</button>
                <span data-port-id={`${props.id}.output`} data-port-side="right" className="h-1 bg-cyan-500 flex-1" />
             </div>
          </div>
        </div>
    </div>
  );
}

export default Modulator;