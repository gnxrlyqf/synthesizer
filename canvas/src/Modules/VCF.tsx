import { useEffect, useRef, useState } from "react";
import Knob from "../Interactions/Knob";
import Wave from "../Interactions/Wave";
import { wouldOverlap } from "../Utils/wouldOverlap";

const GRID_SIZE = 16;
const MODULE_WIDTH = 300;
const MODULE_HEIGHT = 440;

function VCF(props: {
  id: string, x: number, y: number,
  f: number, r: number, t: string,
  cameraX: number, cameraY: number
}) {
  // --- STATE & REFS ---
  const moduleRef = useRef<HTMLDivElement | null>(null);
  const [position, setPosition] = useState({ x: props.x, y: props.y });
  const [frequency, setFrequency] = useState(props.f);
  const [resonance, setResonance] = useState(props.r);
  const [filterType, setFilterType] = useState(props.t ?? 'lowpass');

  // --- DRAG LOGIC ---
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
    <div 
      ref={moduleRef}
      data-patch-module="true"
      data-module-id={props.id}
      style={{ width: MODULE_WIDTH, height: MODULE_HEIGHT, left: position.x, top: position.y }}
      className="absolute m-4 flex flex-col bg-orange-500 text-white rounded-3xl overflow-hidden font-lexend"
    >
        {/* MODULE HEADER */}
        <div className="w-full bg-orange-500 px-4 pt-2 text-center cursor-move select-none" onMouseDown={handleHeaderMouseDown}>
          <span className="text-white text-4xl leading-none">VCF</span>
        </div>

        {/* MAIN BODY */}
        <div className="mx-2 mt-2 mb-1.5 flex flex-1 flex-col gap-4 items-center rounded-2xl bg-black py-5">

          {/* KNOBS SIDE-BY-SIDE: Cutoff and Resonance */}
          <div className="flex flex-row justify-evenly w-full px-2 gap-2">
            {/* Cutoff Circle */}
            <div className="flex-1 max-w-[110px] px-1 pt-2 pb-1 rounded-xl border-2 border-orange-500 flex flex-col items-center gap-1">
              <span className="text-[14px] uppercase text-white font-bold">Cutoff</span>
              <Knob max={10000} min={20} step={1} value={frequency} onChange={setFrequency} size={70} unit="Hz" />
            </div>

            {/* Resonance Circle */}
            <div className="flex-1 max-w-[110px] px-1 pt-2 pb-1 rounded-xl border-2 border-orange-500 flex flex-col items-center gap-1">
              <span className="text-[14px] uppercase text-white font-bold">Res</span>
              <Knob max={20} min={0.1} step={0.1} value={resonance} onChange={setResonance} size={70} unit="Q" />
            </div>
          </div>

          {/* WAVE-STYLE SELECTOR: Using the Wave component for Filter Types */}
          <div className="mt-1 pt-2">
            <Wave value={filterType as any} onChange={(val) => setFilterType(val)} />
          </div>

          {/* PORTS: Input and Output buttons sized equally */}
          <div className="w-full flex flex-col gap-4 mt-auto">
             {/* INPUT PORT */}
             <div className="flex items-center w-full">
                <span data-port-id={`${props.id}.input`} data-port-side="left" className="h-1 bg-orange-500 flex-1" />
                <button className="px-6 py-2 border-2 border-orange-500 rounded-xl text-white text-xl uppercase leading-none bg-transparent">
                  Input
                </button>
                <span className="flex-1" />
             </div>
             
             {/* OUTPUT PORT */}
             <div className="flex items-center w-full">
                <span className="flex-1" />
                <button className="px-6 py-2 border-2 border-orange-500 rounded-xl text-white text-xl uppercase leading-none bg-transparent">
                  Output
                </button>
                <span data-port-id={`${props.id}.output`} data-port-side="right" className="h-1 bg-orange-500 flex-1" />
             </div>
          </div>
        </div>
    </div>
  );
}

export default VCF;