import { useSession, signIn } from 'next-auth/react';
import styles from './SubscribeButton.module.scss';
import { api } from '../../services/api';
import { getStripeJs } from '../../services/stripe-web';
import { useRouter } from 'next/router';


export function SubscribeButton(){
    const { data:session } = useSession();
    const router = useRouter()
    async function handleSubscibe(){
        if(!session){
            signIn('github');
            return;
        }
        if(session?.activeSubscription){
            router.push('/posts')
            return 
        }
        try{
            const response = await api.post("/subscribe");
            const { sessionId } = response.data;
            const stripe = await getStripeJs();
            await stripe?.redirectToCheckout({sessionId})
        }catch(err){
            alert(err)
        }
    }
    return(
        <button type="button"
         className={styles.subscribeButton}
         onClick={()=>handleSubscibe()}
         >
            Subscribe now
        </button>
    )
}