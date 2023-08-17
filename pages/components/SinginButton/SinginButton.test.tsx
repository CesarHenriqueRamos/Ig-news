import {render, screen} from '@testing-library/react'
import { it, expect } from '@jest/globals';
import { useSession } from 'next-auth/react';

import { SinginButton } from './';


jest.mock('next-auth/react');

describe('SinginButon componente', ()=>{
    it('renders correct when user is not authenticated',()=>{
        const useSessionMocked = jest.mocked(useSession);
        useSessionMocked.mockReturnValueOnce({
            data: null,
            status: "unauthenticated"
          } as any)
        render(
            <SinginButton/>
        )
        expect(screen.getByText('Sing in with GitHub')).toBeInTheDocument();
    })
    it('renders correct when user is authenticated',()=>{
        const useSessionMocked = jest.mocked(useSession);
        useSessionMocked.mockReturnValueOnce({
            data: {
              user: {
                name: 'John Doe',
                email: 'johndoe@example.com'
              },
              expires: 'fake-expires'
            },
            status: "authenticated"
          } as any);
          
        render(
            <SinginButton/>
        )
        expect(screen.getByText('John Doe')).toBeInTheDocument();
    })
    
} )
