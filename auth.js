const supabaseUrl = 'https://mfrbvrksnlbxovvlklyh.supabase.co';
const supabaseKey = 'sb_publishable_wUzL2Hg-3zFMDBE1aeHfgQ_ga5sWtNo';

const supabaseClient = window.supabase.createClient(supabaseUrl, supabaseKey);

const rutasPublicas = ['index.html', 'iniciarsesion.html', 'register.html', 'auth-callback.html', 'unidad.html', 'semana.html'];
const rutasProtegidas = ['dashboard.html'];

function esRutaPublica() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  return rutasPublicas.includes(path);
}

function esRutaProtegida() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  return rutasProtegidas.includes(path);
}

async function verificarSesion() {
  const { data, error } = await supabaseClient.auth.getSession();

  if (error) {
    console.error('Error de sesión:', error);
    if (esRutaProtegida()) {
      window.location.href = 'iniciarsesion.html';
      return false;
    }
    return false;
  }

  if (!data.session) {
    if (esRutaProtegida()) {
      window.location.href = 'iniciarsesion.html';
      return false;
    }
    return false;
  }

  return data.session;
}

async function verificarAccesoUnidad() {
  const session = await verificarSesion();
  if (!session) {
    window.location.href = 'iniciarsesion.html';
    return false;
  }
  return true;
}

async function verificarAccesoSemana() {
  const session = await verificarSesion();
  if (!session) {
    window.location.href = 'iniciarsesion.html';
    return false;
  }
  return true;
}

async function verificarAdmin() {
  const session = await verificarSesion();
  if (!session) return false;

  const { data: userData } = await supabaseClient.auth.getUser();
  if (!userData?.user) return false;

  const { data: profile } = await supabaseClient
    .from('profiles')
    .select('rol')
    .eq('id', userData.user.id)
    .maybeSingle();

  if (profile?.rol !== 'admin') {
    window.location.href = 'index.html';
    return false;
  }

  return true;
}

async function cerrarSesion() {
  await supabaseClient.auth.signOut();
  window.location.href = 'iniciarsesion.html';
}

async function obtenerUsuarioActual() {
  const { data: userData } = await supabaseClient.auth.getUser();
  if (!userData?.user) return null;

  const { data: profile } = await supabaseClient
    .from('profiles')
    .select('nombre, correo, rol')
    .eq('id', userData.user.id)
    .maybeSingle();

  return {
    ...userData.user,
    profile
  };
}

async function esAdmin() {
  const user = await obtenerUsuarioActual();
  return user?.profile?.rol === 'admin';
}

supabaseClient.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_OUT') {
    localStorage.setItem('sb-session', 'null');
    if (esRutaProtegida()) {
      window.location.href = 'iniciarsesion.html';
    }
  } else if (event === 'SIGNED_IN' && session) {
    localStorage.setItem('sb-session', 'active');
  }
});

window.addEventListener('storage', (event) => {
  if (event.key === 'sb-session' && event.newValue === 'null') {
    if (esRutaProtegida()) {
      window.location.href = 'iniciarsesion.html';
    }
  }
});

window.addEventListener('pageshow', async (event) => {
  if (event.persisted) {
    await verificarSesion();
  }
});

window.addEventListener('popstate', async () => {
  if (esRutaProtegida()) {
    await verificarSesion();
  }
});
