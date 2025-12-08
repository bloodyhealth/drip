const red = '#c3000d'
export const shadesOfRed = ['#e7999e', '#db666d', '#cf323d', '#c3000d'] // light to dark

const blue = '#6975ab'
const shadesOfBlue = ['#c4dbff', '#97a8d5', blue, '#3c4281', '#0d0d55'] // light to dark
const yellow = '#facc00'
const shadesOfYellow = ['#fdeeab', yellow] // light to dark
const violet = '#4d006b'
const shadesOfViolet = ['#c4abce', '#8a579d', violet] // light to dark
const pink = '#d10070'
const shadesOfPink = ['#f0abd0', '#e157a1', pink] // light to dark
const lightGreen = '#bccd67'
const orange = '#bc6642'
const mint = '#6ca299'
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
      color: red,
      shades: shadesOfRed,
    },
    temperature: {
      color: turquoiseDark,
    },
    mucus: {
      color: blue,
      shades: shadesOfBlue,
    },
    cervix: {
      color: yellow,
      shades: shadesOfYellow,
    },
    sex: {
      color: violet,
      shades: shadesOfViolet,
    },
    desire: {
      color: pink,
      shades: shadesOfPink,
    },
    pain: {
      color: lightGreen,
      shades: [lightGreen],
    },
    mood: {
      color: orange,
      shades: [orange],
    },
    note: {
      color: mint,
      shades: [mint],
    },
  },
}
