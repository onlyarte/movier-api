import { ChatCompletionTool } from 'openai/resources';

export const SEARCH_FUNCTION_NAME = 'searchInternet';

export const tools: ChatCompletionTool[] = [
  {
    type: 'function',
    function: {
      name: SEARCH_FUNCTION_NAME,
      description:
        "This function enables you to call an internet search engine. Call this function only when the user is asking you about recent or constantly changing data.",
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
