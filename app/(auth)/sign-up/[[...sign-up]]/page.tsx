import React from "react";
import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (<main className=" bg-black-50 w-full mx-auto my-auto">
  <SignUp />
  </main>
  );
}