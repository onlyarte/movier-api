import { Movie } from '@prisma/client';
import OpenAI from 'openai';
import { AISearchResult } from './types';

const MAX_DEFAULT = 5;
const MAX_TOKENS_DEFAULT = 300;

class RecommendationAIService {
  private openai: OpenAI;
  private model: string;

  constructor(model = 'gpt-3.5-turbo') {
    this.openai = new OpenAI();
    this.model = model;
  }

  async findSimilar(
    movies: Movie[],
    max = MAX_DEFAULT,
    maxTokens = MAX_TOKENS_DEFAULT
  ) {
    const completion = await this.openai.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: `Act as a movie expert and recommend me some movies that I might like based on what I have already watched and liked. Here is the list of movies: ${movies
            .map((one) => `${one.title} (${one.year})`)
            .join(
              ', '
            )}. Respond with a JSON file of the following structure: [{ title, year }] containing maximum ${max} movies. Do not include anything else in the response except the json file.`,
        },
      ],
      model: this.model,
      max_tokens: maxTokens,
    });
    return JSON.parse(
      completion.choices[0]?.message.content ?? '[]'
    ) as AISearchResult[];
  }
}

export default RecommendationAIService;
