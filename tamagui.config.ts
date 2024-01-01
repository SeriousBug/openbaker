import { shorthands } from "@tamagui/shorthands";
import { createAnimations } from "@tamagui/animations-moti";
import { themes, tokens } from "@tamagui/themes";
import { createTamagui } from "tamagui";
import { createInterFont } from "@tamagui/font-inter";

const headingFont = createInterFont();
const bodyFont = createInterFont();
const animations = createAnimations({
  fast: {
    type: "spring",
    damping: 20,
    mass: 1.2,
    stiffness: 250,
  },
  medium: {
    type: "spring",
    damping: 10,
    mass: 0.9,
    stiffness: 100,
  },
  slow: {
    type: "spring",
    damping: 20,
    stiffness: 60,
  },
});

const appConfig = createTamagui({
  themes,
  defaultTheme: "light",
  shouldAddPrefersColorThemes: true,
  themeClassNameOnRoot: false,
  tokens,
  shorthands,
  fonts: {
    bodyFont,
    headingFont,
    body: bodyFont,
    heading: headingFont,
  },
  animations,
});
export type AppConfig = typeof appConfig;
declare module "tamagui" {
  interface TamaguiCustomConfig extends AppConfig {}
}
export default appConfig;
