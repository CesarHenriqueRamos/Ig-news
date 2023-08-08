import { SinginButton } from '../SinginButton'
import styles from './Header.module.scss'
import { ActiveLink } from '../ActiveLink'
export function Header(){

    return (
        <header className={styles['header-container']}>
            <div className={styles['header-content']}>
                <img src="/images/logo.svg" alt="ig news" />
                <nav>
                    <ActiveLink href="/" activeClassName={styles.active}><>Home</></ActiveLink>
                    <ActiveLink activeClassName={styles.active} href="/posts" prefetch><>Post</></ActiveLink>
                                        
                </nav>
                <SinginButton />
            </div>
        </header>
    )
}