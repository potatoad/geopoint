import { AuthButton } from "@/components/auth-button";
import { Hero } from "@/components/hero";
import { ThemeSwitcher } from "@/components/theme-switcher";
import Link from "next/link";
import { Suspense } from "react";

export default function Home(): React.ReactElement {
  return (
    <main className="min-h-screen flex flex-col items-center">
      <div className="flex-1 w-full flex flex-col gap-20 items-center">
        <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
          <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
            <div className="flex gap-5 items-center font-semibold">
              <Link href={"/"}>GEOpoint</Link>
            </div>
            <Suspense>
              <AuthButton />
            </Suspense>
          </div>
        </nav>
        <div className="flex-1 flex flex-col gap-20 w-full p-5">
          <Suspense>
            <Hero />
          </Suspense>
          {/*  <div className="w-full p-[1px] bg-gradient-to-r from-transparent via-foreground/10 to-transparent my-8" />
           <main className="flex-1 flex flex-col gap-6 px-4">
            <h2 className="font-medium text-xl mb-4">List of Points</h2>
            <Suspense>
              <DataList />
            </Suspense>
          </main> */}
        </div>

        <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-16">
          <p>
            Powered by{" "}
            <a
              href="https://github.com/potatoad"
              target="_blank"
              className="font-bold hover:underline"
              rel="noreferrer"
            >
              potatoad
            </a>{" "}
            🐸
          </p>
          <ThemeSwitcher />
        </footer>
      </div>
    </main>
  );
}
