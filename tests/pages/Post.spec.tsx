import { render, screen } from '@testing-library/react'
import { it, expect } from '@jest/globals';
import { getPrismicClient } from '../../pages/services/prismic';
import Post,{getServerSideProps} from '../../pages/posts/[slug]';
import { useSession } from 'next-auth/react';
import { useRouter } from "next/router";

const posts = {
        slug: 'my-new-post',
        title: 'My New Post',
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

describe('PostPage', () => {
     it('renders correctly', () => {
         render(<Post post={posts} />)
         expect(screen.getByText('My New Post')).toBeInTheDocument();
     })

     it('redirect user if no subscription is found', async() => {
         const sessionMock = jest.mocked(useSession);
         sessionMock.mockReturnValueOnce({} as any)
         const response = await getServerSideProps({
             params:{
                 slug:'my-new-post'
             }
         } as any);
         render(<Post post={posts} />);
         expect(response).toEqual(
             expect.objectContaining({
                 redirect: { destination: '/', permanent: false }
             })
         )
     })
    
    it('loads initial data', async () => {
        const prismicMocked = jest.mocked(getPrismicClient);
        const sessionMock = jest.mocked(useSession);
        sessionMock.mockReturnValueOnce({
            activeSubscription:'active-fake'
        } as any);
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
        
        const response = await getServerSideProps({
            req:{
                session:{
                    activeSubscription:'active-fake'
                }                
            },
            params:{
                slug:'my-new-post'
            }
        } as any);

        expect(response).toEqual(
            expect.objectContaining({
                props: {
                    post: {
                      slug: 'my-new-post',
                      title: 'New Posts',
                      content: '<p>New Posts</p>',
                      updatedAt: '02 de abril de 2023'
                    }
                  },
                  revalidate: 1800
                }
        ))
    });
    
})
