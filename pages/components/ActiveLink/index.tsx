import Link, { LinkProps } from "next/link";
import { useRouter } from "next/router";
import { ReactElement } from "react";

interface ActiveLinkProps extends LinkProps{
    children:ReactElement;
    activeClassName:string;
}

export function ActiveLink({children,activeClassName,...rest}:ActiveLinkProps){
    const { asPath } = useRouter();
    const className = asPath === rest.href ? activeClassName : ''
    return(
        <Link {...rest} className={className}>{children}</Link>
    )
}