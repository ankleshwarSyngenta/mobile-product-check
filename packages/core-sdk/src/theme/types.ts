export interface VerificationTheme {
  colors: {
    background: string;
    text: string;
    success: string;
    error: string;
    warning: string;
    accent: string;
  };
  spacing: (factor: number) => number;
  borderRadius: number;
  icons: {
    success: string;
    error: string;
    warning: string;
  };
  messages: {
    success: string;
    error: string;
    warning: string;
  };
}
