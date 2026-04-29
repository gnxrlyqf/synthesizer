import { useRef, useState } from "react";
import Knob from "../Interactions/Knob";
import Wave from "../Interactions/Wave";
import { useDrag } from "../Interactions/useDrag";
import { ModuleMenu } from '../Interactions/ContextMenu';
import { useContextMenu } from "../Utils/useContextMenu";
import { KnobParam, Param } from "../Interactions/Params";

const MODULE_WIDTH = 224;
const MODULE_HEIGHT = 448 ;

function Distortion(props: {
  id: string,
  x: number,
  y: number,
  a: number,
  t: string,
  w: 'sine' | 'square' | 'triangle' | 'saw',
  cameraX: number,
  cameraY: number
}) {
  // --- STATE ---
  const moduleRef = useRef<HTMLDivElement | null>(null);
  const [position, setPosition] = useState({ x: props.x, y: props.y });
  const [amount, setAmount] = useState(props.a);
  // const [type, setType] = useState(props.t ?? "saturation");
  const [waveshape, setWaveshape] = useState<'sine' | 'square' | 'triangle' | 'saw'>(props.w);
  const { menu, setMenu, handleContextMenu } = useContextMenu();

  // const modes = ['saturation', 'hard', 'overdrive', 'phase'];
  // --- DRAG LOGIC ---
  const onMouseDown = useDrag(props, position, setPosition, moduleRef);

  return (
    <div
      ref={moduleRef}
      data-patch-module="true"
      data-module-id={props.id}
      style={{ width: MODULE_WIDTH, height: MODULE_HEIGHT, left: position.x, top: position.y }}
      onContextMenu={handleContextMenu}
      className="absolute m-4 flex flex-col bg-yellow-500 text-white rounded-3xl overflow-visible font-lexend z-10" 
      // Note: Changed overflow-hidden to overflow-visible so the menu doesn't get cut off!
    >
      
      {/* CONDITIONALLY RENDER THE MENU */}
      {menu && (
        <ModuleMenu 
          id={props.id} 
          x={menu.x} 
          y={menu.y}
          color="#eeaf00"
          onDelete={(id:string) => {console.log("Deleting", id);setMenu(null); }} 
        />
      )}

      {/* MODULE HEADER */}
      <div className="w-full bg-yellow-500 px-4 pt-2 cursor-move select-none text-center rounded-t-3xl" onMouseDown={onMouseDown}>
        <span className="text-white text-4xl leading-none">Distort</span>
      </div>
      
      {/* MAIN BODY */}
      <div className="mx-2 mt-2 mb-1.5 flex flex-1 flex-col gap-3 items-center rounded-2xl bg-black py-5 overflow-hidden">
        {/* ... (The rest of your knobs, waves, and ports stay exactly the same) ... */}
        
        {/* PARAMETER KNOB */}
        <KnobParam id={props.id} name="drive" side="left" color="yellow-500">
          <Knob max={100} min={0} step={1} value={amount} onChange={setAmount} size={100} unit="%" />
        </KnobParam>

        {/* WAVESHAPING */}
        <div className="my-2">
          <Wave value={waveshape} onChange={setWaveshape} />
        </div>

        {/* PORTS */}
        {/* <div className="mt-1"></div> */}
        <Param id={props.id} name="input" polarity="target" color="yellow-500"/>
        <Param id={props.id} name="output" polarity="source" color="yellow-500"/>
      </div>
    </div>
  );
}

export default Distortion;