import {render, screen} from '@testing-library/react'
import { it, expect } from '@jest/globals';
import { Header } from './'


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

describe('Header componente', ()=>{
    it('Header renders corrects',()=>{
       render(
            <Header/>
        )
        expect(screen.getByText('Home')).toBeInTheDocument();
        expect(screen.getByText('Post')).toBeInTheDocument();
    })
    
} )
