import { useEffect, useRef, useState } from "react";
import Knob from "../Interactions/Knob";
import Wave from "../Interactions/Wave";
import { wouldOverlap } from "../Utils/wouldOverlap";

// Configuration for grid snapping and module dimensions
const GRID_SIZE = 16;
const MODULE_WIDTH = 225;
const MODULE_HEIGHT = 450;

function Modulator(props: {
  id: string,
  x: number,
  y: number,
  m: "AM" | "FM" | "PM" | "RING",
  w: 'sine' | 'square' | 'triangle' | 'saw',
  d: number,
  cameraX: number,
  cameraY: number}) {
  
  // --- STATE & REFS ---
  const moduleRef = useRef<HTMLDivElement | null>(null);
  const [position, setPosition] = useState({ x: props.x, y: props.y });
  const [mode, setMode] = useState(props.m);
  const [depth, setDepth] = useState(props.d);
  const [waveshape, setWaveshape] = useState<'sine' | 'square' | 'triangle' | 'saw'>(props.w);

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
      ref={moduleRef} 
      data-patch-module="true" 
      data-module-id={props.id} 
      style={{ width: MODULE_WIDTH, height: MODULE_HEIGHT, left: position.x, top: position.y }}
      className="absolute m-4 flex flex-col bg-cyan-600 text-white rounded-3xl overflow-hidden font-lexend"
    >
        {/* MODULE HEADER: Draggable area */}
        <div className="w-full bg-cyan-600 px-4 pt-2 cursor-move select-none text-center" onMouseDown={handleHeaderMouseDown}>
          <span className="text-white text-4xl leading-none">Modulator</span>
        </div>

        {/* MAIN BODY: The black internal panel */}
        <div className="mx-2 mt-2 mb-1.5 flex flex-1 flex-col gap-3 items-center rounded-2xl bg-black py-5">

          {/* PARAMETER KNOB: Depth / Modulation Index */}
          <div className="px-3 pt-2 pb-1 rounded-xl border-2 border-cyan-500 flex flex-col items-center">
            <span className="text-[10px] uppercase mb-1 text-white">Depth / Index</span>
            <Knob max={100} min={0} step={1} value={depth} onChange={setDepth} size={90} unit="%" />
          </div>

          {/* MODE SELECTORS: AM, FM, PM, RING radio buttons */}
          <div className="mt-1">
            <Wave value={waveshape} onChange={setWaveshape} />
          </div>

          {/* PORTS & PATCH POINTS: Input and Output connections */}
          <div className="w-full flex flex-col gap-2 mt-auto">
             
             {/* CARRIER INPUT: Left side port */}
             <div className="flex items-center w-full">
                <span data-port-id={`${props.id}.carrier`} data-port-side="left" className="h-1 bg-cyan-500 flex-1" />
                <button className="px-3 py-1 border-2 border-cyan-500 rounded-lg text-[10px] uppercase bg-transparent text-white">
                  Carrier
                </button>
                <span className="flex-1" />
             </div>

             {/* MODULATOR INPUT: Left side port */}
             <div className="flex items-center w-full">
                <span data-port-id={`${props.id}.modulator`} data-port-side="left" className="h-1 bg-cyan-500 flex-1" />
                <button className="px-3 py-1 border-2 border-cyan-500 rounded-lg text-[10px] uppercase bg-transparent text-white">
                  Mod In
                </button>
                <span className="flex-1" />
             </div>

             {/* MAIN OUTPUT: Right side port */}
             <div className="flex items-center w-full mt-1">
                <span className="flex-1" />
                <button className="px-4 py-2 border-2 border-cyan-600 rounded-xl text-white text-xl uppercase leading-none bg-transparent">
                  Output
                </button>
                <span data-port-id={`${props.id}.output`} data-port-side="right" className="h-1 bg-cyan-500 flex-1" />
             </div>

          </div>
        </div>
    </div>
  );
}

export default Modulator;