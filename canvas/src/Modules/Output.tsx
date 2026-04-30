import { useEffect, useRef, useState } from "react";
import Knob from "../Interactions/Knob";
import { type ModuleProps } from "./Modules";
import {useDrag} from "../Interactions/useDrag";
import { KnobParam, Param } from "../Interactions/Params";
import { ModuleMenu } from '../Interactions/ContextMenu';
import { useContextMenu } from "../Utils/useContextMenu";

const MODULE_WIDTH = 224;
const MODULE_HEIGHT = 352;
const FRAME_INSET_X = 6;
const FRAME_INSET_TOP = 8;
const FRAME_INSET_BOTTOM = 6;

interface OutputProps extends ModuleProps { m: number; }

function Output(props: OutputProps) {
  const moduleRef = useRef<HTMLDivElement | null>(null);
  const [position, setPosition] = useState<{ x: number; y: number }>({x: props.x, y: props.y});
  const [master, setMaster] = useState(props.m);
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
    if (!moduleRef.current || position) return;

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
      onContextMenu={handleContextMenu}
      className="
        absolute
        m-4
        top-1/6 left-2/3
        flex flex-col
        bg-slate-500
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
          color="#63748d"
          onDelete={(id:string) => {console.log("Deleting", id);setMenu(null);}} 
        />
      )}
      <div
        className="w-full bg-slate-500 px-4 pt-2 cursor-move select-none text-center"
        onMouseDown={onMouseDown}
      >
        
        <span className="text-white text-4xl leading-none">Output</span>
      </div>
      <div
        style={panelStyle}
        className="flex flex-1 min-h-0 flex-col gap-6 items-center rounded-2xl bg-black py-5"
      >
        <KnobParam id={props.id} name="master" side="left" color="slate-500">
          <Knob max={0} min={-30} step={0.1} value={master} onChange={setMaster} size={100} unit="dB" />
        </KnobParam>
        <Param id={props.id} name="input" polarity="target" color="slate-500"/>
      </div>
    </div>
  );
}
export const OUT_W = MODULE_WIDTH;
export const OUT_H = MODULE_HEIGHT;
export default Output;