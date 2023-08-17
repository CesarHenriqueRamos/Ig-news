import { GetServerSideProps } from "next";
import { getSession } from 'next-auth/react'
import { getPrismicClient } from "../services/prismic";
import { RichText } from "prismic-dom";
import Head from "next/head";
import styles from './post.module.scss';

interface PostProps{
    post:{
        slug:string;
        title:string;
        content:string;
        updatedAt:string;
    }
}

export default function Post({post}:PostProps){
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
                    className={styles.postContent}
                     dangerouslySetInnerHTML={{__html:post.content}} />
                </article>
            </main>
        </>
    )
}

export const getServerSideProps:GetServerSideProps = async ({req, params}:any) => {

    const { slug } = params;

    if(!req?.session?.activeSubscription){
        return{
            redirect:{
                destination:'/',
                permanent:false
            }
        }
    }

    const prismic = getPrismicClient(req);
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
}