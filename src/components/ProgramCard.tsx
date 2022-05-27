import {
    Text,
    Button,
    Center,
    Stack,
} from '@chakra-ui/react';

type CardType = {
    hash: string;
    name: string;
}

const ProgramCard = ({ hash, name }: CardType): JSX.Element => (
    <>
        <Stack
            direction={['column']}
            padding="5px"
            minW="20%"
            borderRadius="20px"
            border="2px solid"
            borderColor="teal.600"
        >
            <Center>
                <Text fontSize="xl">{name}</Text>
            </Center>
            <Center>
                <Button as='a' href={"https://aleph.sh/vm/" + hash} target="_blank" colorScheme="teal" variant="solid">Visit</Button>
            </Center>
        </Stack>
    </>
);

export default ProgramCard;