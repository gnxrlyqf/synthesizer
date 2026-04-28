import { useConnection } from "../ConnectionContext";

function KnobParam(props: {id: string; name: string; side: "left" | "right"; color: string; children: React.ReactNode}) {
  const {mode, id, selectTarget} = useConnection();
  const border = `border-${props.color}`;
  const bg = `bg-${props.color}`;

  return (
	<>
	  <div className="w-full flex items-center">
		{props.side == "left" &&
		  <span
			data-port-id={`${props.id}.${props.name}`}
			data-port-side="left"
			className={`h-1 ${bg} flex-1`}
		  />
		}
		{props.side == "right" && <span className="flex-1" />}
		<div className={`px-3 py-1 rounded-xl border-2 ${border} flex flex-col items-center gap-1`}>
		  <button
		  className={`text-md uppercase tracking-wide ${mode == "selecting-source" || id == props.id ? "text-gray-500 cursor-not-allowed border-gray-400" : "text-white cursor-pointer"}`}
		  onClick={() => selectTarget(props.id, props.name)}
		  >
			{props.name}
		  </button>
		  {props.children}
		</div>
		{props.side == "left" && <span className="flex-1" />}
		{props.side == "right" &&
		  <span
			data-port-id={`${props.id}.${props.name}`}
			data-port-side="left"
			className={`h-1 ${bg} flex-1`}
		  />
		}
	  </div>
	</>
  )
}

function Param(props: {id: string; name: string; polarity: "target" | "source"; color: string}) {
  const {mode, id, selectSource, selectTarget} = useConnection();
  const type = props.polarity == "source" ? "selecting-source" : "selecting-target";
  const border = `border-${props.color}`;
  const bg = `bg-${props.color}`;

  return (
	<>
	  <div className="w-full flex items-center">
		{props.polarity == "target" &&
		  <span
			data-port-id={`${props.id}.${props.name}`}
			data-port-side="left"
			className={`h-1 ${bg} flex-1`}
		  />
		}
		{props.polarity == "source" && <span className="flex-1" />}
		<button
		  onClick={() => {
			if (props.polarity == "target")
			  selectTarget(props.id, props.name)
			if (props.polarity == "source")
			  selectSource(props.id, props.name)
		  }}
		  disabled={mode == type || id == props.id}
		  className={`px-4 py-2 rounded-xl border-2 ${border} text-xl uppercase tracking-wide leading-none ${mode == type || id == props.id? "text-gray-500 cursor-not-allowed border-gray-400" : "text-white cursor-pointer"}`}
		>
		  {props.name}
		</button>
		{props.polarity == "source" &&
		  <span
			data-port-id={`${props.id}.${props.name}`}
			data-port-side="right"
			className={`h-1 ${bg} flex-1`}
		  />
		}
		{props.polarity == "target" && <span className="flex-1" />}
	  </div>
	</>
  )
}

export {KnobParam, Param};