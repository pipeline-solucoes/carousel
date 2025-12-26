import { createTheme } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Palette {
    custom: {
      transparent: string;

      backgroundSectionMain: string;      
      backgroundSectionAlternative: string;
      backgroundSectionHighlight?: string;

      colorSectionMain: string;      

      backgroundButtonCTA: string,
      backgroundHoverButtonCTA: string,
      colorButtonCTA: string,
      colorHoverButtonCTA: string,
      borderRadiusButtonCTA: string,

      carouselColorIndicators: string,
      carouselColorFocus: string,
    };
  }
  interface PaletteOptions {
    custom?: {
      transparent: string;

      backgroundSectionMain: string;      
      backgroundSectionAlternative: string;
      backgroundSectionHighlight?: string;     

      backgroundButtonCTA: string,
      backgroundHoverButtonCTA: string,
      colorButtonCTA: string,
      colorHoverButtonCTA: string,
      borderRadiusButtonCTA: string,

      carouselColorIndicators: string,
      carouselColorFocus: string,
    };
  }
}

// Definindo o tema personalizado
const theme = createTheme({
  breakpoints: { 
    values: { 
      xs: 0, // Extra small devices (phones) 
      sm: 600, // Small devices (tablets) 
      md: 960, // Medium devices (desktops) 
      lg: 1280, // Large devices (large desktops) 
      xl: 1920, // Extra large devices (extra large desktops) 
    }, 
  },  
  shape: { 
    borderRadius: 8,  
  },
  palette: {
    primary: {
      main: "#3f4f44" , 
      dark: "#1e2a24" , 
      contrastText: "#ffffff" 
    },
    secondary: {
      main: '#8c6d32', 
      light: '#b68d40', 
      contrastText: "#ffffff" 
    },    
    text: {
      primary: '#555f56',
      secondary: '#ffffff',
      disabled: '#707070',
    },       
    custom: {
      transparent: '#00000000',

      backgroundSectionMain: '#ffffff',
      backgroundSectionAlternative: '#ede8de',      

      backgroundButtonCTA: "#D9D9D950",
      backgroundHoverButtonCTA: '#b68d40',
      colorButtonCTA: '#ffffff',
      colorHoverButtonCTA: '#ffffff',
      borderRadiusButtonCTA: "25px",  
      
      carouselColorIndicators: 'gray',
      carouselColorFocus: '#8c6d32',
    },
    info: {
      main: '#4CAF50',
    },
    error: {
      main: '#F44336',
    }    
  },
  typography: {
    fontFamily: 'Inter, Arial, sans-serif',
    h1: {         
      fontSize: '56px', // Desktop     
      lineHeight: '0.5',
      letterSpacing: '0.01em',
      fontWeight: 600,
      margin: 0,
      fontStyle: 'normal',
      color: '#ffffff',
      padding: '8px 0px',    
      '@media (min-width:601px) and (max-width:960px)': {
        fontSize: '46px', // Tablet
      },
      '@media (max-width:600px)': {
        fontSize: '36px', // Mobile
      },
    },
    h2: {      
      fontSize: '20px', // Desktop
      lineHeight: '1.5',
      letterSpacing: '0.01em',
      fontWeight: 400,
      margin: 0,
      color: '#ffffff',    
      '@media (min-width:601px) and (max-width:960px)': {
        fontSize: '20px', // Tablet
      },
      fontStyle: 'normal',
      '@media (max-width:600px)': {
        fontSize: '16px', // Mobile
      },
    },
    h3: {
      fontSize: '28px', // Desktop
      lineHeight: '1.5',
      letterSpacing: '0.01em',
      fontWeight: 600,
      margin: 0,
      fontStyle: 'normal',      
      '@media (min-width:601px) and (max-width:960px)': {
        fontSize: '28px', // Tablet
      },
      '@media (max-width:600px)': {
        fontSize: '28px', // Mobile
      },
    },
    h4: {
      fontSize: '20px', // Desktop
      lineHeight: '1.5',
      letterSpacing: '0.01em',
      fontWeight: 600,
      margin: 0,
      fontStyle: 'normal',      
      '@media (min-width:601px) and (max-width:960px)': {
        fontSize: '20px', // Tablet
      },
      '@media (max-width:600px)': {
        fontSize: '20px', // Mobile
      },
    },
    body1: { //Normal
      fontSize: '16px', // Desktop
      lineHeight: '1.5',
      letterSpacing: '0.01em',
      fontWeight: 400,      
      fontStyle: 'normal',      
      '@media (min-width:601px) and (max-width:960px)': {
        fontSize: '16px', // Tablet
      },
      '@media (max-width:600px)': {
        fontSize: '16px', // Mobile
      },
    },
    body2: { //Destaque
      fontSize: '16px', // Desktop
      lineHeight: '1.5',
      letterSpacing: '0.01em',
      fontWeight: 600,     
      fontStyle: 'normal',      
      '@media (min-width:601px) and (max-width:960px)': {
        fontSize: '16px', // Tablet
      },
      '@media (max-width:600px)': {
        fontSize: '16px', // Mobile
      },
    },
  },
  spacing: 8,
});

export { theme };