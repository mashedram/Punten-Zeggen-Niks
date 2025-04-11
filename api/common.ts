import { CreateWSSContextFnOptions } from "@trpc/server/adapters/ws"

export const createContext = (opts: CreateWSSContextFnOptions) => {
    return {
        req: opts.req
    }
}