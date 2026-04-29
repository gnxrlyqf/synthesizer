import { useRef, useState } from "react";
import Knob from "../Interactions/Knob";
import Wave from "../Interactions/Wave";
import { useDrag } from "../Interactions/useDrag";
import { ModuleMenu } from '../Interactions/ContextMenu';
import { useContextMenu } from "../Utils/useContextMenu";
import { KnobParam, Param } from "../Interactions/Params";

const MODULE_WIDTH = 224;
const MODULE_HEIGHT = 416;
const FRAME_INSET_X = 6;
const FRAME_INSET_TOP = 8;
const FRAME_INSET_BOTTOM = 6;

function LFO(props: {
  id: string, x: number, y: number,
  f: number, w: "sine" | "square" | "triangle" | "saw", s: boolean,
  cameraX: number, cameraY: number
}) {

  const panelStyle = {
    marginLeft: `${FRAME_INSET_X}px`,
    marginRight: `${FRAME_INSET_X}px`,
    marginTop: `${FRAME_INSET_TOP}px`,
    marginBottom: `${FRAME_INSET_BOTTOM}px`,
  };

  const moduleRef = useRef<HTMLDivElement | null>(null);
  const [position, setPosition] = useState({x: props.x, y: props.y});
  const [frequency, setFrequency] = useState(props.f);
  const [waveshape, setWaveshape] = useState<'sine' | 'square' | 'triangle' | 'saw'>('sine');
  const [isSynced, setIsSynced] = useState(false);
  const { menu, setMenu, handleContextMenu } = useContextMenu();
  // Common move logic would be extracted in a real build, kept here for consistency
  const onMouseDown = useDrag(props, position, setPosition, moduleRef);

  return (
    <div ref={moduleRef}
      data-patch-module="true"
      data-module-id={props.id}
      style={{width: MODULE_WIDTH, height: MODULE_HEIGHT, left: position.x, top: position.y}}
      onContextMenu={handleContextMenu}
      className="absolute m-4 flex flex-col bg-purple-500 text-white rounded-3xl overflow-hidden font-lexend">
      {menu && (
      <ModuleMenu 
        id={props.id} 
        x={menu.x} 
        y={menu.y}
        color="#ae53ff"
        onDelete={(id: string) => { console.log("Deleting", id); setMenu(null); }} 
      />
    )}
      <div
        className="w-full bg-purple-500 px-4 pt-2 cursor-move select-none text-center"
        onMouseDown={onMouseDown}
      >
        <span className="text-white text-4xl leading-none">LFO</span>
      </div>
      <div
        style={panelStyle}
        className="flex flex-1 min-h-0 flex-col gap-3 items-center rounded-2xl bg-black py-3"
      >
        <div className="flex gap-2 bg-purple-900/50 p-1 rounded-lg">
          <button onClick={() => setIsSynced(false)} className={`px-3 py-1 rounded-md cursor-pointer text-xs ${!isSynced ? 'bg-purple-500' : ''}`}>FREE</button>
          <button onClick={() => setIsSynced(true)} className={`px-3 py-1 rounded-md cursor-pointer text-xs ${isSynced ? 'bg-purple-500' : ''}`}>SYNC</button>
        </div>
        <div className="w-full flex items-center">
          <span className="h-1 bg-purple-500 flex-1" />
          <KnobParam id={props.id} name={isSynced ? "sync" : "freq" } side="left" color="purple-500">
            <Knob max={isSynced ? 32 : 20} min={isSynced ? 1 : 0.1} step={0.1} value={frequency} onChange={setFrequency} size={100} unit={isSynced ? "Div" : "Hz"} />
          </KnobParam>
          <span className="flex-1" />
        </div>
        <div className="mt-0">
          <Wave value={waveshape} onChange={setWaveshape} />
        </div>
        <Param name="output" id={props.id} polarity="source" color="purple-500"/>
      </div>
    </div>
  );
}

export default LFO;