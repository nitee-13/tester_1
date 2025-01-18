"use client";

import { SignIn } from "@clerk/nextjs";

export default function CustomSignIn() {
  return (
    <div className="flex min-h-screen justify-center items-center">
      <SignIn
        appearance={{
          elements: {
            rootBox: "mx-auto",
            card: "shadow-xl",
          },
        }}
      />
    </div>
  );
} 