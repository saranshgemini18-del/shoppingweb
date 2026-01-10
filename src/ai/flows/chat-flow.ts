
'use server';
/**
 * @fileoverview A chatbot flow that responds to user messages.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MessageSchema = z.object({
  role: z.enum(['user', 'model']),
  content: z.string(),
});

const ChatInputSchema = z.array(MessageSchema);
export type ChatInput = z.infer<typeof ChatInputSchema>;

export async function chat(history: ChatInput): Promise<string> {
  return chatFlow(history);
}

const chatFlow = ai.defineFlow(
  {
    name: 'chatFlow',
    inputSchema: ChatInputSchema,
    outputSchema: z.string(),
  },
  async messages => {
    const systemPrompt =
      'You are a helpful and friendly e-commerce assistant for an online store called Bharat Bazaar that sells exquisite Indian products. Do not refer to yourself as a language model. Be concise with your answers.';
    
    const llmResponse = await ai.generate({
      model: 'googleai/gemini-1.5-flash-latest',
      prompt: {
        system: systemPrompt,
        messages: messages.map((message) => ({
          role: message.role,
          content: [{ text: message.content }],
        })),
      },
      config: {
        temperature: 0.3,
      },
    });
    
    return llmResponse.text;
  }
);
