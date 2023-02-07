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

const FeedCard = props => {
    //destrcture the props
  const { title, description, price_id, image, nft_id, metadata, prod_id  } = props 
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
    <Card
  direction={{ base: 'column', sm: 'row' }}
  overflow='hidden'
  variant='outline'
>
  <Image
    objectFit='cover'
    maxW={{ base: '100%', sm: '400px' }}
    src={image} 
  />

  <Stack>
    <CardBody>
      <Heading size='md'>{title}</Heading>

      <Text py='2'>
          Model:  {metadata.model}
          Github: {metadata.github}
          Commit: {metadata.commit}
      </Text>
    </CardBody>

    <CardFooter>
      <Link variant='solid' colorScheme='blue' 
        href={"http://localhost:3000/products/" + prod_id} target="_blank" >
        Buy
      </Link>
    </CardFooter>
  </Stack>
</Card>
{ 
      /*
    <Container fluid>
      <Row>
        <Col xs={12} md={8} lg={8}>
        <Card className="bg-white text-white" style={{border: "none"}}>
          <Card.Img src={image} alt="Card image" />
            {isHovering && <Card.ImgOverlay>
                <Card.Title>{title}</Card.Title>
                <Card.Text style={{marginTop: "80%"}}>80x80 cm framed version made by AI</Card.Text>
              </Card.ImgOverlay>
            }
          <Card.Body className="bg-white text-black" >
          {
          //   <Card.Title>{title}</Card.Title>
          }
      </Card.Body>
    </Card>
    </Col>
    <Col xs={6} md={4} lg={4}>
    <Card style={{ width: '18rem', border: "none" }}>
      <Card.Body>
        <Card.Title>{title.slice(0,130)}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">Model: {metadata.model}</Card.Subtitle>
        <Card.Text>
          Github: {metadata.github}
          Commit: {metadata.commit}
        </Card.Text>
      </Card.Body>
      <Card.Footer>          
        <Button style={{width: "100%"}}  size="lg" variant="outline-primary"  href={"http://localhost:3000/products/" + prod_id} target="_blank">
            BUY
          </Button>
      </Card.Footer>
    </Card>
    </Col>
    </Row>
    </Container>
        */ 
    }
</div>
  );
}

export default FeedCard;