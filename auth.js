const supabaseUrl = 'https://mfrbvrksnlbxovvlklyh.supabase.co';
const supabaseKey = 'sb_publishable_wUzL2Hg-3zFMDBE1aeHfgQ_ga5sWtNo';

const supabaseClient = window.supabase.createClient(supabaseUrl, supabaseKey);

async function verificarSesion() {
  const { data, error } = await supabaseClient.auth.getSession();

  if (error || !data.session) {
    window.location.href = 'iniciarsesion.html';
    return false;
  }

  return true;
}

async function cerrarSesion() {
  await supabaseClient.auth.signOut();
  window.location.href = 'iniciarsesion.html';
}

supabaseClient.auth.onAuthStateChange((event, session) => {
  localStorage.setItem('sb-session', session ? 'active' : 'null');
});

window.addEventListener('storage', (event) => {
  if (event.key === 'sb-session' && event.newValue === 'null') {
    window.location.href = 'iniciarsesion.html';
  }
});
