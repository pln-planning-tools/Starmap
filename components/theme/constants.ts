export const SMALL_SCREEN_THRESHOLD = 720; // average mobile screen height in pixels.

const lightMode = {
  header: {
    background: {
      color: '#27292C'
    },
    text: {
      color: '#FFFFFF'
    },
    input: {
      text: {
        color: '#FFFFFF'
      },
      background: {
        color: '#3C4651'
      },
      border: {
        color: '#8D8D8D',
        radius: '5px'
      }
    }
  },
  text: {
    color: '#313239'
  }
}

const darkMode = {
  header: {
    background: {
      color: '#27292C'
    },
    text: {
      color: '#FFFFFF'
    },
    input: {
      text: {
        color: '#FFFFFF'
      },
      background: {
        color: '#3C4651'
      },
      border: {
        color: '#8D8D8D',
        radius: '5px'
      }
    }
  },
  text: {
    color: '#D7D7D7'
  }
}

// TODO: Migrate to chakra theme defined in /pages/_app.tsx
// see https://github.com/pln-planning-tools/Starmap/issues/370
export default {
  light: lightMode,
  dark: darkMode
}
