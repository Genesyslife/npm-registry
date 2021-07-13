import { useEffect, useRef } from 'react'
import { useSphere } from '@react-three/cannon'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import CameraControls from 'camera-controls'
import KeyBindings from './keyBindings'
import useIsMobile from './useIsMobile'
import { useStore } from './store'

CameraControls.install({ THREE })

const { Vector3 } = THREE

function Player() {
  const [isLock, setLock] = useState(false)
  const { onMove } = useStore((store) => store.actions)
  const { movement, activeMedia } = useStore((store) => store.state)
  const { camera, gl } = useThree()
  const currentVelocity = useRef([0, 0, 0])
  const touchCamera = useRef(null)
  const isMobile = useIsMobile()

  /**
   * Init touch camera on mobile
   **/
  useEffect(() => {
    if (!isMobile) return
    if (touchCamera.current) return

    touchCamera.current = new CameraControls(camera, gl.domElement)
  }, [isMobile, touchCamera, camera, gl.domElement])

  const [ref, api] = useSphere(() => ({
    mass: 1,
    position: config.player.initialPos,
    args: config.player.radius,
  }))

  /**
   * Update player velocity
   **/
  useEffect(
    () => {
      api.velocity.subscribe(
        (newVelocity) => (currentVelocity.current = newVelocity)
      )
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  /**
   * Keyboard controls
   **/
  useEffect(() => {
    const onKeyDown = (event) => {
      const action = KeyBindings[event.code]
      if (action) onMove(action, true)
    }

    const onKeyUp = (event) => {
      const action = KeyBindings[event.code]
      if (action) onMove(action, false)
    }

    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('keyup', onKeyUp)

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('keyup', onKeyUp)
    }
  }, [])

  /**
   * Mouse controls
   **/
  useEffect(() => {
    camera.rotation.order = 'YXZ'

    const onMouseMove = (e) => {
      if (!isLock) return

      const scale = -0.005
      camera.rotation.y += e.movementX * scale

      const newX = camera.rotation.x + e.movementY * scale
      const isTooHighOrTooLow = Math.abs(newX) > Math.PI / 2 - 0.05
      if (!isTooHighOrTooLow) camera.rotation.x = newX

      camera.rotation.z = 0
    }

    window.addEventListener('mousemove', onMouseMove)

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
    }
  }, [isLock])

  /**
   * Pointer Lock
   **/
  useEffect(() => {
    const onClick = () => {
      gl.domElement.requestPointerLock()
    }

    const onPointerLockChange = () => {
      const isLock =
        gl.domElement.ownerDocument.pointerLockElement === gl.domElement
      setLock(isLock)
    }

    window.addEventListener('click', onClick)
    gl.domElement.ownerDocument.addEventListener(
      'pointerlockchange',
      onPointerLockChange
    )
    // gl.domElement.ownerDocument.addEventListener(
    //   'mozpointerlockchange',
    //   onPointerLockChange
    // )

    return () => {
      window.removeEventListener('click', onClick)
      gl.domElement.ownerDocument.removeEventListener(
        'pointerlockchange',
        onPointerLockChange
      )
      // gl.domElement.ownerDocument.removeEventListener(
      //   'mozpointerlockchange',
      //   onPointerLockChange
      // )
    }
  }, [gl.domElement])

  /**
   * Player movement and update camera
   **/
  useFrame((state, delta) => {
    if (activeMedia) {
      api.velocity.set(0, 0, 0)
      return
    }

    if (touchCamera.current) touchCamera.current.update(delta)
    camera.position.copy(ref.current.position)
    camera.position.y = config.player.height

    const frontVector = new Vector3(
      0,
      0,
      (movement.backward ? 1 : 0) - (movement.forward ? 1 : 0)
    )
    const sideVector = new Vector3(
      (movement.left ? 1 : 0) - (movement.right ? 1 : 0),
      0,
      0
    )

    const newVelocity = new Vector3()
      .subVectors(frontVector, sideVector)
      .normalize()
      .multiplyScalar(config.player.speed)
      .applyEuler(camera.rotation)

    // api.velocity.set(
    //   newVelocity.x,
    //   movement.jump ? 2 : currentVelocity.current[1],
    //   newVelocity.z
    // )
    api.velocity.set(newVelocity.x, currentVelocity.current[1], newVelocity.z)
  })

  return <mesh ref={ref} />
}

export default Player
