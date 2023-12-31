import Head from 'next/head';
import styles from './styles.module.scss';
import { GetStaticProps } from 'next';
import { getPrismicClient } from '../services/prismic';
import Prismic from '@prismicio/client';
import { RichText } from 'prismic-dom';
import Link from 'next/link';


type Post = {
    slug:string;
    title:string;
    excerpt:string;
    updatedAt:string;
}

interface PostsProps {
    posts: Post[]
}

export default function Posts({posts}:PostsProps){
    return(
        <>
        <Head>
            <title>Posts | IgNews</title>
        </Head>
        <main className={styles.container}>
            <div className={styles.posts}>
                {posts.map(post => (
                    <Link href={`/posts/${post.slug}`} key={post.slug}>
                        <time>{post.updatedAt}</time>
                        <strong>{post.title}</strong>
                        <p>{post.excerpt}</p>
                    </Link> 
                ))}
            </div>
        </main>
        </>
    )
}

export const getStaticProps:GetStaticProps = async () =>{
    const prismic = getPrismicClient();

    const response:any = await prismic.query([
        Prismic.predicates.at('document.type','publication')
    ],{
        fetch:['publicate.title','publicate.content'],
        pageSize:100
    })

    const posts = response.results.map((post:any) => {
        return {
            slug: post.uid,
            title: RichText.asText(post.data.title) ,
            excerpt: post.data.content.find((conten:any) => conten.type === 'paragraph')?.text ?? '',
            updatedAt: new Date(post.last_publication_date).toLocaleDateString('pt-BR',{
                day: '2-digit',
                month:'long',
                year:'numeric'
            })
        }
    })

    return {
        props:{
            posts
        }
    }
}