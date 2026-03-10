import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { subscriptionService } from "../api/subscription.service";
import toast from "react-hot-toast";

export const useGetSubscriptions = () => {
    return useQuery({
        queryKey: ["subscriptions"],
        queryFn: subscriptionService.getAllSubscription,
    });
};

export const useAddSubscription = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: subscriptionService.createSubscription,
        onSuccess: () => {
            toast.success("Subscription added successfully!");
            queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "Failed to add subscription.");
        },
    });
};

export const useCancelSubscription = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: subscriptionService.cancelSubscription,
        onSuccess: () => {
            toast.success("Subscription cancelled.");
            queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "Failed to cancel subscription.");
        },
    });
};

export const useDeleteSubscription = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: subscriptionService.deleteSubscription,
        onSuccess: () => {
            toast.success("Subscription deleted.");
            queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "Failed to delete subscription.");
        },
    });
};

export const useResumeSubscription = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: subscriptionService.resumeSubscription,
        onSuccess: () => {
            toast.success("Subscription resumed.");
            queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "Failed to resume subscription.");
        },
    });
};

export const useUpdateSubscription = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: subscriptionService.updateUserSubscription,
        onSuccess: () => {
            toast.success("Subscription updated.");
            queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "Failed to update subscription.");
        },
    });
};
