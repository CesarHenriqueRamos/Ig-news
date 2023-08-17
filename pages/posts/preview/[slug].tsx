import { GetStaticPaths, GetStaticProps } from "next";
import { getPrismicClient } from "../../services/prismic";
import { RichText } from "prismic-dom";
import Link from 'next/link';
import Head from "next/head";
import styles from '../post.module.scss';
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/router";

interface PostPreviewProps{
    post:{
        slug:string;
        title:string;
        content:string;
        updatedAt:string;
    }
}

export default function PostPreview({post}:PostPreviewProps){
    const session:any = useSession();
    const router = useRouter()
    useEffect(()=>{
        if(session?.activeSubscription){
            router.push(`/posts/${post.slug}`)
        }
    },[session])
    return(
        <>
            <Head>
                <title>{post.title} | IgNews</title>
            </Head>
            <main className={styles.container}>
                <article className={styles.post}>
                    <h1>{post.title}</h1>
                    <time>{post.updatedAt}</time>
                    <div
                    className={`${styles.postContent} ${styles.previewContent}`}
                     dangerouslySetInnerHTML={{__html:post.content}} />
                     <div className={styles.continueReading}>
                     Wanna continue reading? <Link href="/">Subscribe now 🤗</Link> 
                     </div>
                </article>
            </main>
        </>
    )
}

export const getStaticPaths:GetStaticPaths = async() => {
    return {
        paths:[],
        fallback:'blocking'
    }
}

export const getStaticProps: GetStaticProps = async ({ params }:any) => {
    const { slug } = params;
    const prismic = getPrismicClient();

    try {
        const response:any = await prismic.getByUID('publication', String(slug), {});
        const post = {
            slug,
            title: RichText.asText(response.data.title),
            content: RichText.asHtml(response.data.content.splice(0, 3)),
            updatedAt: new Date(response.last_publication_date).toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: 'long',
                year: 'numeric'
            })
        };
        return {
            props: {
                post
            },
            revalidate: 60 * 30 // 30 minutos
        };
    } catch (error) {
        console.error('Error fetching document:', error);
        // Handle the error or return an error page
        return {
            notFound: true
        };
    }
};