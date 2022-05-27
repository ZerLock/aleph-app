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
import {post, store} from "aleph-sdk-ts";
import { ethereum } from "aleph-sdk-ts/accounts";
import { ItemType } from "aleph-sdk-ts/messages/message";

type UploadModalType = {
    isOpen: boolean;
    onClose: () => void;
    account: ethereum.ETHAccount;
};

const UploadModal = ({ isOpen, onClose, account }: UploadModalType): JSX.Element => {
    const [selectedFile, setSelectedFile] = useState<File>(new File([], ""));
    const toast = useToast();

    const handleSubmit = async () => {
        const confirmation = await store.Publish({
            channel: "TEST",
            account: account,
            fileObject: selectedFile,
            storageEngine: ItemType.storage,
            APIServer: DEFAULT_API_V2,
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
                    hashes: confirmation.content.item_hash,
                    fileType: "file",
                    name: selectedFile.name,
                }
            });
            if (conf) {
                toast({
                    title: "Upload successful",
                    description: "Your file has been uploaded successfully",
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                });
            } else {
                toast({
                    title: "Upload failed",
                    description: "Your file has not been uploaded",
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                });
            }
        } else {
            toast({
                title: "Upload failed",
                description: "Your file has not been uploaded",
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
                        <Text fontSize="2xl">Upload file on Aleph nodes</Text>
                    </ModalHeader>

                    <ModalBody>
                        <Input
                            type="file"
                            paddingTop="4px"
                            _focus={{ outline: 'none' }}
                            onChange={(e: any) => {
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

export default UploadModal;