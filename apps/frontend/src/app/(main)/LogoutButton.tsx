'use client';

import { Button } from "@/components/ui/Button";
import { signOut } from "next-auth/react";

export function LogoutButton() {
  return (
    <Button onClick={() => signOut()}>Logout</Button>
  );
}