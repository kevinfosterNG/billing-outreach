'use client';
import Link from "next/link";
import Image from "next/image";
import React, { useState } from "react";
import { useSession } from "next-auth/react";
import NavItem from "@/components/ui/nav";
import '@/styles/navitems.css';
import { LoginButton, LogoutButton, ProfileButton, SessionButtons } from "@/components/auth-buttons";

const MENU_LIST = [
  { text: "Home", href: "/" },
  { text: "Messages", href: "/messages" },
  { text: "Campaigns", href: "/campaigns" },
  { text: "Dashboard", href: "/messages/dashboard" },
  { text: "HIPAA", href: "/hipaa" },
];
const Navbar = () => {
  const { data: session, status } = useSession();

  return (
    <header>
      <nav className='nav'>
        <LeftHandLogo key={'brandlogonav'}/>

        <div className='nav__menu-list'>
          {MENU_LIST.map((menu, idx) => (
            status == "authenticated" && 
            <NavItem {...menu} key={idx} />
          ))}
          <SessionButtons />
        </div>
          
      </nav>
    </header>
  );
};

function LeftHandLogo() {
  return (
  <Link href={"/"}>
    <Image src="/images/nextcare-logo.png" alt="logo" className="logo-image" width={160} height={36}  />
  </Link>
)}

export default Navbar;