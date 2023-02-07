// @ts-nocheck

import type { NextPage } from 'next'
import { useState, useRef, useEffect  } from 'react';
import  GridSystem  from '../components/GridSystem';
import { 
  Spinner, 
  Toast, 
  Modal,  
  Container,
  Row,
  Col,
 } from 'react-bootstrap';
 import { 
  Card,
  Button,
  Stack,
  Image,
  Select,
  Input,
  FormControl,
  FormLabel,
  useFormControlStyles,
} from '@chakra-ui/react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useScreenshot } from 'use-react-screenshot'
import BlockUI from '../components/BlockUI';
import Layout from '../components/layout';
import Layout2 from '../components/layout2';
import { Rnd } from 'react-rnd'

const Generate: NextPage = () => {

  const parent = useRef(null);
  const frame = useRef(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagesArr, setImagesArr] = useState([])
  const [imageArt, setImageArt] = useState(null)
  const [imageArtToSend, setImageArtToSend] = useState(null)
  const [generate, setGenerate] = useState("")
  const [imageTest, takeScreenshot] = useScreenshot()
  const [show, setShow] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState("invisible");
  const [frameVis, setFrameVis] = useState("d-print-inline") //useState("d-none");

  const [gridVis, setGridVis] = useState("d-print-inline");
  const [blockUI, setBlockUI] = useState(false)
  const [model, setModel] = useState("dalle-flow")
  //const getImageTest = () => takeScreenshot(parent.current)

  const [file, setFile] = useState<File>();
  const [selectProduct, setSelectProduct] = useState("hoodie");
  const [selectColor, setSelectColor] = useState("black");
  const [image1, setImage1] = useState('/product/'+ selectProduct +'-' + selectColor + '-back.webp')
  const [image2, setImage2] = useState("/product/" + selectProduct + "-" + selectColor + "-front.png")
 
  const setImages = (event) => {
     if(event.target.value === 't-shirt') {
      setSelectProduct(event.target.value)
      setImage1("/product/" + event.target.value + "-" + selectColor + "-front.webp")
      setImage2("/product/" + event.target.value + "-" + selectColor + "-back.png")
     } else if(event.target.value === 'hoodie') {
      setSelectProduct(event.target.value)
      setImage1("/product/" + event.target.value + "-" + selectColor + "-back.webp")
      setImage2("/product/" + event.target.value + "-" + selectColor + "-front.png")
     }
  }
  
  
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleUploadClick = () => {
    // 👇 We redirect the click event onto the hidden input element
    inputRef.current?.click();
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) {
      return;
    }

    setSelectedFile(e.target.files[0])
    setFile(e.target.files[0]);
    setImageArt(URL.createObjectURL(e.target.files[0]))
    setImageArtToSend(e.target.files[0])
    // 🚩 do the file upload here normally...
  };

  const SERVER_URL =  'http://localhost:9090/v1.0' // 'http://3.226.222.121:9090/v1.0'

  const checkout = async (event, toscreenshot) => {
    event.preventDefault();
    setBlockUI(true)
    const screenshot = await takeScreenshot(toscreenshot.current)
    //const localDescription = "You can print a 80x80 cm wood framed version of this image at https://localhost:3000/products/" + selectedFile.name +
    //"\n" + " Prompt: " + generate + 
    //"\n" + " Model: Dall-e flow" + 
    //"\n" + " Commit: " + "d8e63a93cc3e058f9261db1a65bfca53a817d03e" +
    //"\n" + " Github: https://github.com/jina-ai/dalle-flow/"

    const body = JSON.stringify({
      "imagebase64": screenshot,
      "name" : "Guitarist zombie",
      "description" : "Guitarist zombie",
      "filename" : selectedFile.name,
      "model" : model
    })
    const res = await fetch(SERVER_URL + "/checkout/stripe", {
        body,
        headers: new Headers({
          'accept': '*/*',
          'content-type': 'application/json'
        }),
        //mode: 'no-cors',
        method: "POST"
       // redirect: 'follow'
    })
      setBlockUI(false)
      const test = await res.json() //.json()
      console.log('ale')
      console.log(test)
      //window.location.href = test.link_stripe
      window.open(test.link_stripe, '_blank', 'noopener,noreferrer');
  }

  const mint_and_transfer = async event => {
    event.preventDefault();
    setBlockUI(true)
    const body = new FormData
    //const localDescription = "You can print a 80x80 cm wood framed version of this image at https://localhost:3000/products/" + selectedFile.name +
    //"\n" + " Prompt: " + generate + 
    //"\n" + " Model: Dall-e flow" + 
    //"\n" + " Commit: " + "d8e63a93cc3e058f9261db1a65bfca53a817d03e" +
    //"\n" + " Github: https://github.com/jina-ai/dalle-flow/"
    body.append("formData", imageArtToSend, selectedFile.name + '.jpg')
    body.append("description", generate)
    body.append("name", generate)
    body.append("model", model)
    
    const res = await fetch(SERVER_URL + "/mint/" + address, {
      body,
      headers: {
        Accept: "*/*",
      },
      method: "POST"
    })

    const test = await res.json() //.json()
    console.log('ale')
    console.log(test)
    //window.location.href = test.link_stripe
    setBlockUI(false)
    window.open(test.link_stripe, '_blank', 'noopener,noreferrer');
  }

  const style = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "solid 1px #ddd",
    background: "#f0f0f0",
    zIndex:'9999',
  };

  return (
    <Layout2>
    <div>
      <BlockUI blocking={blockUI} />
      <Toast bg="danger"  onClose={() => setShow(false)} show={show} delay={10000} autohide>
          <Toast.Header>
            <strong className="me-auto">Error</strong>
            <small>Message</small>
          </Toast.Header>
          <Toast.Body>{errorMsg}</Toast.Body>
      </Toast>
      <div className="App">
      <Modal>
      <Spinner
          animation="border"
          role="status"
          style={{ 
            width: "4rem", 
            height: "4rem"
           }}
        >
         <span className="visually-hidden">Loading... it can take 1 min</span>
      </Spinner>
    </Modal>
      <div
        style={{             
          position: "fixed",
          top: "50%",
          left: "50%", }}
          className="translate(-50%, -50%)"
      >
        {/* bootstrap spinner */}
        <div className={loading}>
        <Spinner  
          animation="border"
          role="status"
          style={{ 
            width: "4rem", 
            height: "4rem"
           }}
        >
          <span className="visually-hidden">Loading... it can take 1 min</span>
        </Spinner>
        <span>Loading... it can take 1 min</span>
        </div>

      </div>
        <div id="chooseOne">
        <Container className={gridVis}> 
        <Row>

        <div>
        <div>Upload a file:</div>

        {/* 👇 Our custom button to select and upload a file */}
        <button onClick={handleUploadClick}>
            {file ? `${file.name}` : 'Click to select'}
        </button>

        {/* 👇 Notice the `display: hidden` on the input */}
        <Input
            type="file"
            ref={inputRef}
            onChange={handleFileChange}
            style={{ display: 'none' }}
        />
        </div>
        </Row>
      </Container>
        </div>
        <br/><br/><br/>
        <Container className={frameVis} id="mintPrint">
          <Row>
          <Stack spacing={3}>
            <FormControl>
              <FormLabel htmlFor="product" fontWeight={'normal'}>
                 Select product 
              </FormLabel>
            </FormControl>
            <Select size='lg' onChange={ event => setImages(event)} >
            <option value='hoodie' default>Hoddie</option>
              <option value='t-shirt'>T-shirt</option>
              <option value='frame'>Frame</option>
            </Select>  
          </Stack>
          <Stack spacing={3}>
          <br/>  
          <FormControl>
              <FormLabel htmlFor="color" fontWeight={'normal'}>
                 Select color 
              </FormLabel>
            </FormControl>
            <Select size='lg' onChange={ (event) => setSelectColor(event.target.value)} >
            <option value='black' default>Black</option>
              <option value='navy'>Navy</option>
              <option value='blue'>Blue</option>
              <option value='red'>Red</option>
            </Select>  
          </Stack>
                <div>
                  <Button style={{width: "100%"}}  size="lg" variant="outline-success" onClick={event => checkout(event, frame)} id="checkout-button">
                    Create product
                  </Button>
                  <br />
                  <br />
                </div>
                <br />
                
                </Row>
          <Row>
            <Col xs={6} md={6}>
                <div  className="image_frame_art" id="frame" ref={frame}>   
                <div className="parent" id="screen" ref={parent}>
                  <img className="image1" src={image1} />
                  <Rnd
                    default={{
                        x: 30,
                        y: 30,
                        width: 100,
                        height: 100
                    }}
                    style={{'zIndex': 1}}
                  >
                    <Image src={imageArt} alt="" />
                  </Rnd>
                </div>       
                </div>
                <Image 
                  style={{border: "10px solid #000", width:"100%", padding: "10px"}} 
                  src={imageArt} alt=""/>
              </Col>
            <Col xs={6} md={6}>
              
              <Container>
              <Image 
                  src={ image2 } alt=""/>
            </Container>
            </Col>
          </Row>
        </Container>
    </div>
    <br/>
    <br/>
    <br/>
    </div>
  </Layout2>
  );
};

export default Generate
