import { usePlane } from '@react-three/cannon'

const Ground = ({ args = [100, 100] } = {}) => {
  const [ref] = usePlane(() => ({ rotation: [-Math.PI / 2, 0, 0] }))

  return null
  // return (
  //   <mesh ref={ref} receiveShadow>
  //     <planeBufferGeometry attach="geometry" args={args} />
  //     <meshStandardMaterial color="#f5f5f5" attach="material" />
  //   </mesh>
  // )
}

export default Ground

