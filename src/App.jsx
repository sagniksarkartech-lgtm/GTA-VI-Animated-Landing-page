import React, { useState, useRef, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);
const App=()=>{
  let[showContent, setShowContent]=useState(false)
  const audioRef = useRef(null);

  useEffect(() => {
    const audio = new Audio("/Music.mp3");
    audio.loop = false;
    audio.volume = 1;
    audioRef.current = audio;

    // Try autoplay immediately
    const tryPlay = audio.play();
    if (tryPlay !== undefined) {
      tryPlay.catch(() => {
        // Browser blocked autoplay, wait for first interaction
        const playMusic = () => {
          audio.play().catch(() => {});
          document.removeEventListener("click", playMusic);
          document.removeEventListener("touchstart", playMusic);
          document.removeEventListener("keydown", playMusic);
        };
        document.addEventListener("click", playMusic);
        document.addEventListener("touchstart", playMusic);
        document.addEventListener("keydown", playMusic);
      });
    }

    return () => {
      audio.pause();
    };
  }, []);
  useGSAP(()=>{
    const t1=gsap.timeline();
    t1.to(".vi-mask-group",{
       rotate: 10,
       duration: 2,
       ease: "Power4.easeInOut",
       transformOrigin: "50% 50%",
    })
    .to(".vi-mask-group",{
      scale: 10,
      duration: 2,
      delay: -1.8,
      ease: "Expo.easeInOut",
      transformOrigin: "50% 50%",
      opacity: 0,
      onUpdate: function () {
        if (this.progress() >= 0.9) {
          document.querySelector(".svg").remove();
          setShowContent(true);
          this.kill();
        }
      },
    })
  })

  useGSAP(() => {
    if (!showContent) return;

    gsap.to(".main", {
      scale: 1,
      rotate: 0,
      duration: 2,
      delay: "-1",
      ease: "Expo.easeInOut",
    });

    gsap.to(".sky", {
      scale: 1.1,
      rotate: 0,
      duration: 2,
      delay: "-.8",
      ease: "Expo.easeInOut",
    });

    gsap.to(".bg", {
      scale: 1.1,
      rotate: 0,
      duration: 2,
      delay: "-.8",
      ease: "Expo.easeInOut",
    });

    let mm = gsap.matchMedia();

    mm.add({
      isMobile: "(max-width: 767px)",
      isDesktop: "(min-width: 768px)"
    }, (context) => {
      let { isMobile } = context.conditions;

      gsap.to(".character", {
        scale: 1.2,
        xPercent: -50,
        bottom: isMobile ? "-5%" : "-25%",
        rotate: 0,
        duration: 2,
        delay: "-.8",
        ease: "Expo.easeInOut",
      });

      gsap.to(".text", {
        scale: isMobile ? 0.5 : 1,
        rotate: 0,
        duration: 2,
        delay: "-.8",
        ease: "Expo.easeInOut",
      });
    });

    gsap.to(".black-gradient-overlay", {
      opacity: 0,
      duration: 0.5,
      delay: 0,
      ease: "Power2.easeInOut",
      onComplete: () => {
        const overlay = document.querySelector(".black-gradient-overlay");
        if (overlay) overlay.style.display = "none";
      },
    });

    const main = document.querySelector(".main");

    main?.addEventListener("mousemove", function (e) {
      const xMove = (e.clientX / window.innerWidth - 0.5) * 40;
      const yMove = (e.clientY / window.innerHeight - 0.5) * 20;
      gsap.to(".main .text", {
        x: `${xMove * 0.4}%`,
        y: `${yMove * 0.3}%`,
      });
      gsap.to(".sky", {
        x: xMove * 0.8,
        y: yMove * 0.5,
      });
      gsap.to(".bg", {
        x: xMove * 1.7,
        y: yMove * 0.8,
      });
      gsap.to(".character", {
        x: xMove * 0.6,
        y: yMove * 0.5,
      });
    });
    // Scroll fade-in animations for second section
    gsap.utils.toArray(".fade-up").forEach((el, i) => {
      gsap.fromTo(el,
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          delay: i * 0.15,
          ease: "Power3.easeOut",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            end: "top 50%",
            toggleActions: "play none none none",
          },
        }
      );
    });
  }, [showContent]);
  return(
    <>
        <div className="svg flex items-center justify-center fixed top-0 left-0 z-[100] w-full h-screen overflow-hidden bg-[#000]">
        <svg viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice">
          <defs>
            <mask id="viMask">
              <rect width="100%" height="100%" fill="black" />
              <g className="vi-mask-group">
                <text
                  x="50%"
                  y="50%"
                  fontSize="250"
                  textAnchor="middle"
                  fill="white"
                  dominantBaseline="middle"
                  fontFamily="Arial Black"
                >
                  VI
                </text>
              </g>
            </mask>
          </defs>
          <image
            href="./bg1.png"
            width="100%"
            height="100%"
            preserveAspectRatio="xMidYMid slice"
            mask="url(#viMask)"
          />
        </svg>
      </div>
      {showContent && (
       <>
        <div className="black-gradient-overlay fixed top-0 left-0 w-full h-screen z-[50] pointer-events-none" style={{background: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.95) 30%, rgba(0,0,0,0.8) 60%, rgba(0,0,0,0.6) 80%, rgba(0,0,0,0) 100%)'}}></div>
        <div className="main w-full rotate-[-10deg] scale-[1.7] bg-black">
        <div className="landing w-full h-screen bg-black">
          <div className="navbar absolute top-0 left-0 z-[10] w-full py-5 px-5 md:py-10 md:px-10">
            <div className="logo flex gap-7">
              <div className="lines flex flex-col gap-[5px]">
                 <div className="line w-15 h-2 bg-white"></div>
                  <div className="line w-8 h-2 bg-white"></div>
                  <div className="line w-5 h-2 bg-white"></div>
              </div>
              <div className="text text-3xl text-white -mt-[8px] leading-none">
                <h3>Rockstar</h3>
              </div>
            </div>
          </div>
          <div className="imagesdiv relative overflow-hidden w-full h-screen">
            <img className="sky absolute w-full h-full scale-[1.5] rotate-[-20deg] top-0 left-0 object-cover" src="./sky.png" alt="" />
            <img className="bg absolute w-full h-full scale-[1.7] rotate-[-3deg] top-0 left-0 object-cover" src="./bg2.png" alt="" />
              <div className="text text-white flex flex-col gap-3 absolute top-0.8 left-1/2 -translate-x-1/4 scale-[3] rotate-[-20deg] scale-[1.4] rotate-[-10deg]">
                <h1 className="text-[7rem] leading-none -ml-40">grand</h1>
                <h1 className="text-[7rem] leading-none ml-20">theft</h1>
                <h1 className="text-[7rem] leading-none -ml-40">auto</h1>
              </div>
              <img
                className="absolute character -bottom-[15%] left-1/2 -translate-x-1/2  scale-[0.9]"
                src="./Boy.png"
                alt=""
              />
                 <div className="btmbar text-white absolute bottom-0 left-0 w-full py-15 px-10 bg-gradient-to-t from-black to-transparent"></div>
          </div>
        </div>
        <div className="w-full min-h-screen relative flex items-center justify-center bg-black py-20 md:py-0">
            <div className="cntnr flex flex-col md:flex-row text-white w-full h-auto items-center justify-center gap-10 md:gap-0">
              <div className="limg w-full md:w-1/2 flex items-center justify-center fade-up">
                <img
                  className="scale-[1] md:scale-[1.3] max-w-[80%] md:max-w-none"
                  src="./imag.png"
                  alt=""
                />
              </div>
              <div className="rg w-full md:w-[40%] lg:w-[30%] px-8 md:px-0 py-10 md:py-30 text-center md:text-left">
                <h1 className="text-5xl md:text-8xl fade-up">Still Running,</h1>
                <h1 className="text-5xl md:text-8xl fade-up">Not Hunting</h1>
                <p className="mt-8 md:mt-10 text-lg md:text-xl fade-up" style={{fontFamily: "'Segoe UI', Arial, sans-serif", fontWeight: 400}}>
                  Welcome to Vice City — a sun-soaked metropolis full of
                  self-help gurus, starlets, and fading celebrities. Once a
                  major vacation spot, it is now the crime capital of America,
                  buzzing with energy and opportunity.
                </p>
                <p className="mt-3 text-lg md:text-xl fade-up" style={{fontFamily: "'Segoe UI', Arial, sans-serif", fontWeight: 400}}>
                  Experience an expansive open world filled with neon-lit
                  nightclubs, roaring muscle cars, and a gripping story of
                  loyalty, betrayal, and the pursuit of the American Dream.
                  Every corner has a story — and every story has a price.
                </p>
                <p className="mt-8 md:mt-10 text-lg md:text-xl fade-up" style={{fontFamily: "'Segoe UI', Arial, sans-serif", fontWeight: 400}}>
                  Built on the next generation of open-world game design,
                  Grand Theft Auto VI delivers a living, breathing world with
                  unparalleled detail, dynamic weather, and a cast of
                  unforgettable characters ready to leave their mark.
                </p>
                <a href="http://github.com/sagniksarkartech-lgtm/GTA-VI-Animated-Landing-page" target="_blank" rel="noopener noreferrer" className="bg-yellow-500 px-6 py-6 md:px-10 md:py-10 text-black mt-10 text-2xl md:text-4xl inline-block">
                  Get Source Code
                </a>
              </div>
            </div>
          </div>
        </div>
       </>
      )}
    </>
  );
}
export default App;