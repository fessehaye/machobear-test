import { Outlet } from "@remix-run/react";
import SearchInput from "~/searchInput";

export default function DetailPage() {
  return (
    <main>
      <div className="bg-black py-8 px-4 w-full">
        <SearchInput />
      </div>
      <div className="py-20 px-4 w-full max-w-[800px] mx-auto">
        <Outlet />
      </div>
    </main>
  );
}
