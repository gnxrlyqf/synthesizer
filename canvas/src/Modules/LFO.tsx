import { useEffect, useRef, useState } from "react";
import Knob from "../Interactions/Knob";
import Wave from "../Interactions/Wave";
import { wouldOverlap } from "../Utils/wouldOverlap";

const GRID_SIZE = 16;
const MODULE_WIDTH = 224;
const MODULE_HEIGHT = 440;

function LFO(props: {
  id: string, x: number, y: number,
  f: number, w: "sine" | "square" | "triangle" | "saw", s: boolean,
  cameraX: number, cameraY: number
}) {
  const moduleRef = useRef<HTMLDivElement | null>(null);
  const [position, setPosition] = useState({x: props.x, y: props.y});
  const [frequency, setFrequency] = useState(props.f);
  const [waveshape, setWaveshape] = useState<'sine' | 'square' | 'triangle' | 'saw'>('sine');
  const [isSynced, setIsSynced] = useState(false);

  // Common move logic would be extracted in a real build, kept here for consistency
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
    <div ref={moduleRef} data-patch-module="true" data-module-id={props.id} style={{width: MODULE_WIDTH, height: MODULE_HEIGHT, left: position.x, top: position.y}}
      className="absolute m-4 flex flex-col bg-purple-500 text-white rounded-3xl overflow-hidden font-lexend">
        <div className="w-full bg-purple-500 px-4 pt-2 cursor-move select-none text-center" onMouseDown={handleHeaderMouseDown}>
          <span className="text-white text-4xl leading-none">LFO</span>
        </div>
        <div className="mx-1.5 mt-2 mb-1.5 flex flex-1 flex-col gap-3 items-center rounded-2xl bg-black py-5">
          <div className="flex gap-2 bg-purple-900/50 p-1 rounded-lg">
            <button onClick={() => setIsSynced(false)} className={`px-3 py-1 rounded-md text-xs ${!isSynced ? 'bg-purple-500' : ''}`}>FREE</button>
            <button onClick={() => setIsSynced(true)} className={`px-3 py-1 rounded-md text-xs ${isSynced ? 'bg-purple-500' : ''}`}>SYNC</button>
          </div>
          <div className="w-full flex items-center">
            <span className="h-1 bg-purple-500 flex-1" />
            <div className="px-3 pt-2 pb-1 rounded-xl border-2 border-purple-500 flex flex-col items-center gap-1">
              <span className="text-[13px] uppercase tracking-wide text-white">
                {isSynced ? "Rate" : "Frequency"}
              </span>
              <Knob
                max={isSynced ? 32 : 20}
                min={isSynced ? 1 : 0.1}
                step={0.1}
                value={frequency}
                onChange={setFrequency}
                size={90}
                unit={isSynced ? "Div" : "Hz"}
              />
            </div>
            <span className="flex-1" />
          </div>
          <div className="mt-3 mb-3">
          <Wave value={waveshape} onChange={setWaveshape} />
          </div>
          <div className="w-full flex items-center mt-auto">
            <span className="flex-1" />
            <button className="px-4 py-2 rounded-xl border-2 border-purple-500 text-white text-xl uppercase leading-none">Output</button>
            <span data-port-id={`${props.id}.output`} data-port-side="right" className="h-1 bg-purple-500 flex-1" />
          </div>
        </div>
    </div>
  );
}

export default LFO;