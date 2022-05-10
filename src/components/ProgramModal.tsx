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
import { program } from "aleph-sdk-ts";
import { ethereum } from "aleph-sdk-ts/accounts";
import { ItemType } from "aleph-sdk-ts/messages/message";

type UploadModalType = {
    isOpen: boolean;
    onClose: () => void;
    account: ethereum.ETHAccount;
};

const ProgramModal = ({ isOpen, onClose, account }: UploadModalType): JSX.Element => {
    const [selectedFile, setSelectedFile] = useState<File>(new File([], ""));
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
        console.log("confirmation: https://aleph.sh/vm/" + confirmation.item_hash);
        if (confirmation) {
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
            console.log("Program uploaded!\nVisit https://aleph.sh/vm/" + confirmation.item_hash, "to see it in the VM");
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
                        <Input
                            type="file"
                            accept=".zip"
                            border="0px"
                            _focus={{ outline: 'none' }}
                            onChange={(e) => {
                                if (e.target.files !== null)
                                    setSelectedFile(e.target.files[0])
                            }}
                        />
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
                                disabled={!(selectedFile !== undefined)}
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