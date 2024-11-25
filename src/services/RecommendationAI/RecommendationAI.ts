import { Movie } from '@prisma/client';
import { z } from 'zod';
import OpenAI from 'openai';
import { zodResponseFormat } from 'openai/helpers/zod';
import { ChatCompletionCreateParamsNonStreaming } from 'openai/resources';
import fetch from 'node-fetch';
import config from '../../config';
import { SEARCH_FUNCTION_NAME, tools } from './tools';

const Recommendation = z.object({
  movies: z.array(
    z.object({
      title: z.string(),
      year: z.number(),
    })
  ),
});

const MAX_DEFAULT = 20;
const MAX_TOKENS_DEFAULT = MAX_DEFAULT * 100;

class RecommendationAIService {
  private openai: OpenAI;
  private model: string;

  constructor(model = 'gpt-4o-mini-2024-07-18') {
    this.openai = new OpenAI();
    this.model = model;
  }

  async withTools(body: ChatCompletionCreateParamsNonStreaming) {
    let completion = await this.openai.chat.completions.create({
      ...body,
      tools,
      tool_choice: 'auto',
    });

    if (
      completion.choices[0]?.finish_reason === 'tool_calls' &&
      completion.choices[0].message.tool_calls
    ) {
      const toolCallResults = [];

      for (const toolCall of completion.choices[0].message.tool_calls) {
        try {
          if (toolCall.function.name === SEARCH_FUNCTION_NAME) {
            const args: { query: string } = JSON.parse(
              toolCall.function.arguments
            );

            const searchResponse = await fetch(
              'https://api.tavily.com/search',
              {
                headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  query: args.query,
                  api_key: config.tavilyApiKey,
                }),
                method: 'POST',
              }
            );

            const toolCallResult = {
              role: 'tool' as const,
              content: await searchResponse.text(),
              tool_call_id: toolCall.id,
            };

            toolCallResults.push(toolCallResult);
          } else {
            throw new Error(`Tool not found: ${toolCall.function.name}`);
          }
        } catch (e) {
          console.error(e);

          toolCallResults.push({
            role: 'tool' as const,
            content: 'ERROR',
            tool_call_id: toolCall.id,
          });
        }
      }

      completion = await this.openai.chat.completions.create({
        ...body,
        messages: [
          ...body.messages,
          completion.choices[0].message,
          ...toolCallResults,
        ],
      });
    }

    return completion;
  }

  async findSimilar(
    movies: Movie[],
    aboutUser?: string,
    max = MAX_DEFAULT,
    maxTokens = MAX_TOKENS_DEFAULT
  ) {
    const completion = await this.withTools({
      messages: [
        {
          role: 'system',
          content: `You are a recommentation API for movies. The user will provide you with a list of movies. You have to recommend them up to ${max} similar movies.`,
        },
        ...(aboutUser
          ? [
              {
                role: 'system',
                content: `The user provided the following info about themselves: "${aboutUser}". You don\'t have to use this information, but it might help you to provide better movie recommendations.`,
              },
            ]
          : ([] as any)),
        {
          role: 'user',
          content: `I have seen and liked the following movies: ${movies
            .map((one) => `${one.title} (${one.year})`)
            .join(', ')}. Recommend me something similar to watch.`,
        },
      ],
      model: this.model,
      max_tokens: maxTokens,
      response_format: zodResponseFormat(Recommendation, 'recommendation'),
    });

    const responseString = completion.choices[0]?.message?.content;

    if (!responseString) return [];
    return Recommendation.parse(JSON.parse(responseString)).movies;
  }

  async search(
    query: string,
    aboutUser?: string | null,
    max = MAX_DEFAULT,
    maxTokens = MAX_TOKENS_DEFAULT
  ) {
    const completion = await this.withTools({
      messages: [
        {
          role: 'system',
          content: `You're a smart search engine for movies. The user will send you a query and you have to find up to ${max} movies that are somehow relevant to that query.`,
        },
        ...(aboutUser
          ? [
              {
                role: 'system',
                content: `Not only results have to be relevant, they should also be personalized to the user if possible. These are the user preferences and info that they provided about themselves: "${aboutUser}". You don\'t have to use this information, but it might help you to provide better results.`,
              },
            ]
          : ([] as any)),
        {
          role: 'user',
          content: query,
        },
      ],
      model: this.model,
      max_tokens: maxTokens,
      response_format: zodResponseFormat(Recommendation, 'recommendation'),
    });

    const responseString = completion.choices[0]?.message?.content;

    if (!responseString) return [];
    return Recommendation.parse(JSON.parse(responseString)).movies;
  }
}

export default RecommendationAIService;
