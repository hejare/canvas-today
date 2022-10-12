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

const buttonsShared = {
  letterSpacing: "3px",
  fontFamily: "Ano, sans-serif",
  fontSize: "12px",
  fontWeight: 900,
  textTransform: "uppercase",
  padding: "20px 40px",
};

const buttons = [
  {
    props: { variant: "contained" },
    style: {
      ...buttonsShared,
    },
  },
  {
    props: { variant: "outlined" },
    style: {
      ...buttonsShared,
      border: "2px solid",
      "&:hover": {
        border: "2px solid",
      },
      "&:disabled": {
        opacity: 0.5,
      },
    },
  },
  {
    props: { variant: "text" },
    style: {
      ...buttonsShared,
    },
  },
];

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
    fontFamily: "Gilroy-Regular",
    fontSize: "10px",
    lineHeight: "12px",
    letterSpacing: "0.46px",
    [breakpoints.desktop()]: {
      fontSize: "12px",
      lineHeight: "17px",
    },
  },
  main: {
    border: "2px solid grey",
    padding: "8px",
    marginBottom: "32px",
  },
  section: {
    border: "2px solid grey",
    padding: "8px",
    marginBottom: "32px",
  },
  h1: {
    letterSpacing: "0.05em",
    fontSize: "40px",
    lineHeight: "40px",
    [breakpoints.desktop()]: {
      fontSize: "60px",
      lineHeight: "60px",
    },
  },
  h2: {
    fontSize: "30px",
    lineHeight: "30px",
    letterSpacing: "0.05em",
    [breakpoints.desktop()]: {
      fontSize: "40px",
      lineHeight: "40px",
    },
  },
  h3: {
    letterSpacing: "3px",
    fontWeight: 900,
    fontSize: "12px",
    lineHeight: "12px",
    textTransform: "uppercase",
    [breakpoints.desktop()]: {
      fontSize: "12px",
      lineHeight: "12px",
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
  headerHeight: "60px",
  maxContentWidth: "640px",
  zIndex: {
    backdrop: 2,
    dialog: 3,
  },
  padding: {
    vertical: "30px",
    horizontal: "60px",
  },
  borders: {
    borderRadius: "4px",
  },
  components: {
    MuiButton: {
      variants: buttons,
    },
    MuiTableCell: {
      styleOverrides: {
        root: typography.body1, // since body2 is default by MUI
      },
    },
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
      error: colors.white,
      active: colors.white,
    },
    text: {
      primary: colors.white,
      secondary: colors.darkGrey,
      heading: {
        primary: colors.beige,
      },
      error: colors.red,
      active: colors.lightGreen,
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
