import {
    useEffect,
    useState
} from 'react';
import {
    Center,
    Box,
    Textarea,
    Text,
    Button,
    Grid,
    GridItem,
    Stack,
    Link,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    useDisclosure,
    useToast,
} from "@chakra-ui/react";
import Navbar from "../components/Navbar";
import UploadButton from "../components/UploadButton";
import FileCard from "../components/FileCard";

import { DEFAULT_API_V2 } from "aleph-sdk-ts/global"
import { post } from "aleph-sdk-ts";
import { ethereum } from "aleph-sdk-ts/accounts";

type CardType = {
    hash: string;
    name: string;
};

const Home = (): JSX.Element => {
    const [eth_account, setAccount] = useState<ethereum.ETHAccount>();
    const [mnemonics, setMnemonics] = useState<string>("");
    let [files, setFiles] = useState<CardType[]>([]);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();

    useEffect(() => {
        onOpen();
    }, [onOpen]);

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
        // @ts-ignore
        userHashes.posts.forEach(hash => posts.push(hash.content.hashes.toString()));
        // @ts-ignore
        userHashes.posts.forEach(hash => names.push(hash.content.name.toString()));
        for (let i = 0; i < posts.length; i++) {
            let file: CardType = {hash: posts[i], name: names[i]} as CardType;
            console.log(file);
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
                    <GridItem>
                        <FileCard name={file.name} hash={file.hash} />
                    </GridItem>
                ))}
            </Grid>
            <Box position='fixed'
                bottom='20px'
                right={['20px', '20px']}
                zIndex={1}
            >
                <UploadButton account={eth_account} />
            </Box>
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
                                    onChange={(e) => setMnemonics(e.target.value)}
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
