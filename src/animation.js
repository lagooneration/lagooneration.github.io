import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";

gsap.registerPlugin(ScrollTrigger, SplitText, MotionPathPlugin);



export function animationGSAP() {


    ///////////////////////////////////////////////////////////////////////
    // IMAGE SEQUENCER

    const canvas = document.getElementById("hero-lightpass");
    const context = canvas.getContext("2d");

    canvas.width = 1920;
    canvas.height = 1080;

    // if view port is smaller than 600px, change canvas size
    if (window.innerWidth < 600) {
        canvas.width = 600;
        canvas.height = 400;
    }

    const frameCount = 75;
    const currentFrame = (index) =>
        `./hp_sequence/${(
            index + 1
        )
            .toString()
            .padStart(4, "0")}.jpg`;

    const images = [];
    const airpods = {
        frame: 0
    };

    for (let i = 0; i < frameCount; i++) {
        const img = new Image();
        img.src = currentFrame(i);
        images.push(img);
    }

    gsap.to(airpods, {
        frame: frameCount - 1,
        snap: "frame",
        ease: "none",
        scrollTrigger: {
            trigger: ".canvas-containerV",
            start: "top top",
            end: "+=3500",
            pin: true,
            scrub: 0.5
        },
        onUpdate: render // use animation onUpdate instead of scrollTrigger's onUpdate
    });

    images[0].onload = render;

    function render() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(images[airpods.frame], 0, 0);
    }

    ////////////////////////////////////////////////////////////////////////
    //// GSAP ANIMATION

    // box animation
    //gsap.to(".box", {
    //    scrollTrigger: ".box",
    //    rotation: 360,
    //    x: '30vw',
    //    y: '-20vw',
    //    yPercent: -10,
    //    scale: 1.4,
    //    duration: 1,
    //});


    /// FIRST TEXT
    const repeatCount = 4;
    const tlc = gsap.timeline({ paused: true });
    const split = new SplitText("h1", { type: "words, chars" });

    // Calculate the total duration for the animation
    let totalDuration = 0;

    // Iterate through each character in the split text
    split.chars.forEach((obj, i) => {
        // Extract the text content of the character
        let txt = obj.innerText;

        // Create a clone of the character for animation
        let clone = `<div class="cloneText">${txt}</div>`;

        // Wrap the original character and its clone in HTML structure
        let newHTML = `<div class="originalText">${txt}</div>${clone}`;
        obj.innerHTML = newHTML;

        // Set initial position for each character
        gsap.set(obj.childNodes[1], {
            yPercent: i % 2 === 0 ? -100 : 100
        });

        // Calculate the delay for each character to stop rolling
        let delay = i * 0.01;

        // Create animation to roll the character
        let tween = gsap.to(obj.childNodes, {
            repeat: repeatCount,
            ease: "none",
            yPercent: i % 2 === 0 ? "+=100" : "-=100"
        });

        // Add animation to the timeline with a delay
        tlc.add(tween, totalDuration + delay);

        // Update total duration for the animation
        totalDuration += delay;
    });

    // Start the timeline animation
    gsap.to(tlc, { progress: 1, duration: totalDuration + 4, ease: "power4.inOut" });



    //// COCHLEAR SOUND TEXT
    const quotes = document.querySelectorAll(".textQ");

    function setupSplits() {
        quotes.forEach(quote => {
            // Reset if needed
            if (quote.anim) {
                quote.anim.progress(1).kill();
                quote.split.revert();
            }

            quote.split = new SplitText(quote, {
                type: "lines,words,chars",
                linesClass: "split-line"
            });

            // Set up the anim
            quote.anim = gsap.from(quote.split.chars, {
                scrollTrigger: {
                    trigger: quote,
                    toggleActions: "restart pause resume reverse",
                    start: "top 50%",
                },
                duration: 0.6,
                opacity: 0,
                ease: "circ.out",
                y: 40,
                stagger: 0.02,
            });
        });
    }

    ScrollTrigger.addEventListener("refresh", setupSplits);
    setupSplits();





    //// Video text

    /////////////////////////////
    //// HORIZONTAL SCROLL

    const section = document.querySelector('.demo-text'); // Replace '#neurophones' with the specific section ID you want to target
    const w = document.querySelector('.wrapper');
    const xEnd = (w.scrollWidth - section.offsetWidth) * -1;
    gsap.fromTo(w, { x: '100%' }, {
        x: xEnd,
        scrollTrigger: {
            trigger: section,
            scrub: 0.5
        }
    });

    /////////////////////////////////////
    //// OPACITY SCROLL

    gsap.to(".hero__headline", {
        scrollTrigger: {
            trigger: ".hero__content",
            scrub: true,
            pin: true,
            start: "top 38%",
            end: "bottom -10%",
            toggleClass: "active",
            ease: "power2"
        }
    });





    // DEMO BUTTON VISIBILITY

    const scrollButton = document.getElementById('scrollButton');

    // Calculate the scroll percentage of the section
    function getScrollPercentage(section) {
        const scrollPosition = window.scrollY;
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const distance = scrollPosition - sectionTop;
        const percentage = distance / sectionHeight * 100;

        return Math.max(0, Math.min(100, percentage));
    }

    // Show or hide the button based on scroll percentage
    function updateButtonVisibility() {
        const scrollSection = document.getElementById('main-c');
        const scrollPercentage = getScrollPercentage(scrollSection);

        if (scrollPercentage >= 60) { // Adjust this value as needed
            // Show the button with animation
            gsap.to(scrollButton, { duration: 0.5, opacity: 1, scale: 1, y: 0, ease: 'power2.out' });
        } else {
            // Hide the button with animation
            gsap.to(scrollButton, { duration: 0.5, opacity: 0, scale: 0, y: 50, ease: 'power2.in' });
        }
    }

    // Update button visibility when scrolling
    window.addEventListener('scroll', updateButtonVisibility);

    // Update button visibility on page load
    updateButtonVisibility();


}

const flightPathUp = {
    curviness: 0.5,
    path: [{ x: -0.2, y: -0.17, z: 9.2 }],
};

const flightPathUp2 = {
    curviness: 1,
    path: [{ x: 0.1, y: 0.4, z: 6.2 }],
};

const flightPathUp3 = {
    curviness: 0.8,
    path: [{ x: 0.1, y: 0.17, z: 4.3 }],
};

const flightPathUp4 = {
    curviness: 0.5,
    path: [{ x: -0.49, y: 0.85, z: 0.6 }],
};
export function ImplantAnimation(obj) {
    const tween = gsap.timeline({
        defaults: {
            duration: 1,
            ease: "power1.inOut",
            onUpdate: () => {
                // Update the object's position in the 3D scene
            },
            onComplete: () => {
                obj.rotation.set(0, 0, 0);
                
            },
        },
    });

    tween
        .to(obj.position, { motionPath: flightPathUp })
        .to(obj.position, { motionPath: flightPathUp2})

        .to(obj.position, { motionPath: flightPathUp4});
}