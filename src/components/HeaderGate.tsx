"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";

const pagesWithoutHeader = ["/blog/sscs2026"];

export default function HeaderGate() {
  const pathname = usePathname();
  const shouldHideHeader = pagesWithoutHeader.some(
    (page) =>
      pathname === page || (pathname && pathname.startsWith(`${page}/`)),
  );

  if (shouldHideHeader) return null;

  return <Header />;
}
