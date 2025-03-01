import { render, screen, waitFor } from '@testing-library/react';
import UserProfile from './user-profile';
import React from 'react';

describe('UserProfile tests', () => {
    const fetchSpy = jest.fn()
    const baseApi = 'https://api.example.com/users/'

    beforeEach(()=>{
        global.fetch = fetchSpy
    })

    afterEach(()=>{
        jest.clearAllMocks();
    })
    describe('GIVEN user data fetched', () => {
        const userId = "user#1"
        const userInformation = {
            name: "test-user#1",
            email: "test-user@gmail.com"
        }

        describe('WHEN user enter', () => {
            beforeEach(()=>{
                fetchSpy.mockResolvedValue({
                    ok: true,
                    json: jest.fn().mockResolvedValue(userInformation)
                })
            })

            afterEach(()=>{
                jest.clearAllMocks();
            })

            it(`THEN user should see user's name`, async () => {
               render(<UserProfile userId={userId}/>)
               await waitFor(() => expect(fetchSpy).toHaveBeenCalledWith(`${baseApi}${userId}`))
               await waitFor(() => screen.getByText(userInformation.name));
               expect(screen.getByText(userInformation.name)).toBeInTheDocument()
            });

            it(`THEN user should see user's email`, async () => {
               render(<UserProfile userId={userId}/>)
               await waitFor(() => expect(fetchSpy).toHaveBeenCalledWith(`${baseApi}${userId}`))
               await waitFor(() => screen.getByText(userInformation.name));
               expect(screen.getByText(`Email: ${userInformation.email}`)).toBeInTheDocument()

            });
        });
    });
    
    describe('GIVEN user data is being fetched', () => {
        const userId = "user#2"

        describe('WHEN user enter', () => {
            beforeEach(()=>{
                fetchSpy.mockResolvedValue({
                    ok: true,
                    json: jest.fn()
                })
            })

            afterEach(()=>{
                jest.clearAllMocks();
            })
            it('THEN user should see loading screen', () => {
                render(<UserProfile userId={userId}/>)
                expect(screen.getByText('Loading...')).toBeInTheDocument()
            });
        });
    });
    
    describe('GIVEN user data can not fetch', () => {
        const userId = "user#3"
        const errorMessage = 'Failed to fetch user data'

        describe('WHEN user enter', () => {
            beforeEach(()=>{
                fetchSpy.mockResolvedValue({
                    ok: false,
                    json: jest.fn()
                })
            })

            afterEach(()=>{
                jest.clearAllMocks();
            })
            it('THEN user should see error', async () => {
                render(<UserProfile userId={userId}/>)
                await waitFor(() => expect(fetchSpy).toHaveBeenCalledWith(`${baseApi}${userId}`))
                expect(screen.getByText(`Error: ${errorMessage}`)).toBeInTheDocument()
            });
        });
    });
});
