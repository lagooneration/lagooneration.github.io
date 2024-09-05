import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Highlights from './components/Highlights';
import Model from './components/Model';
import Features from './components/Features';
import HowItWorks from './components/HowItWorks';
import Roadmap from './components/Roadmap';
import Footer from './components/Footer';
// import Experience from './components/Experience';   

// import * as Sentry from '@sentry/react';

const App = () => {
  return (
    <main className="bg-black">
      <Navbar />
      <Hero />
      <Highlights />
      <Model />
      <Features />
      <Roadmap />
      <HowItWorks />
      
      <Footer />
    </main>
  )
}

export default App;
