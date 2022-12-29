import { css } from "styled-components";

const sizes = {
  desktop: 900,
};

const breakpoints = Object.keys(sizes).reduce((acc, label) => {
  acc[label] = (...args) =>
    args.length
      ? css`
          @media (min-width: ${sizes[label]}px) {
            ${css(...args)};
          }
        `
      : `@media (min-width: ${sizes[label]}px)`;
  return acc;
}, {});

const transitions = {
  fast: "0.3s ease-out",
  medium: "0.5s ease-out",
};

const colors = {
  black: "#000000",
  darkGrey: "#181818",
  mediumGrey: "#313131",
  lightGrey: "#e5e5e5",

  beige: "#f1ede7",
  white: "#ffffff",

  purple: "#4114E2",

  lightGreen: "#71B16B",
  darkGreen: "#3e5e3b",
  orange: "#E28C47",
  brown: "rgb(165, 42, 42)",
  red: "#f87260",
};

const typography = {
  body: {
    fontFamily: "Roboto-Regular",
    // fontSize: "10px",
    // lineHeight: "12px",
    letterSpacing: "0.46px",
    [breakpoints.desktop()]: {
      // fontSize: "12px",
      // lineHeight: "17px",
    },
  },
  main: {
    // padding: "8px",
    // marginBottom: "32px",
  },
  section: {
    // padding: "8px",
    // marginBottom: "32px",
  },
  h1: {
    fontFamily: "Roboto-Black",
    // letterSpacing: "0.05em",
    // fontSize: "40px",
    // lineHeight: "40px",
    [breakpoints.desktop()]: {
      // fontSize: "60px",
      // lineHeight: "60px",
    },
  },
  h2: {
    fontFamily: "Roboto-Black",
    // fontSize: "30px",
    // lineHeight: "30px",
    // letterSpacing: "0.05em",
    [breakpoints.desktop()]: {
      // fontSize: "40px",
      // lineHeight: "40px",
    },
  },
  h3: {
    fontFamily: "Roboto-Black",
    // letterSpacing: "3px",
    // fontWeight: 900,
    // fontSize: "12px",
    // lineHeight: "12px",
    textTransform: "uppercase",
    [breakpoints.desktop()]: {
      // fontSize: "12px",
      // lineHeight: "12px",
    },
  },
  a: {
    textDecoration: "underline",
  },
  form: {
    textAlign: "-webkit-center",
  },
};

const base = {
  typography,
  transitions,
  breakpoints,
  headerHeight: "200px", // 168 + 32 (box-shadow)
  maxContentWidth: "640px",
  maxOuterWidth: "1080px",
  zIndex: {
    header: 10,
    backdrop: 2,
    dialog: 3,
  },
  borders: {
    borderRadius: "4px",
  },
};

const dark = {
  ...base,
  palette: {
    mode: "dark",
    background: {
      primary: colors.darkGrey,
      secondary: colors.mediumGrey,
      accent: {
        primary: colors.lightGreen,
        secondary: colors.darkGreen,
      },
      backdrop: "#00000080",
      error: colors.white,
      active: colors.white,
      disabled: colors.mediumGrey,
    },
    text: {
      primary: colors.white,
      secondary: colors.darkGrey,
      heading: {
        primary: colors.beige,
      },
      error: colors.red,
      active: colors.lightGreen,
      disabled: colors.white,
    },
    border: {
      primary: colors.mediumGrey,
      secondary: colors.blue,
    },
    action: {
      text: colors.white,
      background: colors.darkGrey,
      border: colors.mediumGrey,
    },
    actionHover: {
      text: colors.lightGreen,
      background: colors.white,
      border: colors.white,
    },
    ...colors,
  },
};

const themes = {
  dark,
  typography,
};

export default themes;
