# Yogendra AI Editing Backend

Vercel serverless API:
- POST /api/script
- POST /api/voice
- POST /api/image
- GET /api/health

Set OPENAI_API_KEY in Vercel Project Settings -> Environment Variables.
Never put the key in browser JavaScript or commit it to GitHub.

This backend generates scene JSON, speech audio, and AI images. Final MP4 assembly can be added as a separate render service; Vercel serverless functions are not intended to be a full video-rendering workstation.
