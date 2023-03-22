import React, { ReactNode } from 'react';
import {
  IconButton,
  Avatar,
  Box,
  CloseButton,
  Flex,
  HStack,
  VStack,
  Icon,
  useColorModeValue,
  Drawer,
  DrawerContent,
  Text,
  useDisclosure,
  BoxProps,
  FlexProps,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Button,
  Stack,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Center,
  Spacer,
  useMediaQuery,
  Link,
} from '@chakra-ui/react';

import {
  FiHome,
  FiTrendingUp,
  FiCompass,
  FiStar,
  FiSettings,
  FiMenu,
  FiBell,
  FiChevronDown,
  FiGlobe,
  FiFigma,
  FiEdit2,
  FiEdit3,
} from 'react-icons/fi';
import { SearchIcon} from '@chakra-ui/icons'
import { IconType } from 'react-icons';
import { ReactText } from 'react';
import { signIn, signOut, SessionProvider, useSession} from "next-auth/react"

import NextLink from 'next/link';
import Link2 from 'next/link'
import { useContext } from 'react'
import { SubsctiptionContext } from "../components/context";
import { useState } from 'react';


interface LinkItemProps {
  name: string;
  href:string
  icon: IconType;
}
const LinkItems: Array<LinkItemProps> = [
 // { name: 'Home', icon: FiHome, href: '/' },
  { name: 'Models', icon: FiGlobe, href: '/models'},
  { name: 'Train', icon: FiFigma, href: '/train'},
  { name: 'Generate', icon: FiEdit2, href: '/generate'},
  { name: 'Generate Pro', icon: FiEdit3, href: 'http://ec2-54-163-242-71.compute-1.amazonaws.com:9090/'},
//  { name: 'Chatbot', icon: FiEdit3, href: '/chatbot'},
//  { name: 'Trending', icon: FiTrendingUp, href: '/feed' },
//  { name: 'Explore', icon: FiCompass, href: '/shop' },
//  { name: 'Settings', icon: FiSettings, href: '/settings' },
];

export default function Layout2({
  children,
}: {
  children: ReactNode;
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box minH="100vh" bg={useColorModeValue('gray.100', 'gray.900')}>
      <SidebarContent
        onClose={() => onClose}
        display={{ base: 'none', md: 'block' }}
      />
      <Drawer
        autoFocus={false}
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full">
        <DrawerContent>
          <SidebarContent onClose={onClose} />
        </DrawerContent>
      </Drawer>
      {/* mobilenav */}
      <MobileNav onOpen={onOpen} />
      <Box ml={{ base: 0, md: 60 }} p="4">
        {children}
      </Box>
    </Box>
  );
}

interface SidebarProps extends BoxProps {
  onClose: () => void;
}

const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {
  return (
    <Box
      transition="3s ease"
      bg={useColorModeValue('white', 'gray.900')}
      borderRight="1px"
      borderRightColor={useColorModeValue('gray.200', 'gray.700')}
      w={{ base: 'full', md: 60 }}
      pos="fixed"
      h="full"
      {...rest}>
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Text fontSize="2xl" fontFamily="monospace" fontWeight="bold">
          Logo
        </Text>
        <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
      </Flex>
      {LinkItems.map((link) => (
        <NavItem key={link.name} icon={link.icon} href={link.href}>
          {link.name}
        </NavItem>
      ))}
    </Box>
  );
};

interface NavItemProps extends FlexProps {
  icon: IconType;
  children: ReactText;
  href: string
}
const NavItem = ({ icon, href ,children, ...rest }: NavItemProps) => {
  return (
    <Link href={href} style={{ textDecoration: 'none' }} _focus={{ boxShadow: 'none' }}>
      <Flex
        align="center"
        p="4"
        mx="4"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        _hover={{
          bg: 'cyan.400',
          color: 'white',
        }}
        {...rest}>
        {icon && (
          <Icon
            mr="4"
            fontSize="16"
            _groupHover={{
              color: 'white',
            }}
            as={icon}
          />
        )}
        {children}
      </Flex>
    </Link>
  );
};

interface MobileProps extends FlexProps {
  onOpen: () => void;
}
const MobileNav = ({ onOpen, ...rest }: MobileProps) => {

  const { data: session, status } = useSession()
  const [query, setQuery] = useState("");   
  const {subscribed, setSubscribed} = useContext(SubsctiptionContext);
  const SERVER_URL =  'http://localhost:9090/v1.0'


  const subscribe = async (event) => {
    event.preventDefault();
    const res = await fetch(SERVER_URL + "/subscribe/stripe" , {
        headers: new Headers({
          'accept': '*/*',
          'content-type': 'application/json'
        }),
        //mode: 'no-cors',
        method: "GET"
       // redirect: 'follow'
    })

      const result = await res.json() //.json()
      //window.location.href = test.link_stripe
      window.open(result.link_stripe, '_blank', 'noopener,noreferrer');
  }  

  const billing = async (event) => {
    event.preventDefault();
    const body = JSON.stringify({
      "customer_id": session?.user.customerId,
      "return_url" : "http://localhost:3000/test"
    })
    const res = await fetch(SERVER_URL + "/stripe/billing", {
        body,
        headers: new Headers({
          'accept': '*/*',
          'content-type': 'application/json'
        }),
        //mode: 'no-cors',
        method: "POST"
       // redirect: 'follow'
    })

      const result = await res.json() //.json()
      //window.location.href = test.link_stripe
      window.open(result.link_stripe, '_blank', 'noopener,noreferrer');
  }

  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 4 }}
      height="20"
      alignItems="center"
      bg={useColorModeValue('white', 'gray.900')}
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue('gray.200', 'gray.700')}
      justifyContent={{ base: 'space-between', md: 'flex-end' }}
      {...rest}>
      <IconButton
        display={{ base: 'flex', md: 'none' }}
        onClick={onOpen}
        variant="outline"
        aria-label="open menu"
        icon={<FiMenu />}
      />


      <HStack w='800px'>
      
      <InputGroup>
            <Input placeholder='Search' 
                    value={query} 
                    onChange={(e) => setQuery(e.target.value)}
            />
            <InputRightElement >
            <Link2 href={{ pathname: '/search', query: { keyword: query } }}>
            <IconButton
              colorScheme='blue'
              aria-label='Search '
              icon={<SearchIcon />}
            />
            </Link2>
            </InputRightElement>
       </InputGroup>
      </HStack>
      <Spacer />
      <HStack spacing={{ base: '0', md: '6' }}>
      {session?.subStatus !== 'active' && session?.user && (
            <Button style={{width: "100%"}} 
                    colorScheme='red'
                    onClick={event => subscribe(event)} id="checkout-button">
               Subscribe
            </Button>
      )}



        <IconButton
          size="lg"
          variant="ghost"
          aria-label="open menu"
          icon={<FiBell />}
        />
        <Flex alignItems={'center'}>
          <Menu>
            <MenuButton
              py={2}
              transition="all 0.3s"
              _focus={{ boxShadow: 'none' }}>
              {session?.user && (  
              <HStack>   
                <Avatar
                  size={'sm'}
                  src={session.user.image}
                />
                <VStack
                  display={{ base: 'none', md: 'flex' }}
                  alignItems="flex-start"
                  spacing="1px"
                  ml="2">
                  <Text fontSize="sm">{session.user.name}</Text>
                </VStack>
                <Box display={{ base: 'none', md: 'flex' }}>
                  <FiChevronDown />
                </Box>
               
              </HStack>
              )}
            </MenuButton>
            <MenuList
              bg={useColorModeValue('white', 'gray.900')}
              borderColor={useColorModeValue('gray.200', 'gray.700')}>
              {
              /*
                <MenuItem>Profile</MenuItem>
                <MenuItem>Settings</MenuItem>
              */  
              }
              <MenuItem 
                onClick={event => billing(event)} id="checkout-button">
                  Billing
              </MenuItem>
              <MenuDivider />
              <MenuItem
                    onClick={(e) => {
                        e.preventDefault()
                        signOut()
                    }}>
                    Sign out
                </MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </HStack>
      <Stack
          flex={{ base: 1, md: 0 }}
          justify={'flex-end'}
          direction={'row'}
          spacing={6}>
          {!session && (
            <>
              <Button
                href={`/api/auth/signin`}
                as={NextLink}
                onClick={(e) => {
                  e.preventDefault()
                  signIn()
                }}
              >
                Sign in
              </Button>
            </>
          )}
        </Stack>
    </Flex>
  );
};