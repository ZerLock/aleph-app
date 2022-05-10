import {
    Button,
    useDisclosure,
} from '@chakra-ui/react';

import ProgramModal from './ProgramModal';

const UploadButton = (props: any): JSX.Element => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    return (
        <>
            <Button colorScheme="teal" variant="solid" onClick={onOpen} >
                Upload new program
            </Button>

            <ProgramModal isOpen={isOpen} onClose={onClose} account={props.account} />
        </>
    );
}

export default UploadButton;