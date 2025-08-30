"use client"

import { createContext, useContext } from "react"

export type PupilType = Record<string, unknown> | null
export const PupilContext = createContext<{ pupil: PupilType }>({ pupil: null })
export function usePupil() {
  return useContext(PupilContext)
}

export default PupilContext
