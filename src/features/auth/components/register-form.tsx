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

const registerSchema = z.object({
    email: z.email("Please enter a valid email address"),
    password: z.string().min(1, "Password is required"),
    confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
    message: "Password do not match",
    path: ["confirmPassword"]
})

type RegisterFormValues = z.infer<typeof registerSchema>;


const RegisterForm = () => {
    const router = useRouter();
    const form = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            email: '',
            password: "",
            confirmPassword: ""
        }
    });

    const onSubmit = async (values: RegisterFormValues) => {
        console.log("values", values)
        await authClient.signUp.email({
            name: values.email,
            email: values.email,
            password: values.password,
            callbackURL: "/"
        }, {
            onSuccess: () => {
                router.push('/')
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
                    <CardTitle>Get Started</CardTitle>
                    <CardDescription>Create your account to get started</CardDescription>
                </CardHeader>
                <CardContent className='flex justify-center'>
                    <form className='w-1/2' id="register-form" onSubmit={form.handleSubmit(onSubmit)}>
                        <div className='grid gap-6'>
                            <div className="flex flex-col gap-4">
                                <Button variant="outline" className='w-full cursor-pointer' type='button' disabled={isPending} >
                                    Continue with Github
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
                                <Controller
                                    name="confirmPassword"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field className='gap-1'>
                                            <FieldLabel>Confirm Password</FieldLabel>
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
                    <Button disabled={isPending} className='w-1/2' type="submit" form="register-form">Sign up</Button>
                    <div className='text-center text-sm'>
                        Already have an account? <Link href="/login" className='underline underline-offset-4' >Login</Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default RegisterForm