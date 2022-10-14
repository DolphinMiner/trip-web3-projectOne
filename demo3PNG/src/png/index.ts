export const pngSource = {
  skin: {
    default: require("./skin/default.png"),
  },
  accessory: {
    none: "",
    earphones: require("./accessory/earphones.png"),
    earring1: require("./accessory/earring1.png"),
    earring2: require("./accessory/earring2.png"),
    earring3: require("./accessory/earring3.png"),
  },
  eye: {
    cry: require("./eye/cry.png"),
    default: require("./eye/default.png"),
    hearts: require("./eye/hearts.png"),
    side: require("./eye/side.png"),
    surprised: require("./eye/surprised.png"),
    wink: require("./eye/wink.png"),
  },
  eyebrow: {
    angry: require("./eyebrow/angry.png"),
    raised: require("./eyebrow/raised.png"),
    sad: require("./eyebrow/sad.png"),
    unibrow: require("./eyebrow/unibrow.png"),
    updown: require("./eyebrow/updown.png"),
  },
  mouth: {
    default: require("./mouth/default.png"),
    eating: require("./mouth/eating.png"),
    sad: require("./mouth/sad.png"),
    tongue: require("./mouth/tongue.png"),
    twinkle: require("./mouth/twinkle.png"),
  },
  clothe: {
    blazer: require("./clothe/blazer.png"),
    hoodie: require("./clothe/hoodie.png"),
    overall: require("./clothe/overall.png"),
    sweater: require("./clothe/sweater.png"),
    vneck: require("./clothe/vneck.png"),
  },
  hair: {
    hairbun: require("./hair/hairbun.png"),
    shorthaircurly: require("./hair/shorthaircurly.png"),
    shorthairflat: require("./hair/shorthairflat.png"),
    shorthairfrizzle: require("./hair/shorthairfrizzle.png"),
    shorthairwaved: require("./hair/shorthairwaved.png"),
  },
  eyeglass: {
    none: "",
    fancy: require("./eyeglass/fancy.png"),
    harry: require("./eyeglass/harry.png"),
    nerd: require("./eyeglass/nerd.png"),
    old: require("./eyeglass/old.png"),
    rambo: require("./eyeglass/rambo.png"),
  },
} as const;

export default pngSource;
