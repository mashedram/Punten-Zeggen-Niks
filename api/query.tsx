import { createTRPCContext } from "@trpc/tanstack-react-query";
import { AppRouter } from "@/api/router/root";

export const { TRPCProvider, useTRPC, useTRPCClient } = createTRPCContext<AppRouter>();
