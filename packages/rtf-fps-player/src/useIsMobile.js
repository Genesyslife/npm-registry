import { useEffect, useState } from 'react'
import { isMobile as isMobileDetect } from 'react-device-detect'

const useIsMobile = () => {
  const [isMobile, setMobile] = useState(false)

  useEffect(() => {
    setMobile(isMobileDetect)
  }, [])

  return isMobile
}

export default useIsMobile
