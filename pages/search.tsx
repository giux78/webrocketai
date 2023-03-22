// @ts-nocheck
import type { NextPage } from 'next'
import { 
  Stack,
  SimpleGrid,
  Card,
  CardHeader,
  Heading,
  CardBody,
  Text,
  CardFooter,
  Button,
} from '@chakra-ui/react';
import 'bootstrap/dist/css/bootstrap.min.css';
import ImageCard from '../components/ImageCard';
import Layout2 from '../components/layout2';
import { InstantSearch, SearchBox, Hits, Highlight } from 'react-instantsearch-dom';
import { instantMeiliSearch } from '@meilisearch/instant-meilisearch';
import { MeiliSearch } from 'meilisearch'
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/router';
import type { GetServerSidePropsContext } from "next"
import { isMapIterator } from 'util/types';

const client = new MeiliSearch({ host: 'http://localhost:7700' })


const Search: NextPage = ({data}) => {

  const searchParams = useSearchParams();

  const search = searchParams.get('keyword');
 
  const searchClient = instantMeiliSearch(
    'http://localhost:7700'  
  );


  return (
    <Layout2>
      <SimpleGrid spacing={2} templateColumns='repeat(auto-fill, minmax(400px, 1fr))'>
        { data.hits.length > 0 ? data.hits.map((item, i ) => 
            <ImageCard key={i} id={i} 
            name={item.name} 
            image={item.image} 
            prompt={item.prompt}
            model={item.model}
          />
          ) 
            : <Heading>No images found</Heading> 
        }
        </SimpleGrid>
    </Layout2>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {  // Fetch data from external API

  console.log(context.query.keyword)
  const param = context.query.keyword
  const model = context.query.model
  console.log(model)
  let data = {}
  if (model === undefined) {
    data = await client.index('images').search(param)
  } else {
    data = await client.index('images').search('model = \"' + model +'\"')
  }
  // Pass data to the page via props
  return { props: { data: data } }
}

export default Search
