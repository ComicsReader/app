
# ComicsReader API Proxy Server

The proxy server for ComicsReader app.

## Setup

```bash
npm install
cp .sample.env .env
```

and edit the file

## Start

```bash
npm run dev
npm run build # build es6 javascript using babel
```

## Endpoints

```bash
curl \
  -H "Content-Type: application/json" \
  -H "Authorization: Token API_TOKEN_HERE" \
  -X POST \
  -d \
   '{
       "function": "fetchComicsInfo",
      "args": {
        "comicID": "manhua-dongjingshishi"
      }
   }' \
  http://localhost:3000/api
```

## Deployment

