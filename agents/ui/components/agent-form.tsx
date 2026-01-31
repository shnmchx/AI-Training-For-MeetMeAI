import { useTRPC } from "@/trpc/client"
import { AgentGetOne } from "../../types"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { agentsInsertSchema } from "../../schemas"
import { zodResolver } from "@hookform/resolvers/zod"
import { GeneratedAvatar } from "@/components/generated-avatar"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { toast } from "sonner"
import { useRouter } from "next/navigation"


interface AgentFormProps {
    onSuccess?: () => void
    onCancel?: () => void
    initialValues?: AgentGetOne
}

export const AgentForm = ({
    onSuccess,
    onCancel,
    initialValues,
}: AgentFormProps) => {	
    const trpc = useTRPC();
    const router = useRouter();
    const queryClient = useQueryClient();

    const createAgent = useMutation(
        trpc.agents.create.mutationOptions({
            onSuccess: async () => { 
                await queryClient.invalidateQueries(
                    trpc.agents.getMany.queryOptions({})
                )
                await queryClient.invalidateQueries(
                    trpc.premium.getFreeUsage.queryOptions()
                )
                onSuccess?.()
            },
            onError: (error) => {
                toast.error(error.message)

                if (error.data?.code === "FORBIDDEN") {

                }
            },
        })
    )

    const updateAgent = useMutation(
        trpc.agents.update.mutationOptions({
            onSuccess: async () => {
                await queryClient.invalidateQueries(
                    trpc.agents.getMany.queryOptions({})
                )

                if (initialValues?.id) {
                    await queryClient.invalidateQueries(
                        trpc.agents.getOne.queryOptions({
                            id: initialValues.id
                        })
                    )
                }
                onSuccess?.()
            },
            onError: (error) => {
                toast.error(error.message)

                if (error.data?.code === "FORBIDDEN") {
                    router.push("/upgrade");
                }
            },
        })
    )

    const form = useForm<z.infer<typeof agentsInsertSchema>>({
        resolver: zodResolver(agentsInsertSchema),
        defaultValues: {
            name: initialValues?.name || "",
            instructions: initialValues?.instructions || ""
        }
    })

    const isEdit = !!initialValues?.id
    const isPending = createAgent.isPending || updateAgent.isPending  

    const onSubmit = (values: z.infer<typeof agentsInsertSchema>) => {
        if (isEdit) {
            updateAgent.mutate({
                ...values,
                id: initialValues.id
            })
        } else {
            createAgent.mutate(values)
        }
    }

    return (
        <div className="max-w-md w-full mx-auto p-6 bg-white rounded-xl shadow-sm border border-gray-200 space-y-6">
            {/* Avatar Section */}
            <div className="flex flex-col items-center space-y-4">
                <GeneratedAvatar
                    seed={form.watch("name")}
                    variant="botttsNeutral"
                    className="border-2 border-gray-200 size-24"
                />
                <h2 className="text-2xl font-semibold text-gray-800">
                    {isEdit ? "Edit Agent" : "Create New Agent"}
                </h2>
            </div>

            <Form {...form}>
                <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
                    <FormField
                        name="name"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel htmlFor="name" className="text-base font-medium text-gray-700">
                                    Agent Name
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        id="name"
                                        {...field}
                                        placeholder="e.g., Tax Tutor"
                                        className="mt-1"
                                    />
                                </FormControl>
                                <FormMessage className="text-sm text-red-500" />
                            </FormItem>
                        )}
                    />

                    <FormField
                        name="instructions"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel htmlFor="instructions" className="text-base font-medium text-gray-700">
                                    Instructions
                                </FormLabel>
                                <FormControl>
                                    <Textarea
                                        id="instructions"
                                        {...field}
                                        placeholder="You are an intelligent math AI assistant who can answer questions and help me with my homework."
                                        className="mt-1 min-h-[120px] resize-none"
                                    />
                                </FormControl>
                                <FormMessage className="text-sm text-red-500" />
                            </FormItem>
                        )}
                    />
                    
                    <div className="flex justify-between gap-x-3 pt-2">
                        {onCancel && (
                            <Button
                                variant="outline"
                                disabled={isPending}
                                type="button"
                                onClick={() => onCancel()}
                                className="flex-1"
                            >
                                Cancel
                            </Button>
                        )}
                        <Button
                            disabled={isPending}
                            type="submit"
                            className="flex-1"
                        >
                            {isPending ? (
                                <div className="flex items-center gap-2">
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    {isEdit ? "Updating..." : "Creating..."}
                                </div>
                            ) : (
                                isEdit ? "Update Agent" : "Create Agent"
                            )}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}