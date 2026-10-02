const msg = document.getElementById("msg");

function show(text, ok=false) {
  msg.textContent = text;
  msg.style.color = ok ? "#7ee2a8" : "#ffb4b4";
}

if (!window.supabase || !window.SUPABASE_URL || window.SUPABASE_URL.startsWith("YOUR_")) {
  show("पहले supabase-config.js में Supabase URL और anon/publishable key डालें।");
} else {
  const client = window.supabase.createClient(
    window.SUPABASE_URL,
    window.SUPABASE_ANON_KEY
  );

  client.auth.getSession().then(({data}) => {
    if (data.session) location.href = "dashboard.html";
  });

  document.getElementById("signupBtn").onclick = async () => {
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    if (!email || password.length < 6) return show("Email और कम-से-कम 6 character password डालें।");

    const {error} = await client.auth.signUp({
      email, password,
      options: { emailRedirectTo: location.origin + "/dashboard.html" }
    });
    if (error) return show(error.message);
    show("Account बन गया। अगर email confirmation चालू है तो email verify करें।", true);
  };

  document.getElementById("loginBtn").onclick = async () => {
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const {error} = await client.auth.signInWithPassword({email, password});
    if (error) return show(error.message);
    location.href = "dashboard.html";
  };

  document.getElementById("googleBtn").onclick = async () => {
    const {error} = await client.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: location.origin + "/dashboard.html" }
    });
    if (error) show(error.message);
  };
}
