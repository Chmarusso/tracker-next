## Planning 
* Init Node.js backend project with basic configuration (low)
* Setup Prisma and create basic DB schema for events (low)
* Add public endpoint for accepting events (low)
* Configure GA for server-side (low)
* Push events to GA (medium)
* Prepare deployment instructions (low)
* Integrate tracking endpoint with jumper frontend (medium)

## Stack
* [Next.js](https://nextjs.org/) - Fullstack React framework
* [Prisma](https://www.prisma.io) - is a next-generation Node.js and TypeScript ORM that unlocks a new level of developer experience when working with databases thanks to its intuitive data model, automated migrations, type-safety & auto-completion.
* [Neon](https://neon.tech/) - fully managed serverless Postgres with a generous free tier.
* [Vercel](https://vercel.com/) - platform that allows developers to build and deploy web projects with ease. Global CDN, custom domains, automatic HTTPS and more. 

## How to setup?
- Check `.env.example` for needed stuff and configure your own `.env` file
- Install dependencies
- Generate prisma client `npx prisma generate`
- Push required schema into configured PostgreSQL db `npx prisma db push`

## How to run locally?
```
npm run dev
```
```
curl --location 'http://localhost:3000/api/tracking' \
--header 'Content-Type: application/json' \
--data '{
    "action": "cat_wallet",
    "category": "action_connect_wallet",
    "userId": "vitalik.eth",
    "parameter": "param_wallet"
}'
```

## How to test online?
```
curl --location 'https://next-tracker-kappa.vercel.app/api/tracking' \
--header 'Content-Type: application/json' \
--data '{
    "action": "cat_wallet",
    "category": "action_connect_wallet",
    "userId": "vitalik.eth",
    "parameter": "param_wallet"
}'
```

## How to integrate with jumper.exchange?
```javascript
  // src/hooks/userTracking/useUserTracking.ts

  const gaServerTrack = async (action, category, label) => {
    window.gtag('get', process.env.VITE_GOOGLE_ANALYTICS_TRACKING_ID, 'client_id', (clientID) => {
      fetch("https://next-tracker-kappa.vercel.app/api/tracking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          "action": action,
          "category": category,
          "userId": account ?? getFingerPrint(), 
          // getFingerPrint() may return unique identifier for the user (based on ip, user agents, etc.)
          "parameter": label,
          "gaClientId": clientID,
        }),
      });
    });
  }

  const trackEvent = useCallback(
    async ({
      action,
      category,
      label,
      value,
      data,
      disableTrackingTool,
    }: TrackEventProps) => {
      if (!disableTrackingTool?.includes(EventTrackingTool.GA)) {
        window.gtag('event', action, {
          category: category,
          ...data,
        });
        await gaServerTrack(action, category, label, value);
      }
      // other trackers
    }
    [arcx, cookie3],
  );

```

## TODO
- configure CORS 
- consider auth tokens 
- better validation for action / categories 
- add tests (unit in jest, e2e in playwright)
- prepare PR into jumper repository