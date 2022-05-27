import {
    Button,
    useDisclosure,
} from '@chakra-ui/react';

import UploadModal from './UploadModal';

const UploadButton = (props: any): JSX.Element => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <>
            <Button colorScheme="teal" variant="solid" onClick={onOpen} >
                Upload new file
            </Button>

            <UploadModal isOpen={isOpen} onClose={onClose} account={props.account} />
        </>
    );
}

export default UploadButton;