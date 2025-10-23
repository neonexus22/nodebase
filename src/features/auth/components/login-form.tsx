"use client"

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { zodResolver } from '@hookform/resolvers/zod';
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { authClient } from '@/lib/auth-client';
import Image from "next/image";

const loginSchema = z.object({
    email: z.email("Please enter a valid email address"),
    password: z.string().min(1, "Password is required")
})

type LoginFormValues = z.infer<typeof loginSchema>;


const LoginForm = () => {
    const router = useRouter();
    const form = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: ""
        }
    });

    const onSubmit = async (values: LoginFormValues) => {
        await authClient.signIn.email({
            email: values.email,
            password: values.password,
            callbackURL: "/"
        }, {
            onSuccess: () => {
                router.push("/")
            },
            onError: (ctx) => {
                toast.error(ctx.error.message)
            }
        })
    }

    const isPending = form.formState.isSubmitting;

    return (
        <div className='flex flex-col gap-6'>
            <Card>
                <CardHeader className='text-center'>
                    <CardTitle>Welcome back</CardTitle>
                    <CardDescription>Login to continue</CardDescription>
                </CardHeader>
                <CardContent>
                    <form id="login-form" onSubmit={form.handleSubmit(onSubmit)}>
                        <div className='grid gap-6'>
                            <div className="flex flex-col gap-4">
                                <Button variant="outline" className='w-full cursor-pointer' type='button' disabled={isPending} >
                                    <Image src="/github.svg" alt="github" width={20} height={20} /> Continue with Github
                                </Button>
                            </div>
                            <FieldGroup className='grid gap-6'>
                                <Controller
                                    name="email"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field className='gap-1'>
                                            <FieldLabel>Email</FieldLabel>
                                            <Input {...field}
                                                placeholder='peter@mail.com'
                                                autoComplete='off'
                                                aria-invalid={fieldState.invalid}
                                            />
                                            {fieldState.invalid && (
                                                <FieldError className='text-xs' errors={[fieldState.error]} />
                                            )}
                                        </Field>
                                    )}
                                />
                                <Controller
                                    name="password"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field className='gap-1'>
                                            <FieldLabel>Password</FieldLabel>
                                            <Input type='password' {...field} placeholder='**********'
                                                aria-invalid={fieldState.invalid} />
                                            {fieldState.invalid && (
                                                <FieldError className='text-xs' errors={[fieldState.error]} />
                                            )}
                                        </Field>
                                    )}

                                />

                            </FieldGroup>
                        </div>
                    </form>
                </CardContent>
                <CardContent className='flex flex-col gap-4 items-center'>
                    <Button disabled={isPending} className="w-full" type="submit" form="login-form">Login</Button>
                    <div className='text-center text-sm'>
                        Don't have an account? <Link href="/signup" className='underline underline-offset-4' >Sign up</Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default LoginForm