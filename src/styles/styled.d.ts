import { PaletteOptions as Palette } from '@material-ui/core/styles/createPalette';
import theme from './colors.js';
import 'styled-components';

declare module 'styled-components' {
  type ThemeType = typeof theme.palette;
  export interface DefaultTheme {
    palette: ThemeType;
  }
}
