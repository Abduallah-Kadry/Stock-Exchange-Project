"use client";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { login } from "@/app/actions/login";
import { useFormState } from "react-dom";

export default function LoginPage() {
  const [state, formAction] = useFormState(login, { error: "" });

  return (
    <div className="flex items-center justify-center h-screen">
      <Card className="w-[380px] p-6">
        <h1 className="text-2xl font-semibold mb-4 text-center">Login</h1>

        <form action={formAction} className="space-y-4">
          <Input name="email" type="email" placeholder="Email" required />
          <Input name="password" type="password" placeholder="Password" required />

          {state?.error && (
            <p className="text-red-500 text-sm">{state.error}</p>
          )}

          <Button type="submit" className="w-full">Login</Button>
        </form>

        <p className="mt-4 text-center text-sm">
          Don't have an account?{" "}
          <a href="/register" className="text-blue-600 hover:underline">
            Register
          </a>
        </p>
      </Card>
    </div>
  );
}