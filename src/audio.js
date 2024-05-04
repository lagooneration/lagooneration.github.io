
// Icon audio
const listener3 = new AudioListener();
camera.add(listener3);
const mainSound = new Audio(listener3);

const drums = new AudioListener();
camera.add(drums);
const drumSound = new Audio(drums);

const bassS = new AudioListener();
camera.add(bassS);
const bassSound = new Audio(bassS);

const pianoS = new AudioListener();
camera.add(pianoS);
const pianoSound = new Audio(pianoS);

// Main button to start both audios
document.addEventListener("DOMContentLoaded", function () {
    const button = document.querySelector('.audiobutton');
    button.innerHTML = "Loading Audio...";

    let isPlaying2 = false; // Variable to track whether the audio is currently playing


    // load a sound and set it as the Audio object's buffer

    const drumloader = new AudioLoader();
    drumloader.load(dstem, function (buffer) {
        drumSound.setBuffer(buffer);
        drumSound.setVolume(0.05);
    });

    const bassloader = new AudioLoader();
    bassloader.load(bstem, function (buffer) {
        bassSound.setBuffer(buffer);
        bassSound.setVolume(0.05);
    });

    const pianoloader = new AudioLoader();
    pianoloader.load(pstem, function (buffer) {
        pianoSound.setBuffer(buffer);
        pianoSound.setVolume(0.05);
    });


    const mainSloader = new AudioLoader();

    mainSloader.load(mainstem, function (buffer) {
        mainSound.setBuffer(buffer);
        // sound.setLoop(true);
        mainSound.setVolume(0.8);
        button.innerHTML = "Play ⏯︎";

    });

    button.addEventListener('pointerdown', () => {
        if (isPlaying2) {
            // Pause the audio
            mainSound.pause();
            bassSound.pause();
            drumSound.pause();
            pianoSound.pause();

            button.innerHTML = "Play Audio";



        } else {
            // Play the audio
            mainSound.play();
            drumSound.play();
            bassSound.play();
            pianoSound.play();

            button.innerHTML = "Pause Audio";



        }

        // Toggle the isPlaying variable
        isPlaying2 = !isPlaying2;

    }, false);

});


