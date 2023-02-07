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
} from '@chakra-ui/react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';

const ShopCard = props => {
    //destrcture the props
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
    <div>
        <Card maxW='sm'>
      <CardBody>
        <Image
          src={image}
          alt='Green double couch with wooden legs'
          borderRadius='lg'
        />
        <Stack mt='6' spacing='3'>
          <Heading size='md'>80x80 cm framed version made by AI</Heading>
          <Text color='blue.600' fontSize='2xl'>
            $199,00
          </Text>
        </Stack>
      </CardBody>
      <Divider />
      <CardFooter>
        <ButtonGroup spacing='2'>
          <Button variant='solid' colorScheme='blue'
            onClick={(e)=> checkout_product(e)}>
            Buy now
          </Button>
          <Button variant='ghost' colorScheme='blue'>
            Add to cart
          </Button>
        </ButtonGroup>
      </CardFooter>
    </Card>
    {
      /*
      <Card className="bg-white text-white" style={{border: "none"}}>
      <Card.Img src={image} alt="Card image" />
    {isHovering && <Card.ImgOverlay>
          <Card.Title>{title}</Card.Title>
          <Card.Text style={{marginTop: "80%"}}>80x80 cm framed version made by AI</Card.Text>
      </Card.ImgOverlay>
    }
    <Card.Body className="bg-white text-black" >
       <Card.Title>{title}</Card.Title>
      <Button variant="outline-primary"
        onClick={(e)=> checkout_product(e)}>  
        Buy 80x80 cm for 199,00
      </Button>
    </Card.Body>
  </Card>
  */
    }
    </div>
  );
}

export default ShopCard;