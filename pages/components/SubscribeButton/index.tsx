import { useSession, signIn } from 'next-auth/react';
import styles from './SubscribeButton.module.scss';
import { api } from '@/pages/services/api';
import { getStripeJs } from '@/pages/services/stripe-web';
import { useRouter } from 'next/router';


interface SubscribeButtonProps{
    priceId:string
}

export function SubscribeButton({priceId}:SubscribeButtonProps){
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