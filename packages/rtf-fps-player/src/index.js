import Player from "./Player";
import KeyBindings from "./keyBindings";
import MovementActions from "./movementActions";
import { useStore } from "./store";

Object.assign(Player, { KeyBindings, MovementActions, useStore });

export default Player;
