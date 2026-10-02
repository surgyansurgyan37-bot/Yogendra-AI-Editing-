# Yogendra AI Editing – OpenAI setup

## Vercel Environment Variables
Add these variables in your Vercel project under Settings → Environment Variables:

- `OPENAI_API_KEY` = your OpenAI API key
- `OPENAI_MODEL` = `gpt-6-luna` (or another model available to your API account)

Redeploy after saving the variables.

## Important
The browser Render Video button is local and does not require the OpenAI API. The AI Script button calls `/api/generate-script` and requires `OPENAI_API_KEY`.

The API function uses CommonJS syntax for broad Vercel Node.js compatibility and avoids the previous `Unexpected reserved word` parsing problem.
