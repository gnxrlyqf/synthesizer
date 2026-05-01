import { useConnection } from "../ConnectionContext";
import React from "react";

function KnobParam(props: {id: string; name: string; side: "left" | "right"; color: string; children: React.ReactNode}) {
	const {mode, id, selectTarget, isPortConnected} = useConnection();
	const accentStyle = { backgroundColor: props.color };
	const borderStyle = { borderColor: props.color };
	const portId = `${props.id}.${props.name}`;
	const isConnected = isPortConnected(portId);
	const childrenWithDisabled = React.Children.map(props.children, (child) => {
		if (!React.isValidElement<{ disabled?: boolean }>(child)) return child;
		const existingDisabled = Boolean(child.props.disabled);
		return React.cloneElement(child, { disabled: isConnected || existingDisabled });
	});

  // Highlight state for the button only
  const [btnHighlight, setBtnHighlight] = React.useState(false);
	const [divHighlight, setDivHighlight] = React.useState(false);
  return (
	<>
	  <div className="w-full flex items-center">
		{props.side == "left" &&
		  <span
			data-port-id={`${props.id}.${props.name}`}
			data-port-side="left"
			className="h-1 flex-1"
			style={accentStyle}
		  />
		}
		{props.side == "right" && <span className="flex-1" />}
		<div
		  className="px-3 py-1 rounded-xl border-[3px] flex flex-col items-center gap-1 transition-colors duration-200 ease-in-out"
		  style={{
		    ...borderStyle,
		    transition: 'background 0.2s ease-in-out, color 0.2s ease-in-out',
		    background: (divHighlight || isConnected) ? props.color : undefined
		  }}
		  onMouseEnter={() => setDivHighlight(true)}
		  onMouseLeave={() => setDivHighlight(false)}
		>
		  <button
		    className={`text-md uppercase tracking-wide ${mode == "selecting-target" || id == props.id || isConnected ? "text-gray-500 cursor-not-allowed border-gray-400" : "text-white cursor-pointer"}`}
		    onClick={() => {
		      if (!isConnected) selectTarget(props.id, props.name);
		    }}
		    disabled={mode == "selecting-target" || id == props.id || isConnected}
		    style={{ transition: 'color 0.2s ease-in-out', color: (btnHighlight || isConnected) ? '#000' : undefined }}
		    onMouseEnter={() => setBtnHighlight(true)}
		    onMouseLeave={() => setBtnHighlight(false)}
		  >
			{props.name}
		  </button>
		  {childrenWithDisabled}
		</div>
		{props.side == "left" && <span className="flex-1" />}
		{props.side == "right" &&
		  <span
			data-port-id={`${props.id}.${props.name}`}
			data-port-side="right"
			className="h-1 flex-1"
			style={accentStyle}
		  />
		}
	  </div>
	</>
  )
}

function Param(props: {id: string; name: string; polarity: "target" | "source"; color: string}) {
	const {mode, id, selectSource, selectTarget, isPortConnected} = useConnection();
  const type = props.polarity == "source" ? "selecting-source" : "selecting-target";
	const accentStyle = { backgroundColor: props.color };
	const borderStyle = { borderColor: props.color };
	const portId = `${props.id}.${props.name}`;
	const isConnected = isPortConnected(portId);

  // Highlight state for the button only
  const [btnHighlight, setBtnHighlight] = React.useState(false);
	const [divHighlight, setDivHighlight] = React.useState(false);
  return (
	<>
	  <div className="w-full flex items-center">
		{props.polarity == "target" &&
		  <span
			data-port-id={`${props.id}.${props.name}`}
			data-port-side="left"
			className="h-1 flex-1"
			style={accentStyle}
		  />
		}
		{props.polarity == "source" && <span className="flex-1" />}
		<div
		  className="px-4 py-2 rounded-xl border-[3px] flex items-center transition-colors duration-200 ease-in-out"
		  style={{
		    ...borderStyle,
		    transition: 'background 0.2s ease-in-out, color 0.2s ease-in-out',
		    background: (divHighlight || isConnected) ? props.color : undefined
		  }}
		  onMouseEnter={() => setDivHighlight(true)}
		  onMouseLeave={() => setDivHighlight(false)}
		>
		  <button
		    onClick={() => {
		      if (isConnected) return;
		      if (props.polarity == "target")
		        selectTarget(props.id, props.name)
		      if (props.polarity == "source")
		        selectSource(props.id, props.name)
		    }}
		    disabled={mode == type || id == props.id || isConnected}
		    className={`text-xl uppercase tracking-wide leading-none transition-colors duration-200 ease-in-out ${mode == type || id == props.id || isConnected ? "text-gray-500 cursor-not-allowed border-gray-400" : "text-white cursor-pointer"}`}
		    style={{
		      transition: 'background 0.2s ease-in-out, color 0.2s ease-in-out',
		      color: (btnHighlight || isConnected) ? '#000' : undefined,
		      background: btnHighlight ? props.color : undefined
		    }}
		    onMouseEnter={() => setBtnHighlight(true)}
		    onMouseLeave={() => setBtnHighlight(false)}
		  >
		    {props.name}
		  </button>
		</div>
		{props.polarity == "source" &&
		  <span
			data-port-id={`${props.id}.${props.name}`}
			data-port-side="right"
			className="h-1 flex-1"
			style={accentStyle}
		  />
		}
		{props.polarity == "target" && <span className="flex-1" />}
	  </div>
	</>
  )
}

export {KnobParam, Param};