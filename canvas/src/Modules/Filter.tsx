import {useRef, useState } from "react";
import Knob from "../Interactions/Knob";
import {RadioSelect, RadioSelectOption} from "../Interactions/RadioSelect";
import { useDrag } from "../Interactions/useDrag";
import { ModuleMenu } from '../Interactions/ContextMenu';
import { useContextMenu } from "../Utils/useContextMenu";
import { Param, KnobParam } from "../Interactions/Params";

const MODULE_WIDTH = 224;
const MODULE_HEIGHT = 576;

function Lowpass() {
  return (
    <svg fill="currentColor" width="800px" height="800px" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
        <path d="M24.22 67.796a3.995 3.995 0 0 1 4.008-3.991h85.498c8.834 0 19.732 6.112 24.345 13.657l53.76 87.936c3.46 5.66 11.628 10.247 18.256 10.247h16.718a3.996 3.996 0 0 1 3.994 4.007v8.985a4.007 4.007 0 0 1-4.007 4.008h-24.7c-8.835 0-19.709-6.13-24.283-13.683l-52.324-86.4c-3.43-5.665-11.577-10.257-18.202-10.257H28.214a3.995 3.995 0 0 1-3.993-3.992V67.796z" fill-rule="evenodd"/>
    </svg> 
  )
}

function Highpass() {
  return (
    <svg fill="currentColor" width="800px" height="800px" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
        <path d="M231.007 68.729c0-2.206-1.787-4.995-4.007-4.995h-85.499c-6.466 0-19.531 7.705-22.66 15.97l-55.92 85.647c-3.624 5.55-11.93 10.05-18.559 10.05H28.167c-2.206 0-3.994 2.787-3.994 5.007v8.985a4.005 4.005 0 0 0 3.998 4.007h22.713c8.832 0 20.495-8.703 23.588-16.987l56.167-84.189c3.68-5.517 12.04-9.99 18.668-9.99h77.695c2.212 0 4.005-2.797 4.005-4.994v-8.51z" fill-rule="evenodd"/>
    </svg>
  )
}

function Bandpass() {
  return (
    <svg fill="currentColor" width="800px" height="800px" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
        <path d="M25.344 180.07a4.008 4.008 0 0 1 3.997-4.01h16.996c6.631 0 14.517-4.753 17.611-10.614l47.246-89.476c9.282-17.579 24.376-17.602 33.72-.042l47.637 89.532c3.115 5.855 11.007 10.6 17.65 10.6h16.489a4.01 4.01 0 0 1 4.001 4.01v8.809c0 2.214-1.8 4.009-4.007 4.009h-24.49c-8.838 0-19.361-6.32-23.513-14.133L136.446 99.28c-4.665-8.778-12.228-8.772-16.887 0l-42.21 79.475c-4.145 7.805-14.667 14.133-23.508 14.133h-24.49a4.012 4.012 0 0 1-4.007-4.01v-8.808z" fill-rule="evenodd"/>
    </svg>
  )
}

function Notch() {
  return (
    <svg fill="currentColor" width="800px" height="800px" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
      <path d="M25.101 77.628a4.008 4.008 0 0 0 3.997 4.01h16.996c6.632 0 13.927 5.01 16.3 11.202l52.724 85.231c7.115 18.564 18.693 18.571 25.857.025L193.91 92.84c2.39-6.187 9.693-11.202 16.336-11.202h16.49a4.01 4.01 0 0 0 4-4.01V68.82a4 4 0 0 0-3.994-4.009h-23.508c-8.835 0-18.547 6.702-21.69 14.962l-47.147 73.852c-3.533 9.287-9.217 9.262-12.694-.051L75.2 79.805C72.108 71.524 62.44 64.81 53.6 64.81H29.11a4.012 4.012 0 0 0-4.008 4.01v8.808z" fill-rule="evenodd"/>
    </svg>
  )
}
function Filter(props: {
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
      className="absolute m-4 flex flex-col bg-orange-500 text-white rounded-3xl overflow-visible font-lexend"
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
          <RadioSelect value={filterType} onChange={setFilterType}>
            <RadioSelectOption value="lowpass"><Lowpass /></RadioSelectOption>
            <RadioSelectOption value="highpass"><Highpass/></RadioSelectOption>
            <RadioSelectOption value="bandpass"><Bandpass /></RadioSelectOption>
            <RadioSelectOption value="notch"><Notch /></RadioSelectOption>
          </RadioSelect>
          </div>

          {/* PORTS: Input and Output buttons sized equally */}
          <Param id={props.id} name="input" polarity="target" color="orange-500"/>
          <Param id={props.id} name="output" polarity="source" color="orange-500"/>
        </div>
    </div>
  );
}

export default Filter;