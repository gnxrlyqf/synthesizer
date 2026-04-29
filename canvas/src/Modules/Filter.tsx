import {useRef, useState } from "react";
import Knob from "../Interactions/Knob";
import Wave from "../Interactions/Wave";
import { useDrag } from "../Interactions/useDrag";
import { ModuleMenu } from '../Interactions/ContextMenu';
import { useContextMenu } from "../Utils/useContextMenu";
import { Param, KnobParam } from "../Interactions/Params";

const MODULE_WIDTH = 224;
const MODULE_HEIGHT = 576;

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
          <span className="text-white text-4xl leading-none">Filter</span>
        </div>

        {/* MAIN BODY */}
        <div className="mx-2 mt-2 mb-1.5 flex flex-1 flex-col gap-3 items-center rounded-2xl bg-black pt-5">

          {/* KNOBS SIDE-BY-SIDE: Cutoff and Resonance */}
            {/* Cutoff Circle */}
            <KnobParam id={props.id} name="cutoff" side="left" color="orange-500">
              <Knob max={15000} min={20} step={1} value={frequency} onChange={setFrequency} size={80} unit="Hz" />
            </KnobParam>

            {/* Resonance Circle */}
            <KnobParam id={props.id} name="Q" side="left" color="orange-500">
              <Knob max={20} min={0.1} step={0.1} value={resonance} onChange={setResonance} size={80} unit="Q" />
            </KnobParam>

          {/* WAVE-STYLE SELECTOR: Using the Wave component for Filter Types */}
          <div className="mt-1">
            <Wave value={filterType as any} onChange={(val) => setFilterType(val)} />
          </div>

          {/* PORTS: Input and Output buttons sized equally */}
          <Param id={props.id} name="input" polarity="target" color="orange-500"/>
          <Param id={props.id} name="output" polarity="source" color="orange-500"/>
        </div>
    </div>
  );
}

export default VCF;