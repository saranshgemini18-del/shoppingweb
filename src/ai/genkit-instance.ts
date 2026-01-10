import {genkit, type Plugin} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

const plugins: Plugin<any>[] = [];

if (process.env.GEMINI_API_KEY) {
  plugins.push(googleAI());
}

export const ai = genkit({
  plugins,
  enableTracingAndMetrics: true,
  logLevel: 'debug',
});
