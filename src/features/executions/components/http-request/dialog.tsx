"use client"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Field,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
    FieldLegend,
    FieldSeparator,
    FieldSet,
} from "@/components/ui/field"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, Controller } from "react-hook-form"
import { useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const formSchema = z.object({
    endpoint: z.url({ message: "Please enter a valid url" }),
    method: z.enum(["GET", "POST", "PUT", "PATCH", "DELETE"]),
    body: z.string().optional()
    // .refine() TODO
})

export type HttpFormType = z.infer<typeof formSchema>;

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (values: HttpFormType) => void;
    defaultEndpoint?: string;
    defaultMethod?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
    defaultBody?: string;
}

export const HttpRequestDialog = ({
    open,
    onOpenChange,
    onSubmit,
    defaultEndpoint = "",
    defaultMethod = "GET",
    defaultBody = ""
}: Props) => {

    const form = useForm<HttpFormType>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            endpoint: defaultEndpoint,
            method: defaultMethod,
            body: defaultBody,
        }
    })

    useEffect(() => {
        if (open) {
            form.reset({
                endpoint: defaultEndpoint,
                method: defaultMethod,
                body: defaultBody
            })
        }
    }, [open, defaultEndpoint, defaultMethod, defaultBody, form]);

    const watchMethod = form.watch("method");
    const showBodyField = ["POST", "PUT", "PATCH"].includes(watchMethod);

    const handleSubmit = (values: HttpFormType) => {
        console.log("testing", values)
        onSubmit(values);
        onOpenChange(false)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>HTTP Request</DialogTitle>
                    <DialogDescription>
                        Configure settings for the HTTP Request node.
                    </DialogDescription>
                </DialogHeader>
                <form id="form-http-request" onSubmit={form.handleSubmit(handleSubmit)}
                    className="space-y-8 mt-4 h-[calc(100vh-200px)] overflow-y-auto"
                >
                    <FieldGroup>
                        <Controller
                            name="method"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="form-http-request-method">
                                        Method
                                    </FieldLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select a method" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel>Fruits</SelectLabel>
                                                <SelectItem value="GET">GET</SelectItem>
                                                <SelectItem value="POST">POST</SelectItem>
                                                <SelectItem value="PUT">PUT</SelectItem>
                                                <SelectItem value="PATCH">PATCH</SelectItem>
                                                <SelectItem value="DELETE">DELETE</SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                    <FieldDescription className="text-xs">
                                        The HTTP method to use for this request
                                    </FieldDescription>
                                </Field>
                            )}
                        />
                        <Controller
                            name="endpoint"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="form-http-request-endpoint">
                                        Endpoint URL
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        id="form-http-request-endpoint"
                                        aria-invalid={fieldState.invalid}
                                        placeholder="http://api.example.com/users/{{httpResponse.data.id}}"
                                    />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                    <FieldDescription className="text-xs">
                                        Static URL or use {"{{variables}}"} for simple values or
                                        {"{{json variable}}"} to stringify objects
                                    </FieldDescription>
                                </Field>
                            )}
                        />
                        {showBodyField && (
                            <Controller
                                name="body"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="form-http-request-body">
                                            Request Body
                                        </FieldLabel>
                                        <Textarea
                                            {...field}
                                            id="form-http-request-body"
                                            aria-invalid={fieldState.invalid}
                                            placeholder={
                                                `{\n"userId": "{{httpResponse.data.id}}",\n"name": "{{httpResponse.data.name}}",\n"items": "{{httpResponse.data.items}}"\n}`
                                            }
                                            className="min-h-[120px] font-mono text-sm"
                                        />
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                        <FieldDescription className="text-xs">
                                            JSON with template variables. Use {"{{variables}}"}
                                            for simple values or {"{{json variables}}"} to strigify objects
                                        </FieldDescription>
                                    </Field>
                                )}
                            />
                        )}
                    </FieldGroup>
                    <DialogFooter className="mt-4">
                        <Button type="submit">Save</Button>
                    </DialogFooter>
                </form>
            </DialogContent>

        </Dialog>
    )
}