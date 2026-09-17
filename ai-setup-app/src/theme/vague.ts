// Vague theme ANSI colors
export const theme = {
  // Base
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  dim: "\x1b[2m",
  italic: "\x1b[3m",
  underline: "\x1b[4m",

  // Foreground
  fg: "\x1b[38;2;205;205;205m",         // #cdcdcd
  fgDim: "\x1b[38;2;96;96;121m",        // #606079
  fgMuted: "\x1b[38;2;120;120;140m",    // Muted grey

  // Accents
  blue: "\x1b[38;2;110;148;178m",       // #6e94b2 (Active focus / Vague Blue)
  cyan: "\x1b[38;2;126;156;216m",       // #7e9cd8
  green: "\x1b[38;2;135;169;135m",      // #87a987
  red: "\x1b[38;2;224;108;117m",        // #e06c75
  yellow: "\x1b[38;2;229;192;123m",     // #e5c07b
  purple: "\x1b[38;2;198;120;221m",     // #c678dd

  // Borders
  borderInactive: "\x1b[38;2;37;37;48m", // #252530 (Subtle dark border)
  borderActive: "\x1b[38;2;110;148;178m", // #6e94b2 (Highlighted active pane border)

  // Background
  bg: "\x1b[48;2;20;20;21m",            // #141415
  bgHighlight: "\x1b[48;2;37;37;48m",   // #252530
};
