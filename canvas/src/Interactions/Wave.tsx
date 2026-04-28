interface WaveProps {
  value: 'sine' | 'square' | 'triangle' | 'saw'
  onChange: (nextWave: 'sine' | 'square' | 'triangle' | 'saw') => void
}

function WaveIcon({ type }: { type: 'sine' | 'square' | 'triangle' | 'saw' }) {
  if (type === 'sine') {
    return (
      <svg viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-10 w-10">
        <path
          d="M57 193.48C61.6479 150.493 84.5896 129 125.825 129C187.678 129 195.16 272 269.08 272C330.771 272 343 201.978 343 193.48"
          stroke="currentColor"
          strokeOpacity="0.9"
          strokeWidth="18"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    )
  }

  if (type === 'square') {
    return (
      <svg viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5">
        <path d="M979,970H473V81H82V498H28V26H528V915H924V498H979" fill="currentColor" stroke="currentColor" strokeWidth="20" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  }

  if (type === 'triangle') {
    return (
      <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" className="h-7 w-7">
        <path d="M 143.26605504587155 80.63608562691131 Q 152.6605504587156 80.63608562691131 158.92354740061162 88.46483180428135 L 368.73394495412845 380.4770642201835 L 368.73394495412845 380.4770642201835 L 472.85626911314984 238.77675840978594 L 472.85626911314984 238.77675840978594 Q 483.8165137614679 225.4678899082569 498.69113149847095 234.86238532110093 Q 512 245.82262996941895 502.60550458715596 260.697247706422 L 383.6085626911315 423.53516819571865 L 383.6085626911315 423.53516819571865 Q 378.1284403669725 431.3639143730887 368.73394495412845 431.3639143730887 Q 359.3394495412844 431.3639143730887 353.0764525993884 423.53516819571865 L 143.26605504587155 131.52293577981652 L 143.26605504587155 131.52293577981652 L 39.14373088685015 273.22324159021406 L 39.14373088685015 273.22324159021406 Q 28.18348623853211 286.5321100917431 13.308868501529052 277.13761467889907 Q 0 266.177370030581 9.394495412844037 251.30275229357798 L 128.3914373088685 88.46483180428135 L 128.3914373088685 88.46483180428135 Q 133.87155963302752 80.63608562691131 143.26605504587155 80.63608562691131 L 143.26605504587155 80.63608562691131 Z" fill="currentColor" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg" className="h-6 w-6">
      <path d="M461,956V211L62,564L10,505L539,38V798L935,497L982,558" fill="currentColor" stroke="currentColor" strokeWidth="20" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function Wave({ value, onChange }: WaveProps) {
  const waveOptions: Array<'sine' | 'square' | 'triangle' | 'saw'> = ['sine', 'square', 'triangle', 'saw']

  return (
    <div className="flex justify-center">
      <div className="inline-flex">
        {waveOptions.map((wave, index) => {
          const isFirst = index === 0
          const isLast = index === waveOptions.length - 1

          return (
            <label key={wave} className="cursor-pointer">
              <input
                type="radio"
                name="wave"
                value={wave}
                checked={value === wave}
                onChange={() => onChange(wave)}
                className="peer absolute h-px w-px overflow-hidden whitespace-nowrap [clip:rect(0_0_0_0)] [clip-path:inset(100%)]"
              />
              <span
                className={`relative -ml-px flex h-10 w-12 cursor-pointer items-center justify-center border border-white bg-black text-white first:ml-0 peer-focus-visible:z-10 peer-focus-visible:outline-none peer-focus-visible:ring-2 peer-focus-visible:ring-white peer-checked:z-1 peer-checked:border-white peer-checked:bg-white peer-checked:text-black ${
                  isFirst ? 'ml-0 rounded-l-md' : ''
                } ${isLast ? 'rounded-r-md' : ''}`}
              >
                <span className="sr-only">{wave}</span>
                <WaveIcon type={wave} />
              </span>
            </label>
          )
        })}
      </div>
    </div>
  )
}

export default Wave