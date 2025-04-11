import { createContext, useCallback, useContext, useState } from "react";
import { HCESession, NFCTagType4, NFCTagType4NDEFContentType } from "react-native-hce";

interface NFCContextContent {
    start: (content: string) => Promise<void>, 
    stop: () => Promise<void>
}

const NfcContext = createContext<NFCContextContent | null>(null)

export function UseNFCContext() {
    const nfc = useContext(NfcContext)
    if (!nfc)
        throw new Error('NFCProvider not found')
    return nfc
}

export function NFCProvider({ children }: {children: React.ReactNode}) {
    const [session, setSession] = useState<HCESession | undefined>()

    const startSession = useCallback(async (content: string) => {
        const _session = session || await (async () => {
            const _session = await HCESession.getInstance()
            setSession(_session)
            return _session
        })()

        const tag = new NFCTagType4({
            type: NFCTagType4NDEFContentType.Text,
            content,
            writable: false
        })
        
        _session.setApplication(tag)
        await _session.setEnabled(true)
    }, [])

    const stopSession = useCallback(async () => {
        if (!session)
            return

        await session.setEnabled(false)
    }, [session])

    return (
        <NfcContext.Provider value={{ start: startSession, stop: stopSession }}>
            {children}
        </NfcContext.Provider>
    )
}