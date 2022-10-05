## Getting Started

### Install:
```bash
yarn install
```

### Prepare environment variables:
Duplicate `.env.example` file and rename it to just `.env`
THen reach out to team members to get hold of actual values to fill in the blanks.

### Run the development server:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.js`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Extend people-names with additional names:
This affects the filtering of whcih headlines that may be used. If any names are identified, we skip that headline due to possible violations.
For instance when presidents and such, needs to be added...

Modify this file:
`./node_modules/people-names/data/additional-names.json`

Then run the patch command in terminal:
```
./node_modules/.bin/patch-package people-names
```

This will add/update a apatch-file that is used during isntallation.
## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
