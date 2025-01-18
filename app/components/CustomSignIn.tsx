"use client";

import { SignIn } from "@clerk/nextjs";

export default function CustomSignIn() {
  return (
    <div className="flex min-h-screen justify-center items-center">
      <SignIn
        path="/sign-in"
        routing="path"
        signUpUrl="/sign-up"
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