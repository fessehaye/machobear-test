import { Outlet, Link } from "@remix-run/react";
import SearchInput from "~/searchInput";

export default function DetailPage() {
  return (
    <main>
      <div className="bg-black py-8 px-4 w-full relative">
        <SearchInput />
        <Link
          to="/"
          unstable_viewTransition
          className="text-white absolute left-4 top-1/2 -translate-y-1/2 hidden lg:inline-block"
          data-testid="home-button"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="size-10"
          >
            <path d="M11.47 3.841a.75.75 0 0 1 1.06 0l8.69 8.69a.75.75 0 1 0 1.06-1.061l-8.689-8.69a2.25 2.25 0 0 0-3.182 0l-8.69 8.69a.75.75 0 1 0 1.061 1.06l8.69-8.689Z" />
            <path d="m12 5.432 8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75V21a.75.75 0 0 1-.75.75H5.625a1.875 1.875 0 0 1-1.875-1.875v-6.198a2.29 2.29 0 0 0 .091-.086L12 5.432Z" />
          </svg>
        </Link>
      </div>
      <div className="py-20 px-4 w-full max-w-[800px] mx-auto">
        <Outlet />
      </div>
    </main>
  );
}
