import * as process from 'node:process';

const api_secret = process.env.GA4_SECRET;
const measurement_id = process.env.GA4_MEASUREMENT_ID;

export const deliverToGA = async (action: string, category: string, parameter: string, userId: string, gaClientId: string) => {
  return await fetch(`https://www.google-analytics.com/mp/collect?measurement_id=${measurement_id}&api_secret=${api_secret}`, {
    method: "POST",
    body: JSON.stringify({
      user_id: userId,
      client_id: gaClientId,
      events: [{
        name: action,
        params: {
          category: category,
          parameter: parameter,
        },
      }]
    })
  });
}