// @ts-nocheck

import type { NextPage } from 'next'
import Layout2 from '../components/layout2';
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
  HStack,
  VStack,
} from '@chakra-ui/react';

const Models: NextPage = ({models}) => {

  const ModelCard = props => {
    //destrcture the props
    const { text, name, identifier, image_url, prompt, model_images  } = props 
    console.log(props)
    const query = name.split("/")[1]
    return (
      <Link href={'/search?model=' + name}>
        <Card
        direction={{ base: 'column', sm: 'row' }}
        overflow='hidden'
        variant='outline'
      >
      
        <Stack>
          <CardBody>
            <Heading size='md'>{name}</Heading>
      
            <Text py='2'>
                Identifier:  {identifier}
            </Text>
            <Text py='2'>
              Prompt: {prompt}
            </Text>
            
          </CardBody>
        </Stack>
        <HStack spacing='5px'>
        { model_images.length > 0 ? model_images.map((image, i ) => 
                  <Image
                  objectFit='cover'
                  maxW={{ base: '100%', sm: '200px' }}
                  src={"data:image/png;base64,"  + image} 
                />
              )
            : <p>No images</p> 
        }
        </HStack>
      </Card>
    </Link>
    )
  }



  return (
    <Layout2>
    <div>
      <Stack spacing="5px">
        { models.length > 0 ? models.map((item, i ) => 
            <ModelCard key={i} id={i} 
            text={item.text} 
            name={item.name} 
            identifier={item.info.identifier}
            image_url = {item.info.image_url}
            prompt = {item.info.prompt}
            model_images = {item.model_images} />
          ) 
            : <p>Try to train one ...</p> 
        }
        </Stack>
    </div>
    </Layout2>
  );
};

//export async function getStaticProps() {
export async function getServerSideProps() {  
// Call an external API endpoint to get posts
  const result = await fetch("http://127.0.0.1:9090/v1.0/models/rocketai") 
  
//, {
//    headers: new Headers({
//      'accept': '*/*',
//      'content-type': 'application/json'
//    }),
//    method: "GET"
//});
  
  const res = await result.json()
  const models = res
  // console.log(products.length)
  //const filteredProducts = products.filter((item) => item.images.length > 0);
  //console.log(filteredProducts.length)
  // By returning { props: { posts } }, the Blog component
  // will receive `posts` as a prop at build time
  return {
    props: {
      models,
    },
  }
}

export default Models
