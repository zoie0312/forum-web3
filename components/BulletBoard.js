import React, { useState } from "react";
import {
    Box,
    Square,
    VStack,
    HStack,
    Button,
    Input,
    List,
    ListItem,
    CircularProgress,
} from "@chakra-ui/react";
import { 
    useContractWrite,
    useContractRead,
    useAccount,
    useContractEvent 
} from "wagmi";
import { ethers } from 'ethers';

import { chatRoomABI, ChartRoomContractAddress } from "../abi/ChatRoom";


const BulletBoard = () => {
    const { isConnected, address } = useAccount();
    //const [messages, setMessages] = useState([]);
    const [userMoneyInput, setUserMoneyInput] = useState("");
    const [userInput, setUserInput] = useState("");

    const { write: sendMessage, status } = useContractWrite({
        addressOrName: ChartRoomContractAddress,
        contractInterface: ["function newMsg(string memory str)"],
        functionName: "newMsg",
        args: [userInput],
        chainId: 5,
    });
    const { write: announce } = useContractWrite({
        addressOrName: ChartRoomContractAddress,
        contractInterface: chatRoomABI,
        functionName: "newAnnouncement",
        args: [userInput],
        chainId: 5,
        overrides: {
            value: ethers.utils.parseUnits(userMoneyInput ? userMoneyInput : '0', 'gwei')
        }
    });
    const {
        data: messages,
        isLoading,
        isFetching: isFetchingNewMsgs,
        refetch: refetchLatestMsgs,
    } = useContractRead({
        addressOrName: ChartRoomContractAddress,
        contractInterface: [
            "function showLastestMsg(uint256 len, address user) public view returns (string[] memory)",
        ],
        functionName: "showLastestMsg",
        args: ["5", address],
        chainId: 5,
    });
    //console.log("fetched messages, ", messages);
    const { data: announcementLastPaidVal, refetch: refetchAnnouncementCost } = useContractRead({
        addressOrName: ChartRoomContractAddress,
        contractInterface: chatRoomABI,
        functionName: "announcementLastPaidVal",
    });
    //console.log("announcementLastPaidVal, ", announcementLastPaidVal);
    const { data: announcement, refetch: refetchNewAnnouncement, isFetching: isFetchingNewAnnouncement } = useContractRead({
        addressOrName: ChartRoomContractAddress,
        contractInterface: chatRoomABI,
        functionName: "announcement",
    });
    useContractEvent({
        addressOrName: ChartRoomContractAddress,
        contractInterface: ["event newMessage(address user, string message)"],
        eventName: "newMessage",
        listener: (event) => {
            // console.log(event);
            refetchLatestMsgs();
        },
    });
    useContractEvent({
        addressOrName: ChartRoomContractAddress,
        contractInterface: chatRoomABI,
        eventName: "updateAnnouncement",
        listener: (event) => {
            // console.log(event);
            refetchNewAnnouncement();
            refetchAnnouncementCost();
        },
    });
    
    const handleChange = (event) => setUserInput(event.target.value);
    const handleMoneyChange = (event) => setUserMoneyInput(event.target.value);
    const onSendBtnClick = () => {
        console.log("going to send message");
        //setMessages((msgs) => [...msgs, { text: userInput, sender: "0xRory" }]);
        sendMessage();
        setUserInput("");
    };
    const onAnnounceBtnClick = () => {
        console.log("going to make an announcement with ", userMoneyInput);
        announce();
        setUserInput("");
        setUserMoneyInput("");
    };

    const announcementCost = announcementLastPaidVal ? ethers.utils.formatUnits(announcementLastPaidVal, 'gwei') : '';
    return (
        <Square flex={1} width="100%">
            <VStack h="95%" w="95%" spacing={"3"} alignItems="stretch">
                <HStack bg="tomato" h="10vh" alignItems={"center"} borderRadius="5">
                    <Box flex={1} p={2} color="white">
                        公告：
                    </Box>
                    <Box flex={7} p={2} color="white">
                        {announcement}
                    </Box>
                    {isFetchingNewAnnouncement && <CircularProgress isIndeterminate color='green.300' />}
                </HStack>
                <List
                    h="60vh"
                    overflowY={"auto"}
                    spacing="3"
                    borderRadius={10}
                    border="solid"
                    borderWidth={2}
                >
                    {isFetchingNewMsgs && <CircularProgress isIndeterminate color='green.300' />}
                    {messages && messages.map((msg) => (
                        <ListItem
                            p="2"
                            flexDirection={"column"}
                            key={msg}
                        >
                            <Box>{msg}</Box>
                            <HStack justifyContent={"space-between"}>
                                <Box flex="1" />
                                <Box>{address}</Box>
                            </HStack>
                        </ListItem>
                    ))}
                </List>
                <VStack h="11vh" alignItems="stretch">
                    <Input
                        placeholder="input message to send"
                        size="md"
                        disabled={!isConnected}
                        value={userInput}
                        onChange={handleChange}
                    />
                    <Input
                        placeholder="How much (Gwei) do you wanna pay for making an announcement ?"
                        size="md"
                        disabled={!isConnected}
                        value={userMoneyInput}
                        onChange={handleMoneyChange}
                    />
                    <HStack justifyContent="center">
                        <Button
                            size="sm"
                            colorScheme="teal"
                            disabled={!isConnected}
                            variant="solid"
                            onClick={onSendBtnClick}
                        >
                            Send
                        </Button>
                        <Button
                            size="sm"
                            colorScheme="teal"
                            disabled={!isConnected}
                            variant="solid"
                            onClick={onAnnounceBtnClick}
                        >
                            pay more than {announcementCost} Gwei to announce
                        </Button>
                    </HStack>
                </VStack>
            </VStack>
        </Square>
    );
};

export default BulletBoard;
