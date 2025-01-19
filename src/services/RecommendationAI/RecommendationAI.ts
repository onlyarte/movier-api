import { Movie, User, UserLocation } from '@prisma/client';
import { z } from 'zod';
import OpenAI from 'openai';
import { zodResponseFormat } from 'openai/helpers/zod';
import {
  ChatCompletionCreateParamsNonStreaming,
  ChatCompletionToolMessageParam,
} from 'openai/resources';
import fetch from 'node-fetch';
import config from '../../config';
import {
  CURRENT_TIME,
  GEO_LOCATION,
  SEARCH_FUNCTION_NAME,
  tools,
} from './tools';

type UserWithLocation = User & { location?: UserLocation };

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
const MAX_TOOL_CALLS = 1;

class RecommendationAIService {
  private openai: OpenAI;
  private model: string;

  constructor(model = 'gpt-4o-mini-2024-07-18') {
    this.openai = new OpenAI();
    this.model = model;
  }

  async withTools(
    body: ChatCompletionCreateParamsNonStreaming,
    context?: { user?: UserWithLocation | null }
  ) {
    let completion = await this.openai.chat.completions.create({
      ...body,
      tools,
      tool_choice: 'auto',
    });

    let toolsCalled = 0;
    while (
      completion.choices[0]?.finish_reason === 'tool_calls' &&
      completion.choices[0].message.tool_calls
    ) {
      const toolCallResults: ChatCompletionToolMessageParam[] = [];

      for (const toolCall of completion.choices[0].message.tool_calls) {
        console.log(`Tool call: ${toolCall.function.name}`);
        try {
          if (toolCall.function.name === SEARCH_FUNCTION_NAME) {
            const args: { query: string } = JSON.parse(
              toolCall.function.arguments
            );
            console.log(`Looking for ${args.query}`);

            const searchResponse = await fetch(
              'https://api.tavily.com/search',
              {
                headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  query: args.query,
                  max_results: 10,
                  include_raw_content: true,
                  api_key: config.tavilyApiKey,
                }),
                method: 'POST',
              }
            );

            toolCallResults.push({
              role: 'tool',
              content: await searchResponse.text(),
              tool_call_id: toolCall.id,
            });
          } else if (toolCall.function.name === GEO_LOCATION) {
            toolCallResults.push({
              role: 'tool' as const,
              content: context?.user?.location
                ? JSON.stringify(context.user.location)
                : 'Unavailable',
              tool_call_id: toolCall.id,
            });
          } else if (toolCall.function.name === CURRENT_TIME) {
            toolCallResults.push({
              role: 'tool' as const,
              content: new Date().toISOString(),
              tool_call_id: toolCall.id,
            });
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
        } finally {
          toolsCalled++;
        }
      }

      completion = await this.openai.chat.completions.create({
        ...body,
        ...(toolsCalled < MAX_TOOL_CALLS
          ? {
              tools,
              tool_choice: 'auto',
            }
          : {}),
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
    user?: UserWithLocation | null,
    max = MAX_DEFAULT,
    maxTokens = MAX_TOKENS_DEFAULT
  ) {
    const completion = await this.withTools(
      {
        messages: [
          {
            role: 'system',
            content: `You are a recommentation API for movies. The user will provide you with a list of movies. You have to recommend them up to ${max} similar movies.`,
          },
          ...(user?.about
            ? [
                {
                  role: 'system',
                  content: `The user provided the following info: "${user.about}". You don\'t have to use this information, but it might help you to provide better movie recommendations.`,
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
      },
      { user }
    );

    const responseString = completion.choices[0]?.message?.content;

    if (!responseString) return [];
    return Recommendation.parse(JSON.parse(responseString)).movies;
  }

  async search(
    query: string,
    user?: UserWithLocation | null,
    max = MAX_DEFAULT,
    maxTokens = MAX_TOKENS_DEFAULT
  ) {
    const completion = await this.withTools(
      {
        messages: [
          {
            role: 'system',
            content: `You're a smart search engine for movies. The user will send you a query and you have to find up to ${max} movies that are somehow relevant to that query. Today is ${new Date().toDateString()}.`,
          },
          ...(user?.about || user?.location?.country
            ? [
                {
                  role: 'system',
                  content: `Not only results have to be relevant, they should also be personalized to the user if possible. ${
                    user.about
                      ? `These are the user preferences and info that they provided: ${user.about}.`
                      : ''
                  } ${
                    user.location?.country
                      ? `The user is currently in ${
                          user.location.city ?? 'unknown city'
                        }, ${user.location.country}`
                      : ''
                  } You don\'t have to use this information, but it might help you to provide better results.`,
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
      },
      { user }
    );

    const responseString = completion.choices[0]?.message?.content;

    if (!responseString) return [];
    return Recommendation.parse(JSON.parse(responseString)).movies;
  }
}

export default RecommendationAIService;
