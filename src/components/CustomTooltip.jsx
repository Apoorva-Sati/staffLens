import React from 'react'

const CustomTooltip = ({
  active,
  payload,
  label,

  className = '',

  title,
  items = [],

  // optional formatter
  formatter,
}) => {
  if (!active || !payload || !payload.length) return null

  // full chart row data
  const data = payload[0]?.payload || {}

  // title fallback
  const tooltipTitle =
    typeof title === 'function'
      ? title(data, label, payload)
      : title || label

  return (
    <div
      className={`
        rounded-lg border border-(--border)
        bg-(--card-bg)
        px-4 py-3 shadow-md
        ${className}
      `}
    >
      {/* Title */}
      {tooltipTitle && (
        <p className="mb-2 text-sm font-bold text-(--text-main)">
          {tooltipTitle}
        </p>
      )}

      {/* Custom formatter */}
      {formatter ? (
        formatter(data, payload, label)
      ) : (
        <div className="space-y-1">
          {items.map((item, index) => {
            const value =
              typeof item.value === 'function'
                ? item.value(data, payload, label)
                : data[item.value]

            return (
              <p
                key={index}
                className="text-sm text-(--text-secondary)"
              >
                {item.label}:{' '}
                <strong className="text-(--primary)">
                  {value}
                </strong>
              </p>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default CustomTooltip