import { useEffect, useState } from 'react';
import { AppState, Modal, View, Text, Pressable, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppStore } from '@/store/useAppStore';
import { request } from '@/api/client';
export function NotificationBell() {
 const [open,setOpen]=useState(false);
 const {notifications,syncAccount,isLoggedIn}=useAppStore();
 useEffect(()=>{
  const sync=()=>{if(useAppStore.getState().isLoggedIn)void syncAccount().catch(()=>{});};
  sync();const timer=setInterval(sync,30000);const listener=AppState.addEventListener('change',s=>{if(s==='active')sync();});
  return ()=>{clearInterval(timer);listener.remove();};
 },[isLoggedIn]);
 return <><Pressable accessibilityLabel={`Notifications, ${notifications.filter(n=>!n.read_at).length} unread`} onPress={()=>setOpen(true)} style={{padding:12}}><Ionicons name="notifications-outline" size={24}/>{notifications.some(n=>!n.read_at)&&<Text style={{color:'#D74825'}}>●</Text>}</Pressable>
 <Modal visible={open} animationType="slide" onRequestClose={()=>setOpen(false)}><ScrollView contentContainerStyle={{padding:32,paddingTop:64}}><Pressable onPress={()=>setOpen(false)}><Text>Close</Text></Pressable><Text style={{fontSize:28,fontWeight:'700',marginVertical:20}}>Your updates</Text>{!notifications.length&&<Text>No notifications yet.</Text>}{notifications.map(n=><Pressable key={n.id} style={{padding:20,marginBottom:12,backgroundColor:n.read_at?'#F4F4F4':'#E6F4F0',borderRadius:16}} onPress={async()=>{try{await request('/me/notifications/'+n.id,{method:'PATCH'});await syncAccount();}catch(e){Alert.alert('Notifications',(e as Error).message);}}}><Text style={{fontWeight:'700'}}>{n.title}</Text><Text>{n.body}</Text><Text>{new Date(n.created_at).toLocaleString('en-AU')}</Text></Pressable>)}</ScrollView></Modal></>;
}
