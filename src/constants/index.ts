import {
  blackImg,
  blueImg,
  highlightFirstVideo,
  highlightFourthVideo,
  highlightSecondVideo,
  highlightThirdVideo,
  roadmap1,
  roadmap2,
  roadmap3,
  roadmap4,
  whiteImg,
  yellowImg,
} from "../utils/index.ts";

export const navLists = ["HOME", "NEUROXONES", "AUDIO PLUGIN", "CONTACT"];

export const hightlightsSlides = [
  {
    id: 1,
    textLists: [
      "Ability to focus",
      "is severly affected.",
      
    ],
    video: highlightFirstVideo,
    videoDuration: 5,
  },
  {
    id: 2,
    textLists: ["Hear Speech.", "via cochlear implant."],
    video: highlightSecondVideo,
    videoDuration: 18,
  },
  {
    id: 3,
    textLists: [
      "Hear music.",
      "via cochlear implant.",
   
    ],
    video: highlightThirdVideo,
    videoDuration: 2,
  },
  {
    id: 4,
    textLists: ["The answer could be", "MUSIC."],
    video: highlightFourthVideo,
    videoDuration: 3.63,
  },
];

export const models = [
  {
    id: 1,
    title: "Active Auditory Attention",
    color: ["#8F8A81", "#ffe7b9", "#6f6c64"],
    img: yellowImg,
  },
  {
    id: 2,
    title: "Active Auditory Attention",
    color: ["#53596E", "#6395ff", "#21242e"],
    img: blueImg,
  },
  {
    id: 3,
    title: "Active Auditory Attention",
    color: ["#C9C8C2", "#ffffff", "#C9C8C2"],
    img: whiteImg,
  },
  {
    id: 4,
    title: "Active Auditory Attention",
    color: ["#454749", "#3b3b3b", "#181819"],
    img: blackImg,
  },
];

export const sizes = [
  { label: 'Ear-EEG', value: "small" },
  { label: 'Head-EEG', value: "large" },
];

export const footerLinks = [
  "Neuroxones",
  "Citizen Corrects",
  "WhatsApp",
  "Contributions",
];
//   { name: "Neuroxones", href: "https://neurophones.netlify.app/" },
//   { name: "Citizen Corrects", href: "https://www.citizencorrects.com" },
//   { name: "WhatsApp", href: "https://api.whatsapp.com/send?phone=9478972509" },
//   { name: "Contributions", href: "https://github.com/lagooneration/lagooneration.github.io/blob/master/README.md#resources" }
// ];

export const roadmap = [
  {
    id: "0",
    title: "Convolutional time-domain audio separation",
    text: "Single-channel, speaker-independent speech separation methods have recently seen great progress. However, the accuracy, latency, and computational cost of such methods remain insufficient",
    date: "DEMUCS",
    status: "progress",
    imageUrl: roadmap1,
    colorful: true,
  },
  {
    id: "1",
    title: "Hybrid Spectrogram and Waveform Source Separation",
    text: "Single-channel, speaker-independent speech separation methods have recently seen great progress. However, the accuracy, latency, and computational cost of such methods remain insufficient.",
    date: "CONV-TasNet",
    status: "done",
    imageUrl: roadmap2,
  },
  {
    id: "2",
    title: "Concept Actualization",
    text: "Click on DEMO to experience the real-time auditory attention detection using EEG data.",
    date: "CONCEPT",
    status: "done",
    imageUrl: roadmap3,
  },
  {
    id: "3",
    title: "Training models by listening music",
    text: "Allow users to customize the auditory attention behavior, making it more engaging and fun to interact which can be used later for real world applications.",
    date: "Research & Development",
    status: "progress",
    imageUrl: roadmap4,
  },
];
