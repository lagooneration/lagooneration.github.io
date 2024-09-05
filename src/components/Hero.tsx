import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { heroVideo, smallHeroVideo } from '../utils/index.ts';
import { useEffect, useState } from 'react';
import { Brain } from '../components/brain/brain.tsx';
import { Button } from './ui/Button.tsx';
// import Experience from './Experience.tsx';

const Hero = () => {
  const [videoSrc, setVideoSrc] = useState(window.innerWidth < 760 ? smallHeroVideo : heroVideo)

  const handleVideoSrcSet = () => {
    if(window.innerWidth < 760) {
      setVideoSrc(smallHeroVideo)
    } else {
      setVideoSrc(heroVideo)
    }
  }

  useEffect(() => {
    window.addEventListener('resize', handleVideoSrcSet);

    return () => {
      window.removeEventListener('reisze', handleVideoSrcSet)
    }
  }, [])

  useGSAP(() => {
    gsap.to('#hero', { opacity: 1, delay: 2 })
    gsap.to('#cta', { opacity: 1, y: -50, delay: 2 })
  }, [])

  return (
    <>
    
    <section className="w-full nav-height bg-transparent relative">
      
      <div className="h-5/6 w-full flex flex-start flex-col mt-[100px]">
        <p id="hero" className="hero-title z-1">The <br /> Cocktail Party Problem</p>
        <div className="md:w-10/12 w-10/12">
          {/* <video className="pointer-events-none" autoPlay muted playsInline={true} key={videoSrc}>
            <source src={videoSrc} type="video/mp4" />
          </video> */}
          <div className="absolute z-4 w-full h-screen">
            <Brain />
          </div>
          
        </div>
      </div>
      
      <div
        id="cta"
        className="flex flex-col items-center opacity-0 translate-y-20 z-3"
      >
        <Button><a href="#highlights" className='btn'>KNOW MORE</a></Button>
        <p className="font-normal text-xl">Ability to focus on the sound of your interest</p>
      </div>
    </section>
    </>
  )
}

export default Hero