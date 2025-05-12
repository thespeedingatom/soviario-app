"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { NeoButton } from "./ui/neo-button" // Assuming this is your custom button

// Placeholder for actual form components or logic
const SignInForm = () => {
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // TODO: Implement actual sign-in logic
    // Example: call a server action or API route
    // For Shopify login, this might redirect to /api/auth/shopify/login
    alert("Sign In Submitted (Placeholder)");
    // Potentially redirect to Shopify login:
    // window.location.href = "/api/auth/shopify/login";
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="email-signin">Email</Label>
        <Input id="email-signin" type="email" placeholder="me@example.com" required />
      </div>
      <div>
        <Label htmlFor="password-signin">Password</Label>
        <Input id="password-signin" type="password" required />
      </div>
      <NeoButton type="submit" className="w-full neobrutalist-button">Sign In</NeoButton>
      <p className="text-sm text-center text-muted-foreground">
        Or continue with Shopify for a seamless experience.
      </p>
      <NeoButton 
        type="button" 
        variant="outline" 
        className="w-full neobrutalist-border"
        onClick={() => window.location.href = "/api/auth/shopify/login"}
      >
        Sign In with Shopify
      </NeoButton>
    </form>
  );
};

const SignUpForm = () => {
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // TODO: Implement actual sign-up logic
    alert("Sign Up Submitted (Placeholder)");
  };
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name-signup">Full Name</Label>
        <Input id="name-signup" type="text" placeholder="Your Name" required />
      </div>
      <div>
        <Label htmlFor="email-signup">Email</Label>
        <Input id="email-signup" type="email" placeholder="me@example.com" required />
      </div>
      <div>
        <Label htmlFor="password-signup">Password</Label>
        <Input id="password-signup" type="password" required />
      </div>
      <NeoButton type="submit" className="w-full neobrutalist-button">Create Account</NeoButton>
       <p className="text-sm text-center text-muted-foreground">
        Alternatively, sign up using your Shopify account.
      </p>
      <NeoButton 
        type="button" 
        variant="outline" 
        className="w-full neobrutalist-border"
        onClick={() => window.location.href = "/api/auth/shopify/login"} // Shopify handles signup too
      >
        Sign Up with Shopify
      </NeoButton>
    </form>
  );
};

export function AuthSheet() {
  const [open, setOpen] = useState(false);
  // TODO: Determine if user is authenticated to change trigger button text/action
  // For now, the trigger will always be "Sign In / Sign Up"

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {/* This button will be placed in the Header */}
        <NeoButton variant="default" className="neobrutalist-button">
          Sign In / Sign Up
        </NeoButton>
      </SheetTrigger>
      <SheetContent className="neobrutalist-sheet w-full max-w-md border-l-4 border-black p-0 sm:max-w-lg">
        <SheetHeader className="border-b-4 border-black p-6 text-center">
          <SheetTitle className="text-2xl font-bold">Welcome to Soravio</SheetTitle>
          <SheetDescription>
            Sign in or create an account to manage your eSIMs.
          </SheetDescription>
        </SheetHeader>
        <div className="p-6">
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2 neobrutalist-border mb-4">
              <TabsTrigger value="signin" className="neobrutalist-tab-trigger">Sign In</TabsTrigger>
              <TabsTrigger value="signup" className="neobrutalist-tab-trigger">Sign Up</TabsTrigger>
            </TabsList>
            <TabsContent value="signin">
              <SignInForm />
            </TabsContent>
            <TabsContent value="signup">
              <SignUpForm />
            </TabsContent>
          </Tabs>
        </div>
        <SheetFooter className="p-6 pt-0">
          {/* Optional: Add links like "Forgot Password?" here */}
          {/* <SheetClose asChild>
            <Button variant="outline">Close</Button>
          </SheetClose> */}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
