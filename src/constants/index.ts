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
    videoDuration: 4,
  },
  {
    id: 2,
    textLists: ["Hear Speech.", "via cochlear implant."],
    video: highlightSecondVideo,
    videoDuration: 5,
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
  "Privacy Policy",
  "Terms of Use",
  "Sales Policy",
  "Legal",
  "Site Map",
];

export const roadmap = [
  {
    id: "0",
    title: "Convolutional time-domain audio separation",
    text: "Single-channel, speaker-independent speech separation methods have recently seen great progress. However, the accuracy, latency, and computational cost of such methods remain insufficient",
    date: "Demucs",
    status: "progress",
    imageUrl: roadmap1,
    colorful: true,
  },
  {
    id: "1",
    title: "Hybrid Spectrogram and Waveform Source Separation",
    text: "Single-channel, speaker-independent speech separation methods have recently seen great progress. However, the accuracy, latency, and computational cost of such methods remain insufficient.",
    date: "Conv-TasNet",
    status: "done",
    imageUrl: roadmap2,
  },
  {
    id: "2",
    title: "Chatbot customization",
    text: "Allow users to customize the chatbot's appearance and behavior, making it more engaging and fun to interact with.",
    date: "May 2023",
    status: "done",
    imageUrl: roadmap3,
  },
  {
    id: "3",
    title: "Integration with APIs",
    text: "Allow the chatbot to access external data sources, such as weather APIs or news APIs, to provide more relevant recommendations.",
    date: "May 2023",
    status: "progress",
    imageUrl: roadmap4,
  },
];
