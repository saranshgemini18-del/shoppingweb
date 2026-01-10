
'use server';
/**
 * @fileOverview An AI flow for performing visual search on products.
 *
 * - visualSearch - A function that handles the product identification from an image.
 * - VisualSearchInput - The input type for the visualSearch function.
 * - VisualSearchOutput - The return type for the visualSearch function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const VisualSearchInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a product, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type VisualSearchInput = z.infer<typeof VisualSearchInputSchema>;

const VisualSearchOutputSchema = z.object({
  searchTerm: z.string().describe('A concise search term for the identified product, such as "Silk Saree" or "Gold Earrings".'),
});
export type VisualSearchOutput = z.infer<typeof VisualSearchOutputSchema>;

export async function visualSearch(input: VisualSearchInput): Promise<VisualSearchOutput> {
  return visualSearchFlow(input);
}

const prompt = ai.definePrompt({
  name: 'visualSearchPrompt',
  model: 'googleai/gemini-1.5-flash-latest',
  input: { schema: VisualSearchInputSchema },
  output: { schema: VisualSearchOutputSchema },
  prompt: `You are an expert at identifying Indian apparel, jewelry, and home decor from images. Analyze the provided image and generate a short, generic search term (2-3 words) that could be used to find similar products in an e-commerce store.

For example, if you see a red Banarasi saree, the search term should be "Silk Saree". If you see a blue men's kurta, the search term should be "Mens Kurta".

Image: {{media url=photoDataUri}}`,
});

const visualSearchFlow = ai.defineFlow(
  {
    name: 'visualSearchFlow',
    inputSchema: VisualSearchInputSchema,
    outputSchema: VisualSearchOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) {
      throw new Error('Unable to identify a product from the image.');
    }
    return output;
  }
);
