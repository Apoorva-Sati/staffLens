import React from 'react'

const ChartImage = () => {
  return (
<div className="w-28 h-10 rounded-md relative overflow-hidden">
  <svg viewBox="0 0 120 60" className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
    
    {/* Area fill */}
    <path
      d="M0 45 C10 40, 20 20, 30 28 C40 35, 50 10, 60 20 C70 30, 80 40, 90 18 C100 8, 110 25, 120 10 L120 60 L0 60 Z"
      fill="rgba(237,28,36,0.15)"
    />

    {/* Line */}
    <path
      d="M0 45 C10 40, 20 20, 30 28 C40 35, 50 10, 60 20 C70 30, 80 40, 90 18 C100 8, 110 25, 120 10"
      fill="none"
      stroke="var(--primary)"
      strokeWidth="2.5"
      strokeLinecap="round"
    />

  </svg>
</div>
  )
}

export default ChartImage
