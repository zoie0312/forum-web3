import { useState } from "react";
import "@rainbow-me/rainbowkit/styles.css";
import {
  ConnectButton,
  getDefaultWallets,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";
import { chain, configureChains, createClient, WagmiConfig } from "wagmi";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import { ChakraProvider } from "@chakra-ui/react";
import {
  Box,
  Square,
  VStack,
  HStack,
  Button,
  Input,
  List,
  ListItem,
} from "@chakra-ui/react";

const { chains, provider } = configureChains(
  [chain.mainnet, chain.polygon, chain.optimism, chain.arbitrum],
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
  const [messages, setMessages] = useState([]);
  const [announcement, setAnnouncement] = useState("");
  const [userInput, setUserInput] = useState("");

  const handleChange = (event) => setUserInput(event.target.value);
  const onSendBtnClick = () => {
    alert("going to send message");
    setMessages((msgs) =>
      msgs.push({
        text: userInput,
        sender: "0x3345",
      })
    );
    setUserInput("");
  };
  const onAnnounceBtnClick = () => {
    alert("going to make an announcement");
  };
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
            <Square flex={1} width="100%">
              <VStack h="95%" w="95%" spacing={"3"} alignItems="stretch">
                <HStack bg="tomato" h="10vh" alignItems={"center"}>
                  <Box flex={1} p={2} color="white">
                    公告：
                  </Box>
                  <Box flex={7} p={2} color="white">
                    {announcement}
                  </Box>
                </HStack>
                <List
                  h="60vh"
                  overflowY={"scroll"}
                  spacing="3"
                  borderRadius={10}
                  border="solid"
                  borderWidth={2}
                >
                  {messages.map((msg) => (
                    <ListItem p="2" flexDirection={"column"}>
                      <Box>{msg.text}</Box>
                      <HStack justifyContent={"space-between"}>
                        <Box flex="1" />
                        <Box>{msg.sender}</Box>
                      </HStack>
                    </ListItem>
                  ))}
                </List>
                <VStack h="11vh" alignItems="stretch">
                  <Input
                    placeholder="input message to send"
                    size="md"
                    value={userInput}
                    onChange={handleChange}
                  />
                  <HStack justifyContent="center">
                    <Button
                      size="sm"
                      colorScheme="teal"
                      variant="solid"
                      onClick={onSendBtnClick}
                    >
                      Send
                    </Button>
                    <Button
                      size="sm"
                      colorScheme="teal"
                      variant="solid"
                      onClick={onAnnounceBtnClick}
                    >
                      pay at least {} eth to announce
                    </Button>
                  </HStack>
                </VStack>
              </VStack>
            </Square>
          </div>
        </ChakraProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}
