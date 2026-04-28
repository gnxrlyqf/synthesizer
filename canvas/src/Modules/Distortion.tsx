import { useEffect, useRef, useState } from "react";
import Knob from "../Interactions/Knob";
import Wave from "../Interactions/Wave";
import { wouldOverlap } from "../Utils/wouldOverlap";

const GRID_SIZE = 16;
const MODULE_WIDTH = 225;
const MODULE_HEIGHT = 450;

function Distortion(props: {
  id: string,
  x: number,
  y: number,
  a: number,
  t: string,
  w: 'sine' | 'square' | 'triangle' | 'saw',
  cameraX: number,
  cameraY: number}) {
    
  // --- STATE ---
  const moduleRef = useRef<HTMLDivElement | null>(null);
  const [position, setPosition] = useState({ x: props.x, y: props.y });
  const [amount, setAmount] = useState(props.a);
  const [type, setType] = useState(props.t ?? "saturation");
  const [waveshape, setWaveshape] = useState<'sine' | 'square' | 'triangle' | 'saw'>(props.w);



  const modes = ['saturation', 'hard', 'overdrive', 'phase'];
  // --- DRAG LOGIC ---
  const handleHeaderMouseDown = (e: React.MouseEvent) => {
    if (!moduleRef.current) return;
    const start = position;
    const offsetX = e.clientX - props.cameraX - start.x;
    const offsetY = e.clientY - props.cameraY - start.y;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const worldX = moveEvent.clientX - props.cameraX - offsetX;
      const worldY = moveEvent.clientY - props.cameraY - offsetY;
      
      // Snap to grid
      const snappedX = Math.round(worldX / GRID_SIZE) * GRID_SIZE;
      const snappedY = Math.round(worldY / GRID_SIZE) * GRID_SIZE;
      
      // Collision detection check
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
      ref={moduleRef} // CRITICAL: Added the missing ref here
      data-patch-module="true" 
      data-module-id={props.id} 
      style={{ width: MODULE_WIDTH, height: MODULE_HEIGHT, left: position.x, top: position.y }}
      className="absolute m-4 flex flex-col bg-yellow-500 text-white rounded-3xl overflow-hidden font-lexend"
    >
      {/* MODULE HEADER */}
      <div className="w-full bg-yellow-500 px-4 pt-2 cursor-move select-none text-center" onMouseDown={handleHeaderMouseDown}>
        <span className="text-white text-4xl leading-none">Distort</span>
      </div>

      {/* MAIN BODY: mx-2 matches Modulator's slimmer side gaps */}
      <div className="mx-2 mt-2 mb-1.5 flex flex-1 flex-col gap-3 items-center rounded-2xl bg-black py-5">
        
        {/* PARAMETER KNOB */}
        <div className="px-3 pt-2 pb-1 rounded-xl border-2 border-yellow-500 flex flex-col items-center">
          <span className="text-[12px] uppercase mb-1 text-white">Amount</span>
          <Knob max={100} min={0} step={1} value={amount} onChange={setAmount} size={90} unit="%" />
        </div>

        {/* WAVESHAPING */}
        <div className="mt-1 mt-3">
          <Wave value={waveshape} onChange={setWaveshape} />
        </div>

        {/* PORTS */}
        <div className="w-full flex flex-col gap-2 mt-auto">
           <div className="flex items-center w-full">
              <span data-port-id={`${props.id}.input`} data-port-side="left" className="h-1 bg-yellow-500 flex-1" />
              <button className="px-4 py-2 border-2 mb-2 border-yellow-600 rounded-xl text-white text-xl uppercase leading-none bg-transparent">Input</button>
              <span className="flex-1" />
           </div>
           
           <div className="flex items-center w-full mt-1">
              <span className="flex-1" />
              <button className="px-4 py-2 border-2 border-yellow-600 rounded-xl text-white text-xl uppercase leading-none bg-transparent">Output</button>
              <span data-port-id={`${props.id}.output`} data-port-side="right" className="h-1 bg-yellow-500 flex-1" />
           </div>
        </div>
      </div>
    </div>
  );
}

export default Distortion;