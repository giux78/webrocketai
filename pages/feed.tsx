// @ts-nocheck

import type { NextPage } from 'next'
import { 
  Stack
} from '@chakra-ui/react';
import 'bootstrap/dist/css/bootstrap.min.css';
import FeedCard from '../components/FeedCard';
import Layout2 from '../components/layout2';

const Feed: NextPage = ({products}) => {

  return (
    <Layout2>
    <div>
        <Stack>
    
        {/* Here we are mapping every element to an <Item /> and pass props.
            map returns an array of JSX that the grid system will take as children.
        */}
        { products.length > 0 ? products.map((item, i ) => 
            <FeedCard key={i} id={i} 
            title={item.name} 
            image={item.images[0]} 
            description={item.description}
            price_id = {item.default_price}
            nft_id = {item.nft_metadata} 
            metadata = {item.metadata}
            prod_id = {item.id}/>
          ) 
            : <p>Generate images.</p> 
        }
      </Stack>
    </div>
    </Layout2>
  );
};

export async function getStaticProps() {
  // Call an external API endpoint to get posts
  const result = await fetch("http://127.0.0.1:9090/v1.0/products") 
  
//, {
//    headers: new Headers({
//      'accept': '*/*',
//      'content-type': 'application/json'
//    }),
//    method: "GET"
//});
  
  const res = await result.json()
  const products = res.data
  // console.log(products.length)
  //const filteredProducts = products.filter((item) => item.images.length > 0);
  //console.log(filteredProducts.length)
  // By returning { props: { posts } }, the Blog component
  // will receive `posts` as a prop at build time
  return {
    props: {
      products,
    },
  }
}

export default Feed
