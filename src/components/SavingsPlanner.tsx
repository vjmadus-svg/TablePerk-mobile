import { useEffect, useState } from 'react';
import { View, Text, Pressable, TextInput, Alert } from 'react-native';
import { request } from '@/api/client';
import { useAppStore } from '@/store/useAppStore';
import { LoginModal } from './LoginModal';
export function SavingsPlanner({restaurantId}:{restaurantId?:string}) {
 const [offers,setOffers]=useState<any[]>([]),[error,setError]=useState(''),[login,setLogin]=useState(false),[busy,setBusy]=useState(false),[bill,setBill]=useState('100');
 const {isLoggedIn,syncAccount}=useAppStore();
 const load=async()=>{try{setOffers((await request('/offers'+(restaurantId?'?restaurantId='+restaurantId:''))).offers);setError('');}catch(e){setError((e as Error).message);}};
 useEffect(()=>{void load();const timer=setInterval(()=>void load(),60000);return()=>clearInterval(timer);},[restaurantId]);
 const best=[...offers].sort((a,b)=>Number(b.discount_percent)-Number(a.discount_percent))[0];
 const amount=Number(bill);
 const current=offers.filter(o=>new Date(o.start_at).getTime()<=Date.now()&&new Date(o.end_at).getTime()>Date.now()).sort((a,b)=>Number(b.discount_percent)-Number(a.discount_percent))[0];
 return <View style={{margin:16,padding:20,backgroundColor:'#E8F3EF',borderRadius:24}}>
  <Text style={{color:'#205B4C',fontSize:12,fontWeight:'700'}}>TABLEPERK • SAVINGS PLANNER</Text>
  <Text style={{fontSize:27,fontWeight:'800',marginVertical:12}}>A better time to dine.</Text>
  <Text>Compare published offers and plan around the biggest saving.</Text>
  <TextInput accessibilityLabel="Estimated bill in dollars" value={bill} onChangeText={setBill} keyboardType="decimal-pad" style={{backgroundColor:'white',padding:12,borderRadius:12,marginVertical:12}} />
  {!!error&&<Pressable onPress={()=>void load()}><Text>{error} Tap to retry.</Text></Pressable>}
  {!error&&!offers.length&&<Text>No scheduled discounts yet. Check back soon.</Text>}
  {best&&<View style={{backgroundColor:'#205B4C',padding:16,borderRadius:16,marginVertical:12}}><Text style={{color:'white',fontWeight:'700'}}>Best published saving: {best.discount_percent}% at {best.restaurant_name}</Text><Text style={{color:'white'}}>From {new Date(best.start_at).toLocaleString('en-AU')}{Number.isFinite(amount)&&amount>0?` • Save about $${(amount*Number(best.discount_percent)/100).toFixed(2)} on a $${amount} bill`:''}</Text></View>}
  {best && current && Number(best.discount_percent)>Number(current.discount_percent) && <Text style={{fontWeight:'700'}}>Plan for {new Date(best.start_at).toLocaleString('en-AU')} to get {Number(best.discount_percent)-Number(current.discount_percent)} percentage points more off than the best offer available now.</Text>}
  {offers.map(o=>{
   const now=Date.now(),start=new Date(o.start_at).getTime(),end=new Date(o.end_at).getTime();const active=['ACTIVE','SCHEDULED'].includes(o.status)&&start<=now&&end>now;
   return <View key={o.id} style={{backgroundColor:'white',borderRadius:16,padding:16,marginTop:10}}><Text style={{fontSize:20,fontWeight:'700'}}>{o.discount_percent}% off • {o.restaurant_name}</Text><Text>{o.title}</Text><Text>{new Date(o.start_at).toLocaleString('en-AU')} – {new Date(o.end_at).toLocaleString('en-AU')}</Text><Text>{o.offer_type==='DINE_IN'?'Dine in':'Takeaway'} • {o.maximum_redemptions-o.redeemed_count} available</Text><Pressable disabled={!active||busy} style={{paddingVertical:12}} onPress={async()=>{
    if(!isLoggedIn){setLogin(true);return;}if(busy)return;setBusy(true);
    try{const result=await request('/offers/'+o.id+'/claim',{method:'POST',body:JSON.stringify({partySize:1,arrivalTime:new Date(Math.min(Date.now()+15*60000,end)).toISOString()})});await syncAccount();await load();Alert.alert('Discount claimed',`Your code: ${result.redemption.redemption_code}. Arrival: ${new Date(result.redemption.arrival_time).toLocaleString('en-AU')}. Show this signed token to staff: ${result.qrToken}`);}catch(e){Alert.alert('Could not claim',(e as Error).message);}finally{setBusy(false);}
   }}><Text style={{fontWeight:'700',color:active?'#205B4C':'#777'}}>{active?'Claim for 1 guest • arrive in 15 minutes':'Upcoming • available from the start time'}</Text></Pressable></View>;
  })}
  <Text style={{fontSize:12,marginTop:16}}>Based on restaurant-published offers. Availability and final savings depend on offer terms. Times use your device timezone.</Text>
  <LoginModal visible={login} onClose={()=>setLogin(false)}/>
 </View>;
}
