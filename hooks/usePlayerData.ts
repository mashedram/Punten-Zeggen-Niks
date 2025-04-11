import { useTRPC } from '@/api/query';
import { useMutation, useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";
import { MMKV, useMMKVString } from 'react-native-mmkv'

const TOKEN_STORAGE_KEY = 'token.value'

interface LocalPlayer {
    id: string
}

/**
 * Custom hook to manage player data and lobby interactions.
 *
 * This hook interacts with the TRPC API to fetch player data and handle
 * joining a lobby. It utilizes a local storage mechanism to persist
 * the player's token.
 *
 * @returns A tuple containing:
 *   - LocalPlayer | undefined: The current player's data if available, otherwise undefined.
 *   - Function: A callback function to join a lobby using a lobby code.
 */
export function usePlayerData(): [LocalPlayer | undefined, (code: string) => void] {
    const trpc = useTRPC()

    const [token, setToken] = useMMKVString(TOKEN_STORAGE_KEY)
    
    const playerQuery = useQuery(trpc.lobby.getPlayer.queryOptions({ token: token! }, { enabled: token != undefined }))
    const joinMutation = useMutation(trpc.lobby.joinLobby.mutationOptions({
        onSuccess: (data) => {
            setToken(data)
        }
    }))

    const joinLobbyCallback = (code: string) => {
        joinMutation.mutate({ code })
    }

    return [!playerQuery.isLoading && playerQuery.data || undefined, joinLobbyCallback] as const
}