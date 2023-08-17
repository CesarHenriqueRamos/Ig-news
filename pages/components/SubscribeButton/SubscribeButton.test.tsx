import { fireEvent, render, screen } from "@testing-library/react";
import { SubscribeButton } from ".";
import { it, expect } from '@jest/globals';
declare module 'next-auth/react' {
    interface Session {
      activeSubscription: string;
    }
  }
//Functions to be mocked
import { useSession } from "next-auth/react";
jest.mock("next-auth/react");

import { signIn } from "next-auth/react";
jest.mock("next-auth/react");

import { useRouter } from "next/router";
jest.mock("next/router", () => ({
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn(),
  }),
}));

describe("SubscribeButton Component", () => {
  it("renders correctly", () => {
    const useSessioMocked = jest.mocked(useSession);
    useSessioMocked.mockReturnValueOnce({
      data: null,
      status: "authenticated",
    } as any);

    render(<SubscribeButton />);
    expect(screen.getByText("Subscribe now")).toBeInTheDocument();
  });

  it("redirect to signin when not authenticated", () => {
    const useSessioMocked = jest.mocked(useSession);
    useSessioMocked.mockReturnValueOnce({
      data: null,
      status: "authenticated",
    } as any);

    render(<SubscribeButton />);

    const subscribeButton = screen.getByText("Subscribe now");
    fireEvent.click(subscribeButton);

    const signInMocked = jest.mocked(signIn);
    signInMocked.mockReturnValueOnce({} as any);

    expect(signInMocked).toHaveBeenCalled();
  });

  it("redirect to post when user is authenticated and had an active subscription", () => {
    const useSessionMocked = jest.mocked(useSession);
    useSessionMocked.mockReturnValueOnce({
      data: { activeSubscription: "active", expires: "expire" },
      status: "authenticated",
    } as any);

    const router = useRouter();

    render(<SubscribeButton />);

    const subscribeButtonActive = screen.getByText("Subscribe now");
    fireEvent.click(subscribeButtonActive);

    expect(router.push).toHaveBeenCalled();
  });
});