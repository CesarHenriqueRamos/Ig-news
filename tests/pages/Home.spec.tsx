import {render, screen} from '@testing-library/react'
import { it, expect } from '@jest/globals';
import Home, { getStaticProps } from '../../pages';
import { stripe } from '../../pages/services/stripe'



jest.mock('next/router', () => {
    return {
        useRouter: () => ({
            asPath: '/'
        })
    };
});
jest.mock('next-auth/react', () => {
    return {
        useSession(){
            return [null,false];
        }
    };
});
jest.mock('../../pages/services/stripe')

describe('Home Page', ()=>{
    it('renders correctly',()=>{
        render(
            <Home product={{priceId:'1',amount:'R$10,00'}} />
        )
        expect(screen.getByText('for R$10,00 month')).toBeInTheDocument();
    })
    
    it('loads initial data', async() =>{
        const stripeMocked = jest.mocked(stripe.prices.retrieve);
        stripeMocked.mockResolvedValueOnce({
            id:'id-fack',
            unit_amount:1000
        } as any);
        const response = await getStaticProps({});

        expect(response).toEqual(
            expect.objectContaining({
                props: { product: { priceId: 'id-fack', amount: '$10.00' } }
            })
        )
    })
} )
