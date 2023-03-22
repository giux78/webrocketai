import React from "react";
import { 
    Card,
    //Row,
    //Col,
    //Container,
    Button,
    Image,
    CardBody,
    Stack,
    Heading,
    Text,
    CardFooter,
    Link,
}  from '@chakra-ui/react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';

const ImageCard = props => {
    //destrcture the props
  const { name, prompt, model, image,} = props 
  const [isHovering, setIsHovering] = useState(false);

  //const nft_id_ = nft_id['id']
  const SERVER_URL =  'http://localhost:9090/v1.0'


  return (

    <div>
    <Card
  direction={{ base: 'column', sm: 'row' }}
  overflow='hidden'
  variant='outline'
>
  <Image
    objectFit='cover'
    maxW={{ base: '100%', sm: '200px' }}
    src={'data:image/png;base64,' + image} 
  />

  <Stack>
    <CardBody>
      <Text fontSize='sm'>{prompt}</Text>
      <Text fontSize='sm'>{model}</Text>
    </CardBody>

    <CardFooter>
      <Button variant='solid' colorScheme='blue' 
         onClick={(e) => {
          const link = document.createElement('a');
          link.download = name + '.png';
          link.href = 'data:image/png;base64,' + image
          link.click();
        }}>
        Download
      </Button>
    </CardFooter>
  </Stack>
</Card>

</div>
  );
}

export default ImageCard;