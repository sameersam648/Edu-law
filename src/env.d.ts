declare module 'react-native-config' {
    export interface NativeConfig {
      GROQ_API_KEY: string;
      // Add other environment variables here as needed
    }
  
    export const Config: NativeConfig;
    export default Config;
  }