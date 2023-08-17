import { render, screen } from '@testing-library/react'
import { it, expect } from '@jest/globals';
import { getPrismicClient } from '../../pages/services/prismic';
import Post, { getStaticProps } from '../../pages/posts';

const posts = [
    {
        slug: 'teste',
        title: 'Teste',
        excerpt: 'description',
        updatedAt: '2023-02-10'
    }
];

jest.mock('../../pages/services/prismic')

describe('Post Page', () => {
    it('renders correctly', () => {
        render(
            <Post posts={posts} />
        )
        expect(screen.getByText('Teste')).toBeInTheDocument();
    })

    it('loads initial data', async () => {
        const prismicMocked = jest.mocked(getPrismicClient);
        prismicMocked.mockReturnValueOnce({
            query: jest.fn().mockResolvedValueOnce({
                results: [{
                    uid: 'my-new-posts',
                    last_publication_date: '04-02-2023',
                    data: {
                        title: [
                            {type:'heading',text:'New Posts'}
                        ],
                        content: [
                            {type:'paragraph',text:'New Posts'}
                        ]
                    }
                }]
            })
        } as any);

        const response = await getStaticProps({});

        expect(response).toEqual(
            expect.objectContaining({
                props: { 
                    posts:[{
                        slug:'my-new-posts',
                        title:'New Posts',
                        excerpt:'New Posts',
                        updatedAt:'02 de abril de 2023'
                    }
                    ]
                }
            })
        )
    })
})
