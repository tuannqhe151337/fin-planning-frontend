import colors from "tailwindcss/colors";
import { createThemes } from "tw-colors";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/tw-elements-react/dist/js/**/*.js",
  ],
  theme: {
    extend: {
      fontFamily: {
        nunito: ["Nunito", "sans-serif"],
      },
    },
  },
  darkMode: ["class"],
  plugins: [
    // Don't know why but without it, the tooltip seems to work just fine
    // but with it the plugin tw-colors just broken
    // require("tw-elements-react/dist/plugin.cjs"),
    createThemes({
      blue: {
        primary: colors.sky,
        secondary: colors.emerald,
      },
      "blue-flatten": {
        primary: colors.sky["500"],
        secondary: colors.emerald["500"],
      },
      emerald: {
        primary: colors.emerald,
        secondary: colors.sky,
      },
      "emerald-flatten": {
        primary: colors.emerald["500"],
        secondary: colors.sky["500"],
      },
      teal: {
        primary: colors.teal,
        secondary: colors.cyan,
      },
      "teal-flatten": {
        primary: colors.teal["500"],
        secondary: colors.cyan["500"],
      },
      cyan: {
        primary: colors.cyan,
        secondary: colors.teal,
      },
      "cyan-flatten": {
        primary: colors.cyan["500"],
        secondary: colors.teal["500"],
      },
      purple: {
        primary: colors.violet,
        secondary: colors.indigo,
      },
      "purple-flatten": {
        primary: colors.violet["500"],
        secondary: colors.indigo["500"],
      },
      orange: {
        primary: colors.orange,
        secondary: colors.lime,
      },
      "orange-flatten": {
        primary: colors.orange["500"],
        secondary: colors.lime["500"],
      },
      rose: {
        primary: colors.pink,
        secondary: colors.fuchsia,
      },
      "rose-flatten": {
        primary: colors.pink["400"],
        secondary: colors.fuchsia["400"],
      },
    }),
  ],
};
