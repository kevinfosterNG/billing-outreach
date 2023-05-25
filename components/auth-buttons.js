"use client";
import '@/styles/button.css';
import LoadingGradient from '@/components/loading-gradient';
import { signIn, signOut } from "next-auth/react";
import Link from "next/link";
import { useSession } from "next-auth/react";

export const SessionButtons = () => {
  const { data: session, status } = useSession();
  if(status === "loading") {
    return (< LoadingGradient />);
  }
  else if (status === "unauthenticated") {
    return (<LoginButton />);
  }
  else if (status === "authenticated") {
    return (
      <>
      <ProfileButton />
      <LogoutButton />
      </>
    )
  }
}

export const LoginButton = () => {
    return (
      <div className="button" style={{  }} onClick={() => signIn()} key={'logindiv'}>
        <Link href="/api/auth/signin" className='nav__item'>Sign in</Link>
      </div>
    );
};

export const RegisterButton = () => {
  return (
    <Link href="/register" className='nav__item'>
      Register
    </Link>
  );
};

export const LogoutButton = () => {
  return (
    <div className="button" onClick={() => signOut()} key={'logoutdiv'}>
      <Link href="/api/auth/signout" className='nav__item'>Sign Out</Link>
    </div>
  );
};

export const ProfileButton = () => {
  return <Link href="/profile" className='nav__item'>Profile</Link>;
};