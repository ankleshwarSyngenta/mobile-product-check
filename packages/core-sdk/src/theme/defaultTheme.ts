import { VerificationTheme } from './types';

export const defaultTheme: VerificationTheme = {
  colors: {
    background: '#FFFFFF',
    text: '#222222',
    success: '#0E9F6E',
    error: '#D92D20',
    warning: '#F79009',
    accent: '#006644',
  },
  spacing: (factor: number) => factor * 8,
  borderRadius: 8,
  icons: {
    success: '✅',
    error: '❌',
    warning: '⚠️',
  },
  messages: {
    success: 'This product is authentic and registered with Syngenta.',
    error: 'Non Syngenta product',
    warning: 'Potential counterfeit detected. Please escalate.',
  },
};
