import {render, screen} from '@testing-library/react'
import { it, expect } from '@jest/globals';
import { ActiveLink } from './'


jest.mock('next/router', () => {
    return {
        useRouter: () => ({
            asPath: '/'
        })
    };
});

describe('ActiveLink componente', ()=>{
    it('active link renders corrects',()=>{
        render(
            <ActiveLink href='/' activeClassName='active'>
                <>Home</>
            </ActiveLink>
        )
        expect(screen.getByText('Home')).toBeInTheDocument();
    })
    
    it('active link renders corrects',()=>{
        render(
            <ActiveLink href='/' activeClassName='active'>
                <>Home</>
            </ActiveLink>
        )
        expect(screen.getByText('Home')).toHaveClass('active')
    })
} )
