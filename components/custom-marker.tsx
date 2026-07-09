import { memo } from 'react'

const ICON = `M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z`

function CustomMarker({ color }: { color?: string }): React.ReactElement {
  return (
    <svg height={30} viewBox='0 0 384 512' style={{ cursor: 'pointer', fill: color ?? '#DBA726' }}>
      <path d={ICON} />
    </svg>
  )
}
export default memo(CustomMarker)
