import { useEffect, useRef, useState } from "react";
import Knob from "../Interactions/Knob";
import {useDrag} from "../Interactions/useDrag";
import { KnobParam, Param } from "../Interactions/Params";
import type { ModuleProps } from "./Modules";
import { ModuleMenu } from '../Interactions/ContextMenu';
import { useContextMenu } from "../Utils/useContextMenu";

const MODULE_WIDTH = 224;
const MODULE_HEIGHT = 800;
const FRAME_INSET_X = 6;
const FRAME_INSET_TOP = 8;
const FRAME_INSET_BOTTOM = 6;

interface EnvelopeProps extends ModuleProps {
  a: number;
  d: number;
  s: number;
  r: number;
}

function Envelope(props: EnvelopeProps) {
  const moduleRef = useRef<HTMLDivElement | null>(null);
  const [position, setPosition] = useState<{ x: number; y: number }>({x: props.x, y: props.y});

  const [attack, setAttack] = useState(props.a);
  const [decay, setDecay] = useState(props.d);
  const [sustain, setSustain] = useState(props.s);
  const [release, setRelease] = useState(props.r);
  const { menu, setMenu, handleContextMenu } = useContextMenu();

  const moduleStyle = {
    width: `${MODULE_WIDTH}px`,
    height: `${MODULE_HEIGHT}px`,
    ...(position ? { left: `${position.x}px`, top: `${position.y}px` } : {}),
  };

  const panelStyle = {
    marginLeft: `${FRAME_INSET_X}px`,
    marginRight: `${FRAME_INSET_X}px`,
    marginTop: `${FRAME_INSET_TOP}px`,
    marginBottom: `${FRAME_INSET_BOTTOM}px`,
  };

  useEffect(() => {
    if (!moduleRef.current || position) {
      return;
    }

    const rect = moduleRef.current.getBoundingClientRect();
    setPosition({ x: rect.left + window.scrollX, y: rect.top + window.scrollY });
  }, [position]);

  const onMouseDown = useDrag(props, position, setPosition, moduleRef);

  return (
    <div
      ref={moduleRef}
      data-patch-module="true"
      data-module-id={props.id}
      style={moduleStyle}
      onMouseDown={onMouseDown}
      onContextMenu={handleContextMenu}
      className="
        absolute
        m-4
        top-1/5 left-1/4
        flex flex-col
        bg-green-500
        text-white
        rounded-3xl
        overflow-visible
        font-lexend
      "
    >
      {menu && (
        <ModuleMenu 
          id={props.id} 
          x={menu.x} 
          y={menu.y}
          color="#00c658"
          onDelete={(id:string) => {console.log("Deleting", id);setMenu(null); }} 
        />
      )}
      <div
        className="w-full bg-green-500 px-4 pt-2 cursor-move select-none text-center"
      >
        <span className="text-white text-4xl leading-none">Envelope</span>
      </div>
      <div
        style={panelStyle}
        className="flex flex-1 min-h-0 flex-col gap-3 items-center rounded-2xl bg-black py-5"
      >
        <div className="flex flex-row w-full">
          <div className="w-full flex flex-col gap-3">
            <KnobParam id={props.id} name="attack" side="left" color="green-500">
              <Knob max={1000} min={0} step={1} value={attack} onChange={setAttack} size={70} unit="ms" />
            </KnobParam>
            <KnobParam id={props.id} name="decay" side="left" color="green-500">
              <Knob max={1000} min={0} step={1} value={decay} onChange={setDecay} size={70} unit="ms" />
            </KnobParam>
            <KnobParam id={props.id} name="sustain" side="left" color="green-500">
              <Knob max={10} min={0} step={1} value={sustain} onChange={setSustain} size={70} unit="dB" />
            </KnobParam>
            <KnobParam id={props.id} name="release" side="left" color="green-500">
              <Knob max={1000} min={0} step={1} value={release} onChange={setRelease} size={70} unit="ms" />
            </KnobParam>
          </div> 
        </div>
        <Param id={props.id} name="trigger" polarity="target" color="green-500"/>
        <Param id={props.id} name="output" polarity="source" color="green-500"/>
      </div>
    </div>
  );
}
export const ENV_W = MODULE_WIDTH;
export const ENV_H = MODULE_HEIGHT;
export default Envelope;