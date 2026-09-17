import gsap from 'gsap'
import { CustomEase } from 'gsap/CustomEase'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger, SplitText, CustomEase, useGSAP)

CustomEase.create('arva', '0.76, 0, 0.24, 1')
CustomEase.create('arvaOut', '0.16, 1, 0.3, 1')

gsap.defaults({ ease: 'arvaOut', duration: 1 })
ScrollTrigger.config({ ignoreMobileResize: true })

export const MOTION_OK = '(prefers-reduced-motion: no-preference)'
export const DESKTOP = '(min-width: 768px) and (prefers-reduced-motion: no-preference)'

export { gsap, ScrollTrigger, SplitText, useGSAP }

// Dev aid: append ?slowmo to the URL to inspect animations at 1/6 speed.
if (import.meta.env.DEV && new URLSearchParams(location.search).has('slowmo')) gsap.globalTimeline.timeScale(1 / 6)
