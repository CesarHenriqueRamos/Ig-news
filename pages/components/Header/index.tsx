import { SinginButton } from '../SinginButton'
import styles from './Header.module.scss'
export function Header(){
    return (
        <header className={styles['header-container']}>
            <div className={styles['header-content']}>
                <img src="/images/logo.svg" alt="ig news" />
                <nav>
                    <a href="" className={styles.active}>Home</a>
                    <a href="">Post</a>                    
                </nav>
                <SinginButton />
            </div>
        </header>
    )
}