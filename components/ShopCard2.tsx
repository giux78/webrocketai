import React from "react";
import { 
    Card,
    Button,
    ButtonGroup,
    CardBody,
    CardFooter,
    Divider,
    Heading,
    Stack,
    Image,
    Text,
    Box,
    Center,
    useColorModeValue,
} from '@chakra-ui/react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';
import image from "next/image";

const IMAGE =
  'https://images.unsplash.com/photo-1518051870910-a46e30d9db16?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1350&q=80';

  const ShopCard2 = props => { 
  const { title, description, price_id, image, nft_id  } = props 
  const [isHovering, setIsHovering] = useState(false);

  //const nft_id_ = nft_id['id']
  const SERVER_URL =  'http://localhost:9090/v1.0'

  const checkout_product = async (event) => {
    event.preventDefault();
    const res = await fetch(SERVER_URL + "/checkout_product/stripe/" + price_id, {
        headers: new Headers({
          'accept': '*/*',
          'content-type': 'application/json'
        }),
        //mode: 'no-cors',
        method: "POST"
       // redirect: 'follow'
    })

      const result = await res.json() //.json()
      console.log(result)
      //window.location.href = test.link_stripe
      window.open(result.link_stripe, '_blank', 'noopener,noreferrer');
  }
  return (
    <Center py={12}>
      <Box
        role={'group'}
        p={6}
        maxW={'330px'}
        w={'full'}
        bg={useColorModeValue('white', 'gray.800')}
        boxShadow={'2xl'}
        rounded={'lg'}
        pos={'relative'}
        zIndex={1}>
        <Box
          rounded={'lg'}
          mt={-12}
          pos={'relative'}
          height={'230px'}
          _after={{
            transition: 'all .3s ease',
            content: '""',
            w: 'full',
            h: 'full',
            pos: 'absolute',
            top: 5,
            left: 0,
            backgroundImage: `url(${IMAGE})`,
            filter: 'blur(15px)',
            zIndex: -1,
          }}
          _groupHover={{
            _after: {
              filter: 'blur(20px)',
            },
          }}>
          <Image
            rounded={'lg'}
            height={230}
            width={282}
            objectFit={'cover'}
            src={image}
          />
        </Box>
        <Stack pt={10} align={'center'}>
          <Text color={'gray.500'} fontSize={'sm'} textTransform={'uppercase'}>
            Brand
          </Text>
          <Heading fontSize={'2xl'} fontFamily={'body'} fontWeight={500}>
            Nice Chair, pink
          </Heading>
          <Stack direction={'row'} align={'center'}>
            <Text fontWeight={800} fontSize={'xl'}>
              $57
            </Text>
            <Text textDecoration={'line-through'} color={'gray.600'}>
              $199
            </Text>
          </Stack>
          <Button
            onClick={(e)=> checkout_product(e)}>
            Buy now
          </Button>
        </Stack>
      </Box>
    </Center>
  );
}

export default ShopCard2;