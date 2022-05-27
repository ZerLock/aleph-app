import {useEffect, useState, useReducer} from 'react';
import {
    Button,
    Center,
    Grid,
    GridItem,
    Link,
    Modal,
    ModalBody,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    Stack,
    Text,
    Textarea,
    useDisclosure,
    useToast,
} from "@chakra-ui/react";
import Navbar from "../components/Navbar";
import UploadButton from "../components/UploadButton";
import ProgramButton from "../components/ProgramButton";
import FileCard from "../components/FileCard";
import ProgramCard from "../components/ProgramCard";

import { DEFAULT_API_V2 } from "aleph-sdk-ts/global"
import { post } from "aleph-sdk-ts";
import { ethereum } from "aleph-sdk-ts/accounts";

type CardType = {
    hash: string;
    name: string;
    fileTypes: string;
};

const Home = (): JSX.Element => {
    const [eth_account, setAccount] = useState<ethereum.ETHAccount>();
    const [mnemonics, setMnemonics] = useState<string>("");
    let [files] = useState<CardType[]>([]);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [, forceUpdate] = useReducer((x: any) => x + 1, 0);
    const toast = useToast();

    useEffect(() => {
        onOpen();
    }, [onOpen]);

    const refreshPage = async () => {
        forceUpdate();
    }

    const getFiles = async (account: ethereum.ETHAccount) => {
        const userHashes = await post.Get({
            APIServer: DEFAULT_API_V2,
            types: '',
            pagination: 200,
            page: 1,
            refs: [],
            addresses: [account.address],
            tags: [],
            hashes: [],
        });
        let posts: string[] = [];
        let names: string[] = [];
        let filesType: string[] = [];
        userHashes.posts.forEach((hash: any) => posts.push(hash.content.hashes.toString()));
        userHashes.posts.forEach((hash: any) => names.push(hash.content.name.toString()));
        userHashes.posts.forEach((hash: any) => filesType.push(hash.content.fileType));
        for (let i = 0; i < posts.length; i++) {
            let file: CardType = {hash: posts[i], name: names[i], fileTypes: filesType[i]} as CardType;
            files.push(file);
        }
    }

    const handleLoginAccount = async () => {
        if (mnemonics.length === 0) {
            toast({
                title: "Error",
                description: "Please enter your mnemonics",
                status: "error",
                duration: 3000,
                isClosable: true,
            })
            return;
        }
        let account;
        try {
            account = ethereum.ImportAccountFromMnemonic(mnemonics);
        } catch(e) {
            toast({
                title: "Error",
                description: "Please enter a valid mnemonics",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
            return;
        }
        setAccount(account);
        onClose();
        toast({
            title: "Account connected",
            description: "You can now upload files",
            status: "success",
            duration: 3000,
            isClosable: true,
        });
        await getFiles(account);
        refreshPage();
    }

    const handleCreateAccount = () => {
        const account = ethereum.NewAccount();
        setAccount(account.account);
        setMnemonics(account.mnemonic);
        toast({
            title: "Account created",
            description: "Your account has been created",
            status: "success",
            duration: 3000,
            isClosable: true,
        });
        toast({
            title: "Information",
            description: "Please, copy your mnemonics",
            status: "info",
            duration: 3000,
            isClosable: true,
        });
    }

    return (
        <>
            <Navbar account={eth_account} />
            <Grid templateColumns='repeat(5, 1fr)' gap={6} margin="20px">
                {files.map(file => (
                    <GridItem key={file.name}>
                        {file.fileTypes === "file" ?
                            <FileCard hash={file.hash} name={file.name} />
                        :
                            <ProgramCard hash={file.hash} name={file.name} />
                        }
                    </GridItem>
                ))}
            </Grid>
            <Stack
                direction={['row']}
                position='fixed'
                bottom='20px'
                right={['20px', '20px']}
                zIndex={1}
            >
                <UploadButton account={eth_account} />
                <ProgramButton account={eth_account} />
            </Stack>
            <Modal isOpen={isOpen} onClose={onClose} closeOnEsc={false} closeOnOverlayClick={false} size="xl">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>
                        <Center>
                            <Text fontSize="2xl">Login</Text>
                        </Center>
                    </ModalHeader>
                    <ModalBody>
                        <Center>
                            <Stack direction={['column']}>
                                <Textarea
                                    w="40vh"
                                    resize="none"
                                    value={mnemonics}
                                    onChange={(e: any) => setMnemonics(e.target.value)}
                                />
                                <Button
                                    colorScheme="teal"
                                    variant="solid"
                                    onClick={async () =>await handleLoginAccount()}
                                >
                                    Login with credentials
                                </Button>
                                <Center>
                                    <Stack spacing="2" direction={['row']}>
                                        <Text>Not register yet ?</Text>
                                        <Link color="gray.600" onClick={() => handleCreateAccount()}>Create an account</Link>
                                    </Stack>
                                </Center>
                            </Stack>
                        </Center>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    );
};

export default Home;
