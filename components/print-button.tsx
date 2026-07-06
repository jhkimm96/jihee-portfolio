'use client'

export function PrintButton() {
  return (
    <button type="button" className="no-print" onClick={() => window.print()}>
      PDF로 저장
    </button>
  )
}
