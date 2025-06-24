"use client";

import Link from "next/link";
import Logo from "./logo";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { ThemeToggle } from "./theme-toggle";
import LogoutButton from "./logout-button";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/axios";

const menuItems = [
  { name: "Accueil", href: "/" },
  { name: "Trajets", href: "/rides" },
  // { name: "À propos", href: "/about" },
  // { name: "Contact", href: "/contact" },
];

export default function Header({
  children,
}: Readonly<{
  children?: React.ReactNode;
}>) {
  const query = useQuery({
    queryKey: ["auth-user"],
    queryFn: () => apiClient.get("/auth-user"),
    refetchOnWindowFocus: false,
  });
  const [menuState, setMenuState] = useState(false);

  return (
    <header>
      <nav
        data-state={menuState && "active"}
        className="fixed w-full border-b backdrop-blur-3xl bg-background/50 z-1000">
        <div className="px-2 mx-auto max-w-7xl transition-all duration-300">
          <div className="flex relative flex-wrap gap-6 justify-between items-center py-3 lg:gap-0 lg:py-4">
            <div className="flex gap-12 justify-between items-center w-full lg:w-auto">
              <Link
                href="/"
                aria-label="home"
                className="flex items-center space-x-2">
                <Logo />
              </Link>

              <button
                onClick={() => setMenuState(!menuState)}
                aria-label={menuState == true ? "Close Menu" : "Open Menu"}
                className="relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden">
                <Menu className="in-data-[state=active]:rotate-180 in-data-[state=active]:scale-0 in-data-[state=active]:opacity-0 m-auto size-6 duration-200" />
                <X className="in-data-[state=active]:rotate-0 in-data-[state=active]:scale-100 in-data-[state=active]:opacity-100 absolute inset-0 m-auto size-6 -rotate-180 scale-0 opacity-0 duration-200" />
              </button>

              <div className="hidden lg:block">
                <ul className="flex gap-8 text-sm">
                  {menuItems.map((item, index) => (
                    <li key={index}>
                      <Link
                        href={item.href}
                        className="dark:text-white text-black block font-semibold hover:bg-linear-to-br hover:from-primary hover:from-0 hover:to-[#1a5fb4] hover:to-50 hover:text-transparent hover:bg-clip-text">
                        <span>{item.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="bg-background in-data-[state=active]:block lg:in-data-[state=active]:flex mb-6 hidden w-full flex-wrap items-center justify-end space-y-8 rounded-3xl p-6 shadow-2xl shadow-zinc-300/20 md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none dark:shadow-none dark:lg:bg-transparent">
              <div className="lg:hidden">
                <ul className="space-y-6 text-base">
                  {menuItems.map((item, index) => (
                    <li key={index}>
                      <Link
                        href={item.href}
                        className="dark:text-white text-black block hover:bg-linear-to-br hover:from-primary hover:from-0 hover:to-[#1a5fb4] hover:to-50 hover:text-transparent hover:bg-clip-text">
                        <span>{item.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex flex-col space-y-3 w-full sm:flex-row sm:gap-3 sm:space-y-0 md:w-fit">
                <ThemeToggle />
                {!query.data?.data ? (
                  <>
                    <Button asChild variant="glow">
                      <Link href="/login">
                        <span>Se connecter</span>
                      </Link>
                    </Button>
                    <Button className="dark:text-white" asChild>
                      <Link href="/register">
                        <span>S&apos;inscrire</span>
                      </Link>
                    </Button>
                  </>
                ) : (
                  <LogoutButton className="cursor-pointer dark:text-white"/>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
      {children}
    </header>
  );
}
