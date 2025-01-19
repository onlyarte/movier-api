import { ChatCompletionTool } from 'openai/resources';

export const SEARCH_FUNCTION_NAME = 'searchInternet';

export const GEO_LOCATION = 'geoLocation';

export const CURRENT_TIME = 'currentTime';

export const tools: ChatCompletionTool[] = [
  // Attach this data to the original message rather than as a function
  // {
  //   type: 'function',
  //   function: {
  //     name: CURRENT_TIME,
  //     description:
  //       'Call this function when you need to know the current date and time',
  //   },
  // },
  // {
  //   type: 'function',
  //   function: {
  //     name: GEO_LOCATION,
  //     description:
  //       "Call this function if you need to know the user's country, region, city, or timezone",
  //   },
  // },
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
