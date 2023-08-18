import { createClient } from 'microcms-js-sdk';

const serviceDomain = process.env.API_DOMAIN as string;
const apiKey = process.env.API_KEY as string;

export const client = createClient({
  serviceDomain: serviceDomain,
  apiKey: apiKey,
});