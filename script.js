// Set BPM
Tone.Transport.bpm.value = 130;

// Arpeggio setup (Sampler)

// Rhodes sampler
const rhodes = new Tone.Sampler({
    urls: {
        C4: "C4.mp3",
    },
    volume: -6, // Lower volume
    baseUrl: "https://tonejs.github.io/audio/salamander/", // Use a base URL for loading samples
    onload: () => {
        console.log("Rhodes samples loaded!");
    },
}).toDestination();

// Define arpeggio notes
const arpeggioNotes = ["C5", "D5", "F5", "G5"];

// Create arpeggiator pattern
const arpeggioPattern = new Tone.Sequence(
    (time, note) => {
        rhodes.triggerAttackRelease(note, "4n", time); // Play each note
    },
    arpeggioNotes,
    "8t"
);

// Bass synth setup

// Bass sampler setup

const bass = new Tone.MonoSynth({
    oscillator: {
        type: "sawtooth", // Deep and edgy bass tone
    },
    envelope: {
        attack: 0.05,
        decay: 0.3,
        sustain: 1.0,
        release: 0.8,
    },
    filterEnvelope: {
        attack: 0.03,
        decay: 0.4,
        sustain: 0.7,
        release: 1.2,
        baseFrequency: 100,
        octaves: 2.5,
    },
}).toDestination();

const bassNotes = [
    { time: "0:0:0", note: "Bb1" },
    { time: "0:2:0", note: "A1" },
    { time: "0:4:0", note: "G1" },
];

const bassPart = new Tone.Part((time, event) => {
    bass.triggerAttackRelease(event.note, "8n", time); // Play each note
}, bassNotes);

bassPart.loop = true; // Loop the bass line
bassPart.loopEnd = "2m"; // Loop every 2 measures


// Piano setup
const piano = new Tone.Sampler({
    urls: {
        C4: "C4.mp3",
    },
    baseUrl: "https://tonejs.github.io/audio/salamander/",
    onload: () => {
        console.log("Piano samples loaded!");
    },
}).toDestination();

// Piano riff
const pianoRiff = [
    { time: "0:0:0", chord: ["D4", "G4", "Bb4"] }, // First chord
    { time: "0:0:2", chord: ["D4", "G4", "Bb4"] }, // First chord
    { time: "0:2:0", chord: ["D4", "F4", "A4"] },  // Second chord
    { time: "0:2:2", chord: ["D4", "F4", "A4"] },  // Second chord
    { time: "0:4:0", chord: ["Bb3", "D4", "G4"] }, // Third chord
    { time: "0:4:2", chord: ["Bb3", "D4", "G4"] }, // Third chord
];

// Create a Tone.Part to play the piano riff
const pianoPart = new Tone.Part((time, chord) => {
    piano.triggerAttackRelease(chord.chord, "2n", time); // Play chords
}, pianoRiff);

pianoPart.loop = true; // Loop the piano riff
pianoPart.loopEnd = "2m"; // 2-measure loop

// Kick drum setup
const kick = new Tone.MembraneSynth().toDestination();
const kickPart = new Tone.Loop((time) => {
    kick.triggerAttackRelease(55, "8n", time); // Kick drum
}, "4n");

// Hi-hat setup
const hihat = new Tone.NoiseSynth({
    volume: -10,
    envelope: { attack: 0.005, decay: 0.1, sustain: 0 },
}).toDestination();
const hihatPart = new Tone.Loop((time) => {
    hihat.triggerAttackRelease("16n", time); // Hi-hat
}, "16n");

// Snare setup
const snare = new Tone.NoiseSynth({
    volume: -5,
    envelope: { attack: 0.005, decay: 0.2, sustain: 0 },
    filterEnvelope: { attack: 0.005, decay: 0.1, sustain: 0, baseFrequency: 1000 },
}).toDestination();
const snarePart = new Tone.Loop((time) => {
    snare.triggerAttackRelease("16n", time); // Snare
}, "2n"); // Snare plays every half measure

// Load the .wav file using Tone.Player
const fxSound = new Tone.Player({
    url: "assets/fx.wav",
    onload: () => {
        console.log("FX sound loaded successfully");
    },
    onerror: (err) => {
        console.error("Error loading FX sound:", err);
    },
}).toDestination();


// Create a part to trigger the FX sound at a specific time (once)
const fxPart = new Tone.Part((time) => {
    console.log("FX Part triggered at:", time);
    fxSound.start(time); // Ensure this line is executed
}, [
    { time: "0:0:1" }
]);


// Intro Section (Kick and Arpeggio)
Tone.Transport.schedule(() => {
    console.log("Intro started");
    arpeggioPattern.start(0);
    kickPart.start(0); 
    snarePart.start(0);
    fxPart.start(0);
}, "0:0:0");

// Transition out of Intro
Tone.Transport.schedule(() => {
    console.log("Piano entrance");
    pianoPart.start("4:0:0");
    kickPart.stop("4:0:0");
    snarePart.stop("4:0:0");
    arpeggioPattern.stop("4:0:0");
}, "4:0:0"); // End of the Intro

Tone.Transport.schedule(() => {
    console.log("Bass + Drums back ");
    kickPart.start("8:0:0");
    snarePart.start("8:0:0");
    hihatPart.start("8:0:0");
    bassPart.start("8:0:0");
}, "8:0:0"); // End of the Intro

Tone.Transport.schedule(() => {
    console.log("Bass + Drums back ");
    kickPart.start("8:0:0");
    snarePart.start("8:0:0");
    hihatPart.start("8:0:0");
    bassPart.start("8:0:0");
}, "16:0:0"); // End of the Intro



// Play button logic
document.getElementById('play-button').addEventListener('click', async () => {
    await Tone.start(); // Unlock the audio context
    console.log("Audio Context started!");
    Tone.Transport.start();
});

// Stop button logic
document.getElementById('stop-button').addEventListener('click', () => {
    console.log("Audio Context stopped!");
    Tone.Transport.stop(); // Stop all scheduled events
    Tone.Transport.cancel(); // Clear all scheduled events
});