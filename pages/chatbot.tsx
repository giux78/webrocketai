import type { NextPage } from 'next'
import { useState, useRef, useEffect  } from 'react';
import { ConnectWallet } from '../components/ConnectWallet';
import  GridSystem  from '../components/GridSystem';

import { 
  Spinner, 
  Form, 
  Button, 
  Toast, 
  Modal, 
  Image, 
  Row,
  Col,
  Card,
  InputGroup,
  DropdownButton,
  Dropdown,
  Container,
 } from 'react-bootstrap';

import {
    Grid,
    GridItem,
    Box,
    Textarea, 
    useColorModeValue,
 }
from '@chakra-ui/react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Layout2 from '../components/layout2';
//import { Container } from 'react-bootstrap';
//import { Container } from 'react-bootstrap';

const ChatBot: NextPage = () => {

  const frame = useRef(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [image, setImage] = useState(null)
  const [imageArt, setImageArt] = useState(null)
  const [imageArtToSend, setImageArtToSend] = useState(null)
  const [conversation, setConversation] = useState("")
  const [downloadby, setDownloadby] = useState("7")
  const [colors, setColors] = useState("7")
  const [stateButton,setStateButton] = useState("")
  const [generate, setGenerate] = useState("An oil painting a sunset on mars in style of matisse")
  const [choosenImage, setChoosenImage] = useState(0)
  const [images, setImages] = useState([])
  const [frameVis, setFrameVis] = useState("d-none");


  const onImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      console.log(event.target.files[0])
      setImage(URL.createObjectURL(event.target.files[0]));
      setSelectedFile(event.target.files[0]);
    }
  }
  
  const changeHandler = event => {
    setStateButton(event.target.value)
  };

  const textAreaOnChange = event => {
    //console.log(event)
    //console.log(event.target.value)
    setConversation(event.target.value)
  };

  const handleSubmit = async event => {
      event.preventDefault();
      const body = new FormData
      body.append("formData", selectedFile, selectedFile.name)
      if(stateButton==="Pyxelate"){  
        body.append("downloadby", downloadby)      
        body.append("colors", colors)
        const res = await fetch("http://localhost:9090/v1.0/pixelate_image", {
          body,
          headers: {
            Accept: "*/*",
          },
          method: "POST"
        })
    
        const result = await res.blob()
        setImageArt(URL.createObjectURL(result))
        setImageArtToSend(result)
      } else if(stateButton==="Neon"){
        const res = await fetch("http://localhost:9090/v1.0/neongan_image", {
          body,
          headers: {
            Accept: "*/*",
          },
          method: "POST"
        })
    
        const result = await res.blob()
        setImageArt(URL.createObjectURL(result))
        setImageArtToSend(result)
        }
      }
    

    const handleKeyPress = async event => {
      if(event.key === 'Enter'){
        console.log(conversation)
        const conv = (conversation === "" ) ? event.target.value : conversation + "\n"
        const message = (conv.includes("\n")) ? conv.trim().split("\n").pop() : conversation
        console.log("QUI CI SONO")
        console.log(message)
        const body = JSON.stringify({
          "sender" : "0x10A4821EC009623Cd489C9994871dBfDb9C6c304",
          "message" : message
        })
        const res = await fetch("http://localhost:5005/webhooks/rest/webhook", {
          body,
          headers: {
            Accept: "*/*",
          },
          method: "POST"
        })
    
        const result = await res.json()
        console.log(result)
        let newConv = conv
        for(let i = 0; i < result.length; i++){
          if(result[i].text.startsWith('[{')){
            console.log(result[i].text.replace())
            const jsonObj = JSON.parse(result[i].text.replace("'",'"'))
            setImages(jsonObj)
            //setGenerate(jsonObj['name'])
          } else {
            newConv = newConv + result[i].text + "\n"
          }
      }
        setConversation(newConv)
    }
  }


  const choose_dalle_image_and_diffusion = async event => {
    event.preventDefault();
    const name = generate
    const fileName = name.trim().replaceAll(" ", "_")
    const num = choosenImage
    const res = await fetch("http://localhost:9090/v1.0/diffusion/" + choosenImage + "_" + fileName, {
        headers: new Headers({
          'accept': '*/*',
          'content-type': 'application/json'
        }),
        //mode: 'no-cors',
        method: "POST"
    })
  
      const result = await res.blob()
      setImage(URL.createObjectURL(result))
      //setImageArtToSend(result)
      setSelectedFile(result);
  }

  const choose_dalle_image_and_upscale = async event => {
    event.preventDefault();
    const name = generate
    const fileName = name.trim().replaceAll(" ", "_")
    const num = choosenImage
    const res = await fetch("http://localhost:9090/v1.0/upscale/" + choosenImage + "_" + fileName, {
        headers: new Headers({
          'accept': '*/*',
          'content-type': 'application/json'
        }),
        //mode: 'no-cors',
        method: "POST"
    })
  
      const result = await res.blob()
      setImageArt(URL.createObjectURL(result))
      setImageArtToSend(result)
      const selectedFile = { name : 'upscale_' + choosenImage + "_" + fileName }
      setSelectedFile(selectedFile);
      setFrameVis('d-print-inline')

  }

  const Item = props => {
    //destrcture the props
    const { image, name, id } = props
    console.log(props)
    const b64 = "data:image/png;base64," + image
    return (
      <div className='album'>
            <button>
                <img src={b64} style={{ width: 180 }}  onClick={(e) => choose_dalle_image_and_upscale(e, id, name)}/>
            </button>
      </div>
    )
  }

  return (
    <Layout2>
      <Box
      bg={useColorModeValue('white', 'gray.900')}>  
      <ConnectWallet />
      <Grid templateColumns='repeat(2, 1fr)' gap={3}>
            <GridItem w='100%' h='100%'>
            <Textarea
                value={conversation}
                onKeyDown={handleKeyPress}
                onChange={(e) => textAreaOnChange(e)}
                placeholder='Here is a sample placeholder'
                size='lg'
                mb='8px'
            />
             </GridItem>   
            <GridItem w='100%' h='100%'>
                    <GridSystem colCount={3} md={4} style={{marginTop:"10%"}}>
                    {/* Here we are mapping every element to an <Item /> and pass props.
                        map returns an array of JSX that the grid system will take as children.
                    */}
                    { images.length > 0 ? images.map((item, i )=> <Item key={i} id={i} name={item.name} image={item.image} />) : <p>Generate images.</p> }
                </GridSystem>
                <Container className={frameVis} id="mintPrint">
          <Row>
            3. Mint and Print
          </Row>
          <Row>
            <Col xs={12} md={8}>
                <div  className="image_frame_art" id="frame" ref={frame}>          
                <Image 
                  style={{border: "10px solid #000", width:"100%", padding: "10px"}} 
                  src={imageArt} alt=""/>
                </div>
              </Col>
            <Col xs={6} md={4}>
              <Container>
              <Row>
                <Card style={{ width: '28rem', border: 'none' }}>
                  <Card.Body>
                  <Card.Title style={{textAlign:"center"}}>{generate.charAt(0).toUpperCase() + generate.slice(1)}</Card.Title>
                  <Card.Subtitle className="mb-6 text-muted"> <h5><b>80x80 cm framed version made by AI and saved on the blockchain</b></h5></Card.Subtitle>
                  <Card.Text>
                      <br></br>
                      <b style={{textAlign:"center"}}>199,00 €</b> 
                      <br></br>
                      buy the pyhsical copy and save on the blockchain for certified  ownership
                  </Card.Text>
                  </Card.Body>
                </Card>
               </Row>
               <Row>
                <div>
                  <Button style={{width: "100%"}}  size="lg" variant="outline-success" onClick={event => checkout(event, frame)} id="checkout-button">
                   Buy the physical copy
                  </Button>
                  <br />
                  <br />
                </div>

                <h4 style={{textAlign:"center"}}>OR</h4>
                <br />
                
                </Row>
                <br />
              <Row>
              { /* address && 
                <div>
                  <Button style={{width: "100%"}}  size="lg" variant="outline-primary"  onClick={event => mint_and_transfer(event)} id="checkout-button">
                   Mint and buy the physical copy
                  </Button>
                </div>
            */ }
            </Row>
            </Container>
            </Col>
          </Row>
        </Container>
            </GridItem>    
      </Grid>
      </Box>

      {/*
      <Container className="App">
        <Row>
          <Col>
            <Form>
              <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                <Form.Label>Example textarea</Form.Label>
                <Form.Control as="textarea" 
                  rows={20} 
                  cols={50}           
                  onKeyDown={handleKeyPress}
                  value={conversation}
                  onChange={(e) => textAreaOnChange(e)}/>
            </Form.Group>
          </Form>
          </Col>
          <Col>
              <GridSystem colCount={3} md={4} style={{marginTop:"10%"}}>
            { images.length > 0 ? images.map((item, i )=> <Item key={i} id={i} name={item.name} image={item.image} />) : <p>Generate images.</p> }
          </GridSystem>
          </Col>
        </Row>
      </Container>
        */
       }
    </Layout2>
  );
};

export default ChatBot