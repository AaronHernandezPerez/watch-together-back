# Watch together Backend

A quick prototype using fastify and webhooks to synchronise several players, using redis as a in memory storage

##.env

```env
FRONT_URL=http://localhost:8080
PROTOCOL=http://
HOST=0.0.0.0
PORT=8000
DISCORD_TOKEN=
REDIS_URL=
REDIS_PASSWORD=
```

## Run on local development

```bash
npm i
npm run dev
```

## Run on docker development

```bash
npm i
npm run up
npm run down
```

## Run on docker prod

```bash
# docker build --target production -t back .
# docker run -d --restart always -dp 8000:8000 watch-together-back
npm run build:prod
docker-compose up -d
```

### Absolute imports

Use tsconfig-paths

```bash
"serve": "ts-node -r tsconfig-paths/register src/app.ts",
"start": "node -r ts-node/register -r tsconfig-paths/register dist/index.js",
```

# Discord

### Add the bot to your server

```bash
https://discord.com/oauth2/authorize?client_id=870380141598093313&permissions=8&scope=bot%20applications.commands
```
