import create from 'zustand'
import produce from 'immer'

export const useStore = create((set) => {
  const setState = (fn) => set(produce(fn))

  const initialState = {
    player: {
      enabled: true,
    },
    movement: {
      forward: false,
      backward: false,
      left: false,
      right: false,
      jump: false,
    },
  }

  return {
    state: initialState,
    actions: {
      // game
      reset: () => {
        set({ state: { ...initialState } })
      },
      init: () => {
        setState(({ state }) => {
          state.game.mouse = true
          state.game.muted = false
        })
      },
      onMove: (direction, value) => {
        setState(({ state }) => {
          state.movement[direction] = value
        })
      },
    },
  }
})
