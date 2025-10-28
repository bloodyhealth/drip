const redColor = '#c3000d'
export const shadesOfRed = ['#e7999e', '#db666d', '#cf323d', '#c3000d'] // light to dark

const blueColor = '#6975ab'
const shadesOfBlue = [
  '#c4dbff',
  '#97a8d5',
  anotherBlueColor,
  '#3c4281',
  '#0d0d55',
] // light to dark
const yellowColor = '#facc00'
const shadesOfYellow = ['#fdeeab', anotherYellowColor] // light to dark
const magentaColor = '#6f2565'
const shadesOfMagenta = ['#a87ca2', '#8b5083', magentaColor] // light to dark
const pinkColor = '#9e346c'
const shadesOfPink = ['#c485a6', '#b15c89', pinkColor] // light to dark
const lightGreenColor = '#bccd67'
const orangeColor = '#bc6642'
const mintColor = '#6ca299'
const turquoiseDark = '#69CBC1'

export default {
  greyDark: '#555',
  grey: '#888',
  greyLight: '#CCC',
  greyVeryLight: '#F4F4F4',
  orange: '#F38337',
  purple: '#3A2671',
  purpleLight: '#938EB2',
  turquoiseDark: turquoiseDark,
  turquoise: '#CFECEA',
  turquoiseLight: '#E9F2ED',
  iconColors: {
    bleeding: {
      color: redColor,
      shades: shadesOfRed,
    },
    temperature: {
      color: turquoiseDark,
    },
    mucus: {
      color: blueColor,
      shades: shadesOfBlue,
    },
    cervix: {
      color: yellowColor,
      shades: shadesOfYellow,
    },
    sex: {
      color: magentaColor,
      shades: shadesOfMagenta,
    },
    desire: {
      color: pinkColor,
      shades: shadesOfPink,
    },
    pain: {
      color: lightGreenColor,
      shades: [lightGreenColor],
    },
    mood: {
      color: orangeColor,
      shades: [orangeColor],
    },
    note: {
      color: mintColor,
      shades: [mintColor],
    },
  },
}
