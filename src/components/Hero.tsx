import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
//import { heroVideo, smallHeroVideo } from '../utils/index.ts';
// import { useEffect } from 'react';
import { Brain } from '../components/brain/brain.tsx';
// import { Button } from './ui/Button.tsx';
// import Experience from './Experience.tsx';

const Hero = () => {
  // const [videoSrc, setVideoSrc] = useState(window.innerWidth < 760 ? smallHeroVideo : heroVideo)

  // const handleVideoSrcSet = () => {
  //   if(window.innerWidth < 760) {
  //     setVideoSrc(smallHeroVideo)
  //   } else {
  //     setVideoSrc(heroVideo)
  //   }
  // }

  // useEffect(() => {
  //   window.addEventListener('resize', handleVideoSrcSet);

  //   return () => {
  //     window.removeEventListener('reisze', handleVideoSrcSet)
  //   }
  // }, [])

  useGSAP(() => {
    gsap.to('#hero', { opacity: 1, delay: 2 })
    gsap.to('#cta', { opacity: 1, y: -50, delay: 2 })
  }, [])

  return (
    <>
    
    <section className="w-full nav-height bg-transparent relative">
    <div className="absolute h-[200px] w-full flex flex-center justify-center flex-col mt-[100px] z-12">
        <p id="hero" className="hero-title text-white absolute">The <br /> Cocktail Party Problem</p>
        
     
      </div>
    <div className="absolute z-0 w-full h-[900px]">
              <Brain />
          </div>
      
      <div
        id="cta"
        className="flex flex-col gap-2 w-full lg:h-[800px] md:h-[800px] justify-end items-center opacity-0 translate-y-20 mt-[80px] z-3 absolute pd-4"
      >
        
        <p className="font-mono lg:text-xl md:text-lg pl-12 pr-12 flex flex-center justify-center align-center text-center">The ability to focus on a specific sound in a noisy environment is known as selective auditory attention</p>

        <button className="bg-slate-950 text-slate-400 border border-slate-400 border-b-4 font-medium overflow-hidden relative px-4 py-2 rounded-md hover:brightness-150 hover:border-t-4 hover:border-b active:opacity-75 outline-none duration-300 group">
  <span className="bg-slate-400 shadow-slate-400 absolute -top-[150%] left-0 inline-flex w-80 h-[5px] rounded-md opacity-50 group-hover:top-[150%] duration-500 shadow-[0_0_10px_10px_rgba(0,0,0,0.3)]"></span>
  Know More
</button>
        
      </div>
      
    </section>
    </>
  )
}

export default Hero