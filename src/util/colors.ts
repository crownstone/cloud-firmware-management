import {hex2rgb, hsv2hex, rgb2hex, rgb2hsv} from "./ColorConverters";


interface color {
  hex:string,
  rgb?:{r:number,g:number,b:number},
  rgba?(number) : string,
  name?: string,
  hsv?:string,
  blend?(color, number) : color,
  hsvBlend?(color, number) : color,
}

interface colorInterface {
  csBlue:        color,
  csBlueDark:    color,
  csBlueDarker:  color,
  csBlueLight:   color,
  csBlueLighter: color,
  csBlueLightDesat:   color,
  csOrange:      color,
  darkCsOrange:  color,
  lightCsOrange: color,
  menuBackground:       color,
  menuBackgroundDarker: color,
  menuText:             color,
  menuTextSelected:     color,
  menuTextSelectedDark: color,
  white:        color,
  black:        color,
  gray:         color,
  notConnected: color,
  darkGray:     color,
  darkGray2:    color,
  lightGray2:   color,
  lightGray:    color,
  purple:       color,
  darkPurple:   color,
  darkerPurple: color,
  blue:         color,
  blue2:        color,
  green:        color,
  green2:       color,
  lightGreen:   color,
  lightGreen2:  color,
  darkGreen:    color,
  orange:       color,
  red:          color,
  darkRed:      color,
  menuRed:      color,
  iosBlue:      color,
  iosBlueDark:  color,
  lightBlue:    color,
  lightBlue2:   color,
  blinkColor1:  color,
  blinkColor2:  color,
  random() : any
}


export let colors : colorInterface = {
  csBlue:               {hex:'#003E52'},
  csBlueDark:           {hex:'#00283c'},
  csBlueDarker:         {hex:'#00212b'},
  csBlueLight:          {hex:'#006f84'},
  csBlueLighter:        {hex:'#00b6cd'},
  csBlueLightDesat:     {hex:'#2c9aa8'},
  csOrange:             {hex:'#ff8400'},
  darkCsOrange:         {hex:'#d97500'},
  lightCsOrange:        {hex:'#ffa94d'},
  // menuBackground:       {hex:'#00263e'},
  menuBackground:       {hex:'#00283c'},
  menuBackgroundDarker: {hex:'#00172c'},
  // menuBackgroundDarker: {hex:'#001122'},
  menuText:             {hex:'#fff'},
  menuTextSelected:     {hex:'#2daeff'},
  menuTextSelectedDark: {hex:'#2472ad'},
  white:                {hex:'#fff'},
  black:                {hex:'#000'},
  gray:                 {hex:'#ccc'},
  notConnected:         {hex:'#00283c'},
  darkGray:             {hex:'#555'},
  darkGray2:            {hex:'#888'},
  lightGray2:           {hex:'#dedede'},
  lightGray:            {hex:'#eee'},
  purple:               {hex:'#8a01ff'},
  darkPurple:           {hex:'#5801a9'},
  darkerPurple:         {hex:'#2a0051'},
  blue:                 {hex:'#0075c9'},
  blue2:                {hex:'#2698e9'},
  green:                {hex:'#a0eb58'},
  green2:               {hex:'#4cd864'},
  lightGreen2:          {hex:'#bae97b'},
  lightGreen:           {hex:'#caff91'},
  darkGreen:            {hex:'#1f4c43'},
  orange:               {hex:'#ff953a'},
  red:                  {hex:'#ff3c00'},
  darkRed:              {hex:'#cc0900'},
  menuRed:              {hex:'#e00'},
  iosBlue:              {hex:'#007aff'},
  iosBlueDark:          {hex:'#002e5c'},
  lightBlue:            {hex:'#a9d0f1'},
  lightBlue2:           {hex:'#77c2f7'},
  blinkColor1:          {hex:'#2daeff'},
  blinkColor2:          {hex:'#a5dcff'},
  random: () => {}
};

for (let color in colors) {
  if (colors.hasOwnProperty(color)) {
    if (color !== "random") {
      populateColorObject(colors[color], color)
    }
  }
}


let allColors = Object.keys(colors);

colors.random = function() {
  return colors[allColors[Math.floor(Math.random()*allColors.length)]]
};
~``;
function populateColorObject(clr, color) {
  clr.name = color;
  clr.rgb = hex2rgb(clr.hex);
  clr.hsv = rgb2hsv(clr.rgb.r,clr.rgb.g,clr.rgb.b);
  clr.rgba = (opacity) => { opacity = Math.min(1,opacity); return 'rgba(' + clr.rgb.r + ',' + clr.rgb.g + ',' + clr.rgb.b + ',' + opacity + ')'};
  /**
   * Factor 0 means fully initial color, 1 means fully other color
   * @param otherColor
   * @param factor
   * @returns {{name: string; hex: string; rgb: {r: number; g: number; b: number}; rgba: (opacity) => string}}
   */
  clr.blend = (otherColor, factor) => {
    factor = Math.max(0,Math.min(1,factor));
    let red   = Math.floor((1-factor) * clr.rgb.r + factor * otherColor.rgb.r);
    let green = Math.floor((1-factor) * clr.rgb.g + factor * otherColor.rgb.g);
    let blue  = Math.floor((1-factor) * clr.rgb.b + factor * otherColor.rgb.b);
    return populateColorObject({hex:rgb2hex(red, green, blue)},'blend:'+color+"_"+otherColor.name+"_"+factor)
  };
  clr.hsvBlend = (otherColor, factor) => {
    factor = Math.max(0,Math.min(1,factor));
    let h = (1-factor) * clr.hsv.h + factor * otherColor.hsv.h;``;
    let s = (1-factor) * clr.hsv.s + factor * otherColor.hsv.s;
    let v = (1-factor) * clr.hsv.v + factor * otherColor.hsv.v;

    let newColor = hsv2hex(h,s,v);
    return populateColorObject({hex:newColor},'hsv_blend:'+color+"_"+otherColor.name+"_"+factor)
  };

  // clr.hsl = rgb2hsl(clr.rgb.r,clr.rgb.g,clr.rgb.b);
  // clr.hcl = rgb2hcl(clr.rgb.r,clr.rgb.g,clr.rgb.b);

  return clr;
}
