import React, { useEffect, useRef, useState } from 'react'

const MultiSelectDropdown = ({
  label,
  options = [],
  selected = [],
  onChange,
}) => {

  const [open, setOpen] = useState(false)

  const ref = useRef(null)

  // ---------------- CLOSE ON OUTSIDE CLICK ----------------
  useEffect(() => {

    const handleClickOutside = (e) => {

      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false)
      }

    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }

  }, [])

  // ---------------- TOGGLE OPTION ----------------
  const toggleOption = (option) => {

    const exists = selected.includes(option)

    const updated = exists
      ? selected.filter((item) => item !== option)
      : [...selected, option]

    onChange(updated)
  }

  return (

    <div className="relative w-36 shrink-0" ref={ref}>

      {/* TRIGGER BUTTON */}
      <button
        onClick={() => setOpen(o => !o)}
        className="
          w-full
          flex items-center justify-between gap-1.5
          px-3 py-1.5
          rounded-full
          text-[13px]
          cursor-pointer
          bg-(--card-bg)
          text-(--text-secondary)
          border border-(--border)
          whitespace-nowrap overflow-hidden
        "
      >

        <span className="truncate">
          {selected.length === 0
            ? label
            : selected.length === 1
              ? selected[0]
              : `${selected[0]} +${selected.length - 1}`
          }
        </span>

        <svg
          className={`shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>

      </button>

      {open && (
        <>

          {/* BACKDROP */}
          <div
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-10"
          />

          {/* MENU */}
          <div
            className="
    absolute top-[calc(100%+6px)] left-0
    z-20
    min-w-52
    max-h-72
    overflow-y-auto
    rounded-xl
    border border-(--border)
    bg-(--card-bg)
    shadow-(--shadow)
    p-1.5
    flex flex-col gap-1
  "
          >

            {options.map((option) => {

              const checked = selected.includes(option)

              return (

                <button
                  key={option}
                  onClick={() => toggleOption(option)}
                  className={`
                    w-full
                    flex items-center justify-between
                    gap-3
                    text-left
                    px-3 py-2
                    rounded-lg
                    border-none
                    cursor-pointer
                    text-[13px]
                    transition-colors duration-150
                    ${checked
                      ? 'bg-(--primary-dark) text-white'
                      : 'bg-transparent text-(--text-secondary) hover:bg-(--hover-bg)'
                    }
                  `}
                >

                  <span className="truncate">
                    {option}
                  </span>

                  {checked && (
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="shrink-0"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}

                </button>

              )
            })}

          </div>

        </>
      )}

    </div>
  )
}

export default MultiSelectDropdown