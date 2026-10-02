# Yogendra AI Editing — Login Module

यह module आपके existing Video Maker में:
- Email/Password Sign Up + Login
- Google Login
- Logout
- My Projects
- Project save in Supabase
जोड़ने के लिए है।

## 1. Supabase
Supabase में नया project बनाएं।

## 2. Database
Supabase → SQL Editor में `supabase-schema.sql` का पूरा SQL run करें।

## 3. Login configuration
`supabase-config.js` में:
- YOUR_SUPABASE_URL
- YOUR_SUPABASE_ANON_OR_PUBLISHABLE_KEY
भरें।

Service-role/secret key कभी browser में न डालें।

## 4. Google Login
Supabase Authentication → Providers → Google में Google provider configure करें।
अपने deployed Vercel domain को redirect URL / allowed URL settings में जोड़ें।

## 5. Existing site में जोड़ना
`login.html`, `dashboard.html`, `auth.js`, `dashboard.js`, `auth-style.css`,
और `supabase-config.js` को अपनी site के public/root folder में रखें।

अपने existing `index.html` में ऊपर Login button लगाएं:
`<a href="login.html">Login / Sign Up</a>`

## Important
यह secure authentication के लिए Supabase Auth इस्तेमाल करता है।
सिर्फ localStorage वाला fake login production में इस्तेमाल न करें।
