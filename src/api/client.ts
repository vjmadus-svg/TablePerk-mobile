import * as SecureStore from 'expo-secure-store';
const base = process.env.EXPO_PUBLIC_API_URL;
let accessToken = '';
let sessionEpoch=0;
let refreshPending: Promise<any> | null = null;
export async function session() {
  if (!refreshPending) refreshPending = (async () => {
    const epoch=sessionEpoch;
    const refreshToken = await SecureStore.getItemAsync('tableperk-session');
    if (!refreshToken) return null;
    const data = await request('/auth/refresh', { method: 'POST', body: JSON.stringify({refreshToken}) });
    if(epoch!==sessionEpoch)return null;
    accessToken = data.accessToken;
    return data.user;
  })().finally(() => {refreshPending = null;});
  return refreshPending;
}
export async function request(path: string, options: RequestInit = {}, retry = true): Promise<any> {
  if (!base) throw new Error('Set EXPO_PUBLIC_API_URL to your TablePerk API address.');
  const response = await fetch(`${base}/api/v1${path}`, {...options, headers: {'Content-Type':'application/json', ...(accessToken ? {Authorization:`Bearer ${accessToken}`} : {}), ...options.headers}});
  if (response.status === 401 && retry && !path.startsWith('/auth/')) {
    if (await session()) return request(path,options,false);
  }
  if (!response.ok) { const data = await response.json().catch(()=>({})); throw new Error(data.code || 'Unable to connect. Please try again.'); }
  return response.status === 204 ? null : response.json();
}
export async function authenticate(username: string,password: string,email?: string) {
  const data = await request(email ? '/auth/register' : '/auth/login',{method:'POST',body:JSON.stringify({username,password,...(email ? {email,role:'CUSTOMER'} : {})})});
  await SecureStore.setItemAsync('tableperk-session',data.refreshToken);
  accessToken = data.accessToken;
  return data.user;
}
export async function signOut() {
  sessionEpoch++;
  const refreshToken = await SecureStore.getItemAsync('tableperk-session');
  try { if(refreshToken) await request('/auth/logout',{method:'POST',body:JSON.stringify({refreshToken})}); }
  finally {accessToken='';await SecureStore.deleteItemAsync('tableperk-session');}
}
