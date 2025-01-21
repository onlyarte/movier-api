import fetch from 'node-fetch';
import {
  ChatCompletionTool,
  ChatCompletionToolMessageParam,
} from 'openai/resources';
import config from '../../config';
import { ParsedChatCompletion } from 'openai/resources/beta/chat/completions';

export const SEARCH_FUNCTION_NAME = 'searchInternet';

export const tools: ChatCompletionTool[] = [
  {
    type: 'function',
    function: {
      name: SEARCH_FUNCTION_NAME,
      description: `This function enables you to call an internet search engine. Use it only if the user asks you about recent events`,
      parameters: {
        type: 'object',
        properties: {
          query: {
            type: 'string',
            description: 'Search query',
          },
        },
        required: ['query'],
        additionalProperties: false,
      },
    },
  },
];

type SearchArguments = {
  query: string;
};

const search = async ({ query }: SearchArguments) => {
  const searchResponse = await fetch('https://api.tavily.com/search', {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query,
      max_results: 10,
      include_raw_content: true,
      api_key: config.tavilyApiKey,
    }),
    method: 'POST',
  });

  return await searchResponse.text();
};

export const callFunction = async (
  name: string,
  parsedArguments: unknown
): Promise<string> => {
  switch (name) {
    case SEARCH_FUNCTION_NAME:
      return await search(parsedArguments as SearchArguments);
    default:
      throw new Error('No function found');
  }
};

export const resolveToolCalls = async (
  completion: ParsedChatCompletion<null>
) => {
  const toolCallResults: ChatCompletionToolMessageParam[] = [];

  await Promise.all(
    completion.choices[0].message.tool_calls.map(async (toolCall) => {
      console.log(
        `Tool call: #${toolCall.id} ${toolCall.function.name}(${toolCall.function.arguments})`
      );
      try {
        const result = await callFunction(
          toolCall.function.name,
          toolCall.function.parsed_arguments
        );
        console.log(
          `Tool call #${toolCall.id} has been successfully completed`
        );

        toolCallResults.push({
          role: 'tool',
          content: result,
          tool_call_id: toolCall.id,
        });
      } catch (e) {
        console.error(e);
        console.log(
          `Tool call #${toolCall.id} has failed. See the error message above`
        );

        toolCallResults.push({
          role: 'tool',
          content: 'ERROR',
          tool_call_id: toolCall.id,
        });
      }
    })
  );

  return toolCallResults;
};
