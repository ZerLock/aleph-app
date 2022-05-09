import { useEffect, useState } from 'react';
import {
    Text,
    Button,
    Center,
    Stack,
} from '@chakra-ui/react';

import { DEFAULT_API_V2 } from "aleph-sdk-ts/global"
import { store } from "aleph-sdk-ts";
import fileDownload from "js-file-download";

type CardType = {
    hash: string;
    name: string;
};

const FileCard = ({ hash, name }: CardType): JSX.Element => {

    const [file, setFile] = useState<File>();

    useEffect(() => {
        (async () => {
            const arrBuff = await store.Get({
                APIServer: DEFAULT_API_V2,
                fileHash: hash,
            });
            let new_file = new File([arrBuff], name, { type: "text/plain" });
            setFile(new_file);
        })();
    }, []);

    return (
        <>
            <Stack direction={['column']} bg="blue.300" padding="5px" minW="20%" borderRadius="20px">
                <Center>
                    <Text>{name}</Text>
                </Center>
                <Center>
                    <Button colorScheme="teal" variant="solid" onClick={() => {if (file) fileDownload(file, file.name)}}>Download</Button>
                </Center>
            </Stack>
        </>
    );
};

export default FileCard;