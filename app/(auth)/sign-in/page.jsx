"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { signIn, useSession } from "next-auth/react";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../../@/components/ui/form";
import { Button } from "../../../@/components/ui/button";
import { Input } from "../../../@/components/ui/input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signInSchema } from "../../../model/Schema/signInSchema";
import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "../../../@/components/ui/card";
import { FaDiscord, FaGoogle, FaLinkedin } from "react-icons/fa";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

export default function SignInForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const response = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });
      console.log(response);
      if (response?.error) {
        toast.error(response.error);
      } else {
        router.push("/dashboard");
        toast.success("Successfull Signup");
      }
    } catch (error) {
      toast.error("Username / Password mismatched");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    await signIn("google", { callbackUrl: "/dashboard" });
  };

  const handleDiscordSignIn = async () => {
    await signIn("discord", {
      callbackUrl: "/dashboard",
      redirect: process.env.DISCORD_REDIRECT_URL,
    });
  };

  const handleLinkedInSignIn = async () => {
    await signIn("linkedin", { callbackUrl: "/dashboard" });
  };

  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [status, router]);

  return (
    <div>
      <div className="">
        <div className="flex justify-center items-center">
          <Card className="w-[23rem] max-sm:w-[19rem] border-zinc-400/10">
            <CardHeader className="p-2">
              <CardDescription className="flex flex-col gap-2 pt-5 items-center justify-center">
                <Image
                  src="/assets/logo.jpg"
                  alt=""
                  width={500}
                  height={500}
                  className="size-12 rounded-xl"
                />
                <p className="font-bold text-base">Sign in to Sanity Gaming</p>
                <p className="text-zinc-400">
                  Welcome back! Please sign in to continue.
                </p>
              </CardDescription>
            </CardHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <CardContent className="space-y-5">
                  <FormField
                    name="email"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-bold text-zinc-300">
                          Email
                        </FormLabel>
                        <Input
                          className="text-base border-zinc-400/10"
                          {...field}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="password"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-bold text-zinc-300">
                          Password
                        </FormLabel>
                        <Input
                          type="password"
                          className="text-base border-zinc-400/10"
                          {...field}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
                <CardFooter className="grid py-3 ">
                  <Button
                    className="w-full  font-bold"
                    type="submit"
                    disabled={isLoading}
                    arial-label="signin-btn"
                  >
                    {isLoading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : null}
                    Sign In
                  </Button>

                  <div className="my-2 flex items-center">
                    <div className="h-[1px] bg-zinc-400/20 w-1/2"></div>
                    <div className="mx-2 text-foreground/60 font-bold">or</div>
                    <div className="h-[1px] bg-zinc-400/20 w-1/2"></div>
                  </div>

                  <div className="text-center flex items-center justify-center gap-2">
                    <Button
                      type="button"
                      variant="default"
                      className="w-full flex gap-4"
                      onClick={handleGoogleSignIn}
                      arial-label="google-signin-btn"
                    >
                      <FaGoogle className="h-5 w-5" />
                    </Button>
                    <Button
                      type="button"
                      variant="default"
                      className="w-full flex gap-4"
                      onClick={handleDiscordSignIn}
                      arial-label="discord-signin-btn"
                    >
                      <FaDiscord className="h-5 w-5" />
                    </Button>
                    {/* <Button
                      type="button"
                      variant="default"
                      className="w-full flex gap-4"
                      onClick={handleLinkedInSignIn}
                      arial-label="discord-signin-btn"
                    >
                      <FaLinkedin className="h-5 w-5" />
                    </Button> */}
                  </div>
                  <div className="mt-10 mb-5 text-foreground/80 text-xs text-center text-zinc-400">
                    Not a member yet?{" "}
                    <Link
                      href="/sign-up"
                      className="hover:text-blue-800 underline transition-all "
                      aria-label="signup-btn"
                    >
                      Sign up
                    </Link>
                  </div>
                </CardFooter>
              </form>
            </Form>
          </Card>
        </div>
      </div>
    </div>
  );
}
