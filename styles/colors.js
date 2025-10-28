const redColor = '#c3000d'
export const shadesOfRed = ['#e7999e', '#db666d', '#cf323d', '#c3000d'] // light to dark

const blueColor = '#6975ab'
const shadesOfBlue = ['#c4dbff', '#97a8d5', blueColor, '#3c4281', '#0d0d55'] // light to dark
const yellowColor = '#facc00'
const shadesOfYellow = ['#fdeeab', yellowColor] // light to dark
const violetColor = '#4d006b'
const shadesOfviolet = ['#c4abce', '#8a579d', violetColor] // light to dark
const pinkColor = '#d10070'
const shadesOfPink = ['#f0abd0', '#e157a1', pinkColor] // light to dark
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
      color: violetColor,
      shades: shadesOfviolet,
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
