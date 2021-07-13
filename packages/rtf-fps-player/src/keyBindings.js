import MovementActions from './movementActions'

const keyBindings = {
  "KeyW": MovementActions.FORWARD,
  "KeyS": MovementActions.BACKWARD,
  "KeyA": MovementActions.LEFT,
  "KeyD": MovementActions.RIGHT,
  "Space": MovementActions.JUMP,
}

export default keyBindings
