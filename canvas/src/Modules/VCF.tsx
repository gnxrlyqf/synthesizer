import {useRef, useState } from "react";
import Knob from "../Interactions/Knob";
import Wave from "../Interactions/Wave";
import { useDrag } from "../Interactions/useDrag";
import { ModuleMenu } from '../Interactions/ContextMenu';
import { useContextMenu } from "../Utils/useContextMenu";

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
  const { menu, setMenu, handleContextMenu } = useContextMenu();

  // --- DRAG LOGIC ---
  const onMouseDown = useDrag(props, position, setPosition, moduleRef);

  return (
    <div 
      ref={moduleRef}
      data-patch-module="true"
      data-module-id={props.id}
      onContextMenu={handleContextMenu}
      style={{ width: MODULE_WIDTH, height: MODULE_HEIGHT, left: position.x, top: position.y }}
      className="absolute m-4 flex flex-col bg-orange-500 text-white rounded-3xl overflow-hidden font-lexend"
    >
      {menu && (
      <ModuleMenu 
        id={props.id} 
        x={menu.x} 
        y={menu.y}
        color="#ff6a00"
        onDelete={(id: string) => { console.log("Deleting", id); setMenu(null); }} 
      />
      )}
        {/* MODULE HEADER */}
        <div className="w-full bg-orange-500 px-4 pt-2 text-center cursor-move select-none" onMouseDown={onMouseDown}>
          <span className="text-white text-4xl leading-none">VCF</span>
        </div>

        {/* MAIN BODY */}
        <div className="mx-2 mt-2 mb-1.5 flex flex-1 flex-col gap-4 items-center rounded-2xl bg-black py-5">

          {/* KNOBS SIDE-BY-SIDE: Cutoff and Resonance */}
          <div className="flex flex-row justify-evenly w-full px-2 gap-2">
            {/* Cutoff Circle */}
            <div className="flex-1 max-w-[110px] px-1 pt-2 pb-1 rounded-xl border-2 border-orange-500 flex flex-col items-center gap-1">
              <span className="text-[14px] uppercase text-white font-bold">Cutoff</span>
              <Knob max={15000} min={20} step={1} value={frequency} onChange={setFrequency} size={70} unit="Hz" />
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