import { render, screen } from '@testing-library/react'
import { it, expect } from '@jest/globals';
import { getPrismicClient } from '../../pages/services/prismic';
import PostPreview, { getStaticProps } from '../../pages/posts/preview/[slug]';
import { useSession } from 'next-auth/react';
import { useRouter } from "next/router";

const posts = {
        slug: 'teste',
        title: 'Teste',
        content: 'description',
        updatedAt: '2023-02-10'
    }
;
jest.mock("next/router", () => ({
    useRouter: jest.fn().mockReturnValue({
      push: jest.fn(),
    }),
  }));
  
jest.mock('next-auth/react');
jest.mock('../../pages/services/prismic');

describe('Post Preview Page', () => {
    it('renders correctly', () => {
        render(<PostPreview post={posts} />)
        expect(screen.getByText('Wanna continue reading?')).toBeInTheDocument();
    })

    it('redirects user to full post when user is subscribed', () => {
        const useSessionMock = jest.mocked(useSession);
        const useRouterMock = jest.mocked(useRouter);
        const pushMock = jest.fn();

        // Mocking useSession
        useSessionMock.mockReturnValueOnce({
            activeSubscription: 'active-fake'
        } as any);

        // Mocking useRouter
        useRouterMock.mockReturnValueOnce({
            push: pushMock
        } as any);

        render(<PostPreview post={posts} />);
        
        expect(pushMock).toHaveBeenCalledWith('/posts/teste');
    });
    
    it('loads initial data', async () => {
        const prismicMocked = jest.mocked(getPrismicClient);
        prismicMocked.mockReturnValueOnce({
            getByUID: jest.fn().mockResolvedValueOnce({
                UID: 'my-new-posts',
                last_publication_date: '04-02-2023',
                data: {
                    title: [
                        {type:'heading',text:'New Posts'}
                    ],
                    content: [
                        {type:'paragraph',text:'New Posts'}
                    ]
                }
            })
        } as any);

        const response = await getStaticProps({params: { slug: 'my-new-posts' }});

        expect(response).toEqual(
            expect.objectContaining({
                props: { 
                    post: {
                        slug: 'my-new-posts',
                        title: 'New Posts',
                        content: '<p>New Posts</p>',
                        updatedAt: '02 de abril de 2023'
                    }
                }
            })
        )
    });
    
})
