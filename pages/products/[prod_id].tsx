import { useRouter } from 'next/router'
import { ConnectWallet } from '../../components/ConnectWallet';
import { 
  Button, 
  Image, 
  Container,
  Row,
  Col,
  Card
 } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  useAddress,
  useDisconnect
} from '@thirdweb-dev/react'
import { useState } from 'react';
import Layout2 from '../../components/layout2';




function Product({ product }) {
  const router = useRouter()
  const address = useAddress();
  const SERVER_URL =  'http://localhost:9090/v1.0'

  let nftId = "https://opensea.io/collection/ai-art-lq3rcdpdud?search[sortAscending]=false&search[sortBy]=CREATED_DATE"
  console.log(product)
  if ("id_nft" in product.metadata){
    nftId = "https://opensea.io/assets/matic/0x0332ffe06365903f00118d61e8b4ad470ef6db7c/" + product.metadata.id_nft
  }


  const checkout_product = async (event) => {
    event.preventDefault();
    const res = await fetch(SERVER_URL + "/checkout_product/stripe/" + product.default_price, {
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

  // If the page is not yet generated, this will be displayed
  // initially until getStaticProps() finishes running
  if (router.isFallback) {
    return <div>Loading...</div>
  }

  return ( 
    <Layout2>

  <div>
  <Container>
  <Row>
  <h2>Buy Framed Print</h2>
  </Row>
  <Row>
    <Col xs={12} md={8}>
        <div  className="image_frame_art" id="frame">          
        <Image 
          style={{border: "10px solid #000", width:"100%", padding: "10px"}} 
          src={product.metadata.url_image} alt=""/>
        </div>
      </Col>
    <Col xs={6} md={4}>
      <Container>
      <Row>
        <Card style={{ width: '28rem', border: 'none' }}>
          <Card.Body>
          <Card.Title style={{textAlign:"center"}}>{product.metadata.prompt}</Card.Title>
          <Card.Subtitle className="mb-6 text-muted"> <h5><b>80x80 cm framed version made by AI and saved on the blockchain</b></h5></Card.Subtitle>
          <Card.Text>
              <br></br>
              <b style={{textAlign:"center"}}>199,00 €</b> 
              <br></br>
              buy the the wood framed print
          </Card.Text>
          </Card.Body>
        </Card>
       </Row>
       <Row>
        <div>
          <Button style={{width: "100%"}}  size="lg" variant="outline-success" id="checkout-button" 
            onClick={(e)=> checkout_product(e)}>  
              Buy the 80x80 cm framed wood print 
          </Button>
          <br />
          <br />
        </div>

        <h4 style={{textAlign:"center"}}>OR</h4>
        <br />
        
        </Row>
        <br />
      <Row>
        <div>
          <Button style={{width: "100%"}}  size="lg" variant="outline-primary"  id="checkout-button"
           onClick={()=> window.open(nftId, "_blank")}
           > 
            See NFT on Opensea
          </Button>
        </div>
    
    </Row>
    </Container>
    </Col>
  </Row>
</Container>
</div>  
</Layout2>
)
}

// This function gets called at build time
export async function getStaticPaths() {
  const res = await fetch(`http://127.0.0.1:9090/v1.0/products`)
  const data = await res.json()
  const products = data["data"]
  let products_url: string[] = []
  for(let i=0; i< products.length; i++){
    const prod = products[i]
    products_url.push("/products/" + prod.id)
  }
  return {
    // Only `/posts/1` and `/posts/2` are generated at build time
    paths: products_url.slice(0,8),
    // Enable statically generating additional pages
    // For example: `/posts/3`
    fallback: true,
  }
}

// This also gets called at build time
export async function getStaticProps({ params }) {
  // params contains the post `id`.
  // If the route is like /posts/1, then params.id is 1
  const res = await fetch(`http://127.0.0.1:9090/v1.0/products/${params.prod_id}`)
  const product = await res.json()
  console.log(product)

  // Pass post data to the page via props
  return {
    props: { product },
    // Re-generate the post at most once per second
    // if a request comes in
    revalidate: 1,
  }
}

export default Product