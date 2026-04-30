import { useRef, useState } from "react";
import Knob from "../Interactions/Knob";
import {RadioSelect, RadioSelectOption} from "../Interactions/RadioSelect";
import { useDrag } from "../Interactions/useDrag";
import { ModuleMenu } from '../Interactions/ContextMenu';
import { useContextMenu } from "../Utils/useContextMenu";
import { KnobParam, Param } from "../Interactions/Params";

function SineIcon() {
    return (
      <svg viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-10 w-10">
        <path
          d="M57 193.48C61.6479 150.493 84.5896 129 125.825 129C187.678 129 195.16 272 269.08 272C330.771 272 343 201.978 343 193.48" stroke="currentColor" strokeOpacity="0.9" strokeWidth="18" strokeLinecap="round" strokeLinejoin="round"
        />
      </svg>
    )
}
function SquareIcon() {
  return (
    <svg viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5">
      <path d="M979,970H473V81H82V498H28V26H528V915H924V498H979" fill="currentColor" stroke="currentColor" strokeWidth="20" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function TriangleIcon() {
  return (
    <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" className="h-7 w-7">
      <path d="M 143.26605504587155 80.63608562691131 Q 152.6605504587156 80.63608562691131 158.92354740061162 88.46483180428135 L 368.73394495412845 380.4770642201835 L 368.73394495412845 380.4770642201835 L 472.85626911314984 238.77675840978594 L 472.85626911314984 238.77675840978594 Q 483.8165137614679 225.4678899082569 498.69113149847095 234.86238532110093 Q 512 245.82262996941895 502.60550458715596 260.697247706422 L 383.6085626911315 423.53516819571865 L 383.6085626911315 423.53516819571865 Q 378.1284403669725 431.3639143730887 368.73394495412845 431.3639143730887 Q 359.3394495412844 431.3639143730887 353.0764525993884 423.53516819571865 L 143.26605504587155 131.52293577981652 L 143.26605504587155 131.52293577981652 L 39.14373088685015 273.22324159021406 L 39.14373088685015 273.22324159021406 Q 28.18348623853211 286.5321100917431 13.308868501529052 277.13761467889907 Q 0 266.177370030581 9.394495412844037 251.30275229357798 L 128.3914373088685 88.46483180428135 L 128.3914373088685 88.46483180428135 Q 133.87155963302752 80.63608562691131 143.26605504587155 80.63608562691131 L 143.26605504587155 80.63608562691131 Z" fill="currentColor" />
    </svg>
  )
}

function SawIcon() {
  return (
    <svg viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg" className="h-6 w-6">
      <path d="M461,956V211L62,564L10,505L539,38V798L935,497L982,558" fill="currentColor" stroke="currentColor" strokeWidth="20" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

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
      className="absolute m-4 flex flex-col bg-purple-500 text-white rounded-3xl overflow-visible font-lexend">
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
          <RadioSelect value={waveshape} onChange={setWaveshape}>
            <RadioSelectOption value="sine"><SineIcon /></RadioSelectOption>
            <RadioSelectOption value="triangle"><TriangleIcon /></RadioSelectOption>
            <RadioSelectOption value="square"><SquareIcon/></RadioSelectOption>
            <RadioSelectOption value="saw"><SawIcon /></RadioSelectOption>
          </RadioSelect>
        </div>
        <Param name="output" id={props.id} polarity="source" color="purple-500"/>
      </div>
    </div>
  );
}

export default LFO;