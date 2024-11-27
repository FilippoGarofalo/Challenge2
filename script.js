// Set BPM
Tone.Transport.bpm.value = 130;

// Arpeggiator Synth setup
const arpeggiator = new Tone.Synth({
    oscillator: { type: "sine" }, // Smooth and soft tone
    envelope: { 
        attack: 0.1, // Gentle fade-in
        decay: 1.5, // Gradual decay for sustain-like behavior
        sustain: 0.5, 
        release: 2, // Longer release for lingering notes
    },
  
}).toDestination();


// Arpeggiator pattern
const arpeggioPattern = new Tone.Pattern(
    (time, note) => {
        arpeggiator.triggerAttackRelease(note, "8n", time); // Trigger each note
    },
    ["C5", "E5", "G5", "B5"], // Notes of the arpeggio
    "up" // Arpeggiate upward
);

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
    hihat.triggerAttackRelease("8n", time); // Hi-hat
}, "8n");

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
const fxSound = new Tone.Player("assets/fx.wav", () => {
    console.log("FX sound loaded");
}).toDestination(); // Routing to the output (master) destination

// Create a part to trigger the FX sound at a specific time (once)
const fxPart = new Tone.Part((time) => {
    fxSound.start(time); // Play the FX sound once at the specified time
}, [
    { time: "0:0:0" },  // Schedule to play once at 1:4:0 (adjust time as needed)
]);

// Schedule Intro Section (Kick and Arpeggiator)
Tone.Transport.schedule(() => {
    console.log("Intro started");
    //arpeggioPattern.start(0); // Start arpeggiator
    kickPart.start(0); // Start kick drum
    snarePart.start(0);
    pianoPart.start(0);
    hihatPart.start(0);
    fxPart.start(0);
}, "0:0:0");

// Transition out of Intro
Tone.Transport.schedule(() => {
    console.log("Piano entrance");
}, "2:0:0"); // End of the Intro

// Main Bridge (Example, for later sections)
Tone.Transport.schedule(() => {
    console.log("Main Bridge started");
    // Add piano, other instruments, etc.
}, "2:0:0");

// Play button logic
document.getElementById('play-button').addEventListener('click', async () => {
    await Tone.start(); // Unlock the audio context
    console.log("Audio Context started!");
    Tone.Transport.start();
});
