"use client"; // Not a standard JavaScript or TypeScript directive

import Live from "@/components/Live";
import LeftSidebar from "@/components/LeftSidebar";
import RightSidebar from "@/components/RightSidebar";

export default function Page() {
  return (
    <main className="h-screen overflow-hidden">
      {/* Uncomment to include Navbar */}
      {/* <Navbar /> */}
      
      {/* Flex container for sidebar and Live component */}
      <section className="flex h-full flex-row">
        <LeftSidebar />
        <Live />
        <RightSidebar />
      </section>
    </main>
  );
}
