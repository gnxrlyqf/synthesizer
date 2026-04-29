import { useRef, useState } from "react";
import Knob from "../Interactions/Knob";
import Wave from "../Interactions/Wave";
import { useDrag } from "../Interactions/useDrag";
import { ModuleMenu } from '../Interactions/ContextMenu';
import { useContextMenu } from "../Utils/useContextMenu";
import { Param, KnobParam } from "../Interactions/Params";

const MODULE_WIDTH = 224;
const MODULE_HEIGHT = 480;

function Modulator(props: {
  id: string,
  x: number,
  y: number,
  m: "AM" | "FM" | "PM" | "RING",
  w: 'sine' | 'square' | 'triangle' | 'saw',
  d: number,
  cameraX: number,
  cameraY: number}) {
  
  const moduleRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: props.x, y: props.y });
  const [depth, setDepth] = useState(props.d);
  const [waveshape, setWaveshape] = useState<'sine' | 'square' | 'triangle' | 'saw'>(props.w);

  const onMouseDown = useDrag(props, position, setPosition, moduleRef);
  const { menu, setMenu, handleContextMenu } = useContextMenu();

  return (
    <div 
      ref={moduleRef} 
      data-patch-module="true" 
      data-module-id={props.id}
      onContextMenu={handleContextMenu}
      style={{ width: MODULE_WIDTH, height: MODULE_HEIGHT, left: position.x, top: position.y }}
      className="absolute m-4 flex flex-col bg-cyan-500 text-white rounded-3xl overflow-hidden font-lexend"
    >
      {menu && (
      <ModuleMenu 
        id={props.id} 
        x={menu.x} 
        y={menu.y}
        color="#0093b6"
        onDelete={(id: string) => { console.log("Deleting", id); setMenu(null); }} 
      />
    )}
        <div className="w-full bg-cyan-500 px-4 pt-2 text-center cursor-move select-none" onMouseDown={onMouseDown}>
          <span className="text-white text-4xl leading-none">Modulator</span>
        </div>
        <div className="mx-2 mt-2 mb-1.5 flex flex-1 flex-col gap-3 items-center rounded-2xl bg-black pt-5">
            <KnobParam id={props.id} name="depth" side="left" color="cyan-500">
              <Knob max={15000} min={20} step={1} value={depth} onChange={setDepth} size={100} unit="Hz" />
            </KnobParam>
          <div className="mt-0">
            <Wave value={waveshape} onChange={setWaveshape} />
          </div>
          <Param id={props.id} name="mod in" polarity="target" color="cyan-500"/>
          <Param id={props.id} name="carrier" polarity="target" color="cyan-500"/>
          <Param id={props.id} name="output" polarity="source" color="cyan-500"/>
          </div>
    </div>
  );
}

export default Modulator;