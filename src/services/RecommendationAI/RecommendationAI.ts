import { List, Movie, User, UserLocation } from '@prisma/client';
import { z } from 'zod';
import OpenAI from 'openai';
import { zodResponseFormat } from 'openai/helpers/zod';
import { resolveToolCalls, tools } from './tools';
import {
  ChatCompletionStream,
  ChatCompletionStreamParams,
} from 'openai/lib/ChatCompletionStream';
import { parse as parsePartial, OBJ, ARR } from 'partial-json';

const Item = z.object({
  title: z.string(),
  year: z.number(),
});

const Response = z.object({
  movies: z.array(Item),
});

export type Response = z.infer<typeof Response>;
export type Item = Response['movies'][number];

type UserWithLocation = User & { location?: UserLocation };

type Context = {
  user?: UserWithLocation | null;
};

type Options = {
  maxResults?: number;
  maxTokens?: number;
};

const defaultOptions: Options = {
  maxResults: 20,
  maxTokens: 20 * 200,
};

class RecommendationAIService {
  private openai: OpenAI;
  private model: string;

  constructor(model = 'gpt-4o-mini-2024-07-18') {
    this.openai = new OpenAI();
    this.model = model;
  }

  async *chunks(stream: ChatCompletionStream<null>): AsyncGenerator<Item> {
    let content = '';
    let parsedItems: Item[] = [];
    for await (const chunk of stream) {
      content += chunk.choices[0]?.delta?.content ?? '';
      try {
        const parsedContent = parsePartial(content, OBJ | ARR);

        const validItems = (parsedContent?.movies as any[])?.reduce<Item[]>(
          (acc, cur) => {
            try {
              acc.push(Item.parse(cur));
            } catch (error) {
              // wait, this item is not fully ready
            } finally {
              return acc;
            }
          },
          [] as Item[]
        );

        const newItems = validItems.slice(
          parsedItems.length,
          validItems.length
        );

        for (const newItem of newItems) {
          yield newItem;
        }
        parsedItems = validItems;
      } catch (error) {
        // cannot parse, wait for more
      }
    }
  }

  async *resolve(body: ChatCompletionStreamParams) {
    let stream = this.openai.beta.chat.completions.stream({
      ...body,
      tools,
      tool_choice: 'auto',
    });

    yield* this.chunks(stream);

    await stream.done();
    let completion = await stream.finalChatCompletion();

    if (
      completion.choices[0]?.finish_reason === 'tool_calls' &&
      completion.choices[0].message.tool_calls
    ) {
      const toolCallResults = await resolveToolCalls(completion);
      stream = this.openai.beta.chat.completions.stream({
        ...body,
        messages: [
          ...body.messages,
          completion.choices[0].message,
          ...toolCallResults,
        ],
      });

      yield* this.chunks(stream);

      await stream.done();
      completion = await stream.finalChatCompletion();
    }
  }

  async *findSimilar(
    list: List & { movies: Movie[] },
    { user }: Context = {},
    options = defaultOptions
  ) {
    yield* this.resolve({
      messages: [
        {
          role: 'system',
          content: `You are a recommentation API for movies. The user will provide you with a list of movies. You have to recommend them up to ${options.maxResults} similar movies.`,
        },
        {
          role: 'user',
          content: `Here is the list of movies: ${list.movies
            .map((one) => `${one.title} (${one.year})`)
            .join(', ')}. This list is called "${list.title}". ${
            list.description ? `The description: ${list.description}.` : ''
          } Recommend me something similar to watch.`,
        },
      ],
      model: this.model,
      max_tokens: options.maxTokens,
      response_format: zodResponseFormat(Response, 'recommendation'),
    });
  }

  async *search(
    query: string,
    { user }: Context = {},
    options = defaultOptions
  ) {
    yield* this.resolve({
      messages: [
        {
          role: 'system',
          content: `You're a smart search engine for movies. The user will send you a query and you have to find up to ${
            options.maxResults
          } movies that are somehow relevant to that query. Today is ${new Date().toDateString()}.`,
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
      max_tokens: options.maxTokens,
      response_format: zodResponseFormat(Response, 'recommendation'),
    });
  }
}

export default RecommendationAIService;
