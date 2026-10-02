const client = window.supabase.createClient(
  window.SUPABASE_URL, window.SUPABASE_ANON_KEY
);
const projectsEl = document.getElementById("projects");

async function start() {
  const {data:{session}} = await client.auth.getSession();
  if (!session) return location.href = "login.html";
  document.getElementById("userEmail").textContent = session.user.email;
  await loadProjects(session.user.id);
}

async function loadProjects(userId) {
  const {data, error} = await client
    .from("projects")
    .select("id,title,created_at")
    .eq("user_id", userId)
    .order("created_at", {ascending:false});

  if (error) {
    projectsEl.innerHTML = `<p class="message">${error.message}</p>`;
    return;
  }
  if (!data.length) {
    projectsEl.innerHTML = `<p class="muted">अभी कोई project नहीं है।</p>`;
    return;
  }
  projectsEl.innerHTML = data.map(p =>
    `<div style="padding:14px;border:1px solid #2c3e5c;border-radius:12px;margin:8px 0">
      <strong>${escapeHtml(p.title)}</strong>
      <div class="muted" style="margin:6px 0 0;text-align:left;font-size:13px">
        ${new Date(p.created_at).toLocaleString()}
      </div>
    </div>`
  ).join("");
}

document.getElementById("newProject").onclick = async () => {
  const {data:{session}} = await client.auth.getSession();
  if (!session) return;
  const title = prompt("Project का नाम:");
  if (!title) return;
  const {error} = await client.from("projects").insert({
    user_id: session.user.id, title: title.trim(), data: {}
  });
  if (error) return alert(error.message);
  loadProjects(session.user.id);
};

document.getElementById("logout").onclick = async () => {
  await client.auth.signOut();
  location.href = "login.html";
};

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
  }[c]));
}
start();
