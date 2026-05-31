function Spinner({ className = "" }) {
  return (
    <svg
      role="status"
      aria-label="Loading"
      className={`w-6 h-6 animate-spin ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
        opacity="0.25"
      />

      <path
        fill="currentColor"
        opacity="0.75"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      />
    </svg>
  );
}

export default Spinner;