import { signIn, useSession, signOut } from 'next-auth/react';
import styles from './SinginButon.module.scss';
import { FaGithub } from 'react-icons/fa';
import { FiX } from 'react-icons/fi';


export function SinginButton(){
    const { data: session } = useSession();

    return session ? (
    <button type='button' className={styles['singin-button']} 
    onClick={() => signOut()}>
            <FaGithub color="#04D361" />
            {session.user?.name}
            <FiX color="#737380" className={styles.closeIcon} />
        </button>
    ) : (
        <button type='button' className={styles['singin-button']}
        onClick={()=> signIn('github')}>
            <FaGithub color="#eba417" />
            Sing in with GitHub
        </button>
    )
}