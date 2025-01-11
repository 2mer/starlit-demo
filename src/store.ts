import { create } from "zustand";
import { Phase, PhaseOrder } from "./Phase";
import { Vector3 } from "three";

export interface Store {
	phase: Phase,
	nextPhase: () => void,
	prevPhase: () => void,
	location: Vector3 | undefined,
	setLocation: (v: Vector3 | undefined) => void,
	pod: string,
	setPod: (v: string) => void,
	date: Date,
	setDate: (v: Date) => void,
	sun: number,
	setSun: (v: number) => void,
}

export const useStore = create<Store>()((set) => ({
	phase: Phase.POD,
	nextPhase: () => {
		set((prev: any) => ({ phase: PhaseOrder[PhaseOrder.indexOf(prev.phase) + 1] }))
	},
	prevPhase: () => {
		set((prev: any) => ({ phase: PhaseOrder[PhaseOrder.indexOf(prev.phase) - 1] }))
	},

	location: undefined,
	setLocation: (location: Vector3 | undefined) => set({ location }),

	pod: '',
	setPod: (p: string) => set({ pod: p }),

	date: new Date(),
	setDate: (d: Date) => set({ date: d }),

	sun: 0,
	setSun: (s: number) => set({ sun: s }),
}))