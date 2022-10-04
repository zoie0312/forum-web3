import { useState } from "react";
import "@rainbow-me/rainbowkit/styles.css";
import {
    ConnectButton,
    getDefaultWallets,
    RainbowKitProvider,
} from "@rainbow-me/rainbowkit";
import {
    chain,
    configureChains,
    createClient,
    WagmiConfig,
    useAccount,
} from "wagmi";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import { ChakraProvider } from "@chakra-ui/react";

import BulletBoard from "../components/BulletBoard";

const { chains, provider } = configureChains(
    [chain.mainnet, chain.polygon, chain.optimism, chain.arbitrum, chain.goerli],
    [alchemyProvider({ alchemyId: process.env.ALCHEMY_ID }), publicProvider()]
);

const { connectors } = getDefaultWallets({
    appName: "My RainbowKit App",
    chains,
});

const wagmiClient = createClient({
    autoConnect: true,
    connectors,
    provider,
});

const messages = [
    {
        text: "Hello World",
        sender: "0xRory",
    },
    {
        text: "Michale Test",
        sender: "0xRory",
    },
    {
        text: "Lorem ipsum dolor sit amet",
        sender: "0x6547658697900",
    },
    {
        text: "Woooooooooooooooooo",
        sender: "0x1A2B3C4D6547657",
    },
    {
        text: "Lorem ipsum dolor sit amet",
        sender: "0x00000000354563",
    },
    {
        text: "Hi there!!",
        sender: "0x00000000354563",
    },
];

export default function IndexPage() {
    return (
        <WagmiConfig client={wagmiClient}>
            <RainbowKitProvider chains={chains}>
                <ChakraProvider>
                    <div
                        style={{
                            width: "100vw",
                            height: "100vh",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            border: "dot",
                            borderWidth: "2px",
                        }}
                    >
                        <ConnectButton />
                        <BulletBoard />
                    </div>
                </ChakraProvider>
            </RainbowKitProvider>
        </WagmiConfig>
    );
}
