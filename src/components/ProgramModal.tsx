import { useState } from 'react';
import {
    Text,
    Button,
    Input,
    Stack,
    Modal,
    ModalContent,
    ModalOverlay,
    ModalHeader,
    ModalFooter,
    ModalBody,
    useToast,
} from '@chakra-ui/react';

import { DEFAULT_API_V2 } from "aleph-sdk-ts/global"
import { program, post } from "aleph-sdk-ts";
import { ethereum } from "aleph-sdk-ts/accounts";
import { ItemType } from "aleph-sdk-ts/messages/message";

type UploadModalType = {
    isOpen: boolean;
    onClose: () => void;
    account: ethereum.ETHAccount;
};

const ProgramModal = ({ isOpen, onClose, account }: UploadModalType): JSX.Element => {
    const [selectedFile, setSelectedFile] = useState<File>(new File([], ""));
    const [programName, setProgramName] = useState<string>("");
    const toast = useToast();

    const handleSubmit = async () => {
        const confirmation = await program.publish({
            account: account,
            channel: "TEST",
            storageEngine: ItemType.storage,
            inlineRequested: true,
            APIServer: DEFAULT_API_V2,
            file: selectedFile,
            entrypoint: "main:app",
        });
        if (confirmation) {
            const conf = await post.Publish({
                APIServer: DEFAULT_API_V2,
                channel: "TEST",
                inlineRequested: true,
                storageEngine: ItemType.ipfs,
                account: account,
                postType: "",
                content: {
                    headers: "Hashes My App",
                    hashes: confirmation.item_hash,
                    fileType: "program",
                    name: programName,
                }
            });
            if (!conf) {
                toast({
                    title: "Upload failed",
                    description: "Your file has not been uploaded",
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                });
                return;
            }
            toast({
                title: "Program uploaded",
                description: "Program uploaded to Aleph",
                status: "success",
                duration: 3000,
                isClosable: true,
            });
            toast({
                title: "Visit your program",
                description: "https://aleph.sh/vm/" + confirmation.item_hash,
                status: "success",
                duration: 3000,
                isClosable: true,
            });
        } else {
            toast({
                title: "Upload failed",
                description: "Something went wrong",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        }
        onClose();
    }

    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>
                        <Text fontSize="2xl">Upload program on Aleph nodes</Text>
                    </ModalHeader>

                    <ModalBody marginTop={"-20px"}>
                        <Text fontSize="lg">⚠️ Only .zip files and python servers</Text>
                    </ModalBody>
                    <ModalBody>
                        <Stack direction={['column']} spacing="5">
                            <Input placeholder="program name" value={programName} onChange={(e: any) => setProgramName(e.target.value)} />
                            <Input
                                type="file"
                                accept=".zip"
                                paddingTop="4px"
                                _focus={{ outline: 'none' }}
                                onChange={(e: any) => {
                                    if (e.target.files !== null)
                                        setSelectedFile(e.target.files[0])
                                }}
                            />
                        </Stack>
                    </ModalBody>

                    <ModalFooter>
                        <Stack direction={['row']}>
                            <Button
                                colorScheme="teal"
                                variant="outline"
                                onClick={onClose}
                            >
                                Close
                            </Button>
                            <Button
                                colorScheme="teal"
                                variant="solid"
                                disabled={!(selectedFile !== undefined) && !(programName !== "")}
                                onClick={async () => await handleSubmit()}
                            >
                                Upload
                            </Button>
                        </Stack>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}

export default ProgramModal;