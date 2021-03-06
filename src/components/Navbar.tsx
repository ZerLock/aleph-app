import {
    Box,
    Flex,
    Avatar,
    Button,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    MenuDivider,
    Image,
    useColorModeValue,
    Stack,
    useColorMode,
    Center,
} from '@chakra-ui/react';
import { MoonIcon, SunIcon } from '@chakra-ui/icons';
import AlephLogo from '../assets/aleph-logo.png';

const Navbar = (props: any): JSX.Element => {
    const { colorMode, toggleColorMode } = useColorMode();

    return (
        <>
            <Box bg={useColorModeValue('gray.100', 'gray.900')} px={4}>
                <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
                    <Box>
                        <Image h="50" src={AlephLogo} />
                    </Box>

                    <Flex alignItems={'center'}>
                        <Stack direction={'row'} spacing={7}>
                            <Button onClick={toggleColorMode}>
                                {colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
                            </Button>

                            <Menu>
                            <MenuButton
                                as={Button}
                                rounded={'full'}
                                variant={'link'}
                                cursor={'pointer'}
                                minW={0}
                            >
                            <Avatar
                                size={'sm'}
                                src={'https://cdn-icons.flaticon.com/png/512/4140/premium/4140048.png?token=exp=1653640440~hmac=411409749d567ec7a22fe2711e221ce8'}
                            />
                            </MenuButton>
                                <MenuList alignItems={'center'}>
                                    <br />
                                    <Center>
                                        <Avatar
                                            size={'2xl'}
                                            src={'https://cdn-icons.flaticon.com/png/512/4140/premium/4140048.png?token=exp=1653640440~hmac=411409749d567ec7a22fe2711e221ce8'}
                                        />
                                    </Center>
                                    <br />
                                    <Center>
                                        <p style={{ padding: "10px" }}>{props.account ? props.account.address : ""}</p>
                                    </Center>
                                    <br />
                                    <MenuDivider w="100%" />
                                    <MenuItem>Logout</MenuItem>
                                </MenuList>
                            </Menu>
                        </Stack>
                    </Flex>
                </Flex>
            </Box>
        </>
    );
}

export default Navbar;