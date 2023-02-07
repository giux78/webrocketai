// @ts-nocheck

import type { NextPage } from 'next'
import { useState, useRef, useEffect  } from 'react';
import  GridSystem  from '../components/GridSystem';
import { 
  Spinner, 
  Form, 
  Button, 
  Toast, 
  Modal, 
  Image, 
  Container,
  Row,
  Col,
  Card,
  InputGroup,
  DropdownButton,
  Dropdown,
 } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useScreenshot } from 'use-react-screenshot'
import BlockUI from '../components/BlockUI';
import Layout from '../components/layout';
import Layout2 from '../components/layout2';

const Generate: NextPage = () => {

  const parent = useRef(null);
  const frame = useRef(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [image, setImage] = useState(null)
  const [images, setImages] = useState([])
  const [imagesArr, setImagesArr] = useState([])
  const [imageArt, setImageArt] = useState(null)
  const [imageArtToSend, setImageArtToSend] = useState(null)
  const [downloadby, setDownloadby] = useState("7")
  const [colors, setColors] = useState("7")
  const [stateButton,setStateButton] = useState("")
  const [generate, setGenerate] = useState("")
  const [choosenImage, setChoosenImage] = useState(0)
  const [imageTest, takeScreenshot] = useScreenshot()
  const [show, setShow] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState("invisible");
  const [frameVis, setFrameVis] = useState("d-none");
  const [gridVis, setGridVis] = useState("d-none");
  const [blockUI, setBlockUI] = useState(false)
  const [model, setModel] = useState("dalle-flow")
  //const getImageTest = () => takeScreenshot(parent.current)

  const SERVER_URL =  'http://localhost:9090/v1.0' // 'http://3.226.222.121:9090/v1.0'

  const generate_dalle_image = async event => {
    event.preventDefault();
    setLoading('visibile')
    setFrameVis('d-none')
    setGridVis('d-none')
    setBlockUI(true)
    const name = generate
    const body = JSON.stringify({
      "text_to_image": name,
      "model" : model
    })

    const fileName = name.trim().replaceAll(" ", "_")
    const res = await fetch(SERVER_URL + "/generate_images/" + fileName, {
        body,
        headers: new Headers({
          'accept': '*/*',
          'content-type': 'application/json'
        }),
        //mode: 'no-cors',
        method: "POST"
    })

      const result = await res.json()
      setLoading('invisible')
      setImages(result)
      setGridVis('d-print-inline')
      setBlockUI(false)
      window.location.href = "#";
      window.location.href = "#chooseOne";
  }

  const mock_generate_dalle_image = async event => {
    event.preventDefault();
    const name = generate
    const body = JSON.stringify({
      "text_to_image": name
    })

    const fileName = name.trim().replaceAll(" ", "_")
    const res = await fetch(SERVER_URL + "/mock/generate_images/" + fileName, {
        body,
        headers: new Headers({
          'accept': '*/*',
          'content-type': 'application/json'
        }),
        //mode: 'no-cors',
        method: "POST"
    })
  
      const result = await res.json()
      setImages(result)
  }

  const choose_dalle_image_and_upscale = async (event, key, name) => {
    event.preventDefault();
    setLoading('visibile')
    setBlockUI(true)
    //const num = choosenImage
    const res = await fetch(SERVER_URL + "/upscale/" + name, {
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
      const selectedFileLocal = { name : 'upscale_' + name }
      setSelectedFile(selectedFileLocal);
      setFrameVis('d-print-inline')
      setLoading('invisible')
      setBlockUI(false)
      window.location.href = "#";
      window.location.href = "#mintPrint";
  }

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
      "name" : generate,
      "description" : generate,
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

  const start_ec2 = async event => {
    event.preventDefault();
    const instanceId = 'i-08cf138f295d44217'
    const res = await fetch(SERVER_URL + "/dall-e/start/" + instanceId, {
        headers: new Headers({
          'accept': '*/*',
          'content-type': 'application/json'
        }),
        //mode: 'no-cors',
        method: "POST"
    })
  
    if (res.status === 500) {
       const error = await res.json()
       console.log(error)
       setShow(true)
       setErrorMsg(error.error)
    } else {
      const result = await res.text()
      setShow(true)
      setErrorMsg("Working wait for dall-e to start ....")
    }
  }

  const stop_ec2 = async event => {
    event.preventDefault();
    const instanceId = 'i-08cf138f295d44217'
    const res = await fetch(SERVER_URL + "/dall-e/stop/" + instanceId, {
        headers: new Headers({
          'accept': '*/*',
          'content-type': 'application/json'
        }),
        //mode: 'no-cors',
        method: "POST"
    })
  
      const result = await res.text()
  }

  //The UI for the items to be shown inside the grid
  const Item = props => {
    //destrcture the props
    const { image, name, id } = props
    console.log(props)
    const b64 = "data:image/png;base64," + image
    return (
      <div className='album'>
            <button>
                <img src={b64} style={{ width: 300 }}  onClick={(e) => choose_dalle_image_and_upscale(e, id, name)}/>
            </button>
      </div>
    )
  }

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
        <div style={{marginLeft: "5%", marginRight:"5%", marginTop: "20px", marginBottom: "20px"}}>
        <h2>1. Generate</h2>

        <Form >
          <Form.Group className="d-flex">
        <InputGroup className="mb-3" size="lg">
            <Form.Control
              type="search"
              placeholder="Insert a prompt text and get images"
              className="me-2"
              aria-label="Generate"
              value={generate} 
              onChange={(e) => setGenerate(e.target.value)}
            />
              <DropdownButton
                variant="outline-info"
                title="Random sample"
                id="input-group-dropdown-2"
                align="end"
              >
                <Dropdown.Item href="#" onClick={(e) => setGenerate('An oil painting impressionism pyreney valley moonlight stars blue colors')}>
                  An oil painting impressionism pyreney valley moonlight stars blue colors
                </Dropdown.Item>
                <Dropdown.Item href="#" onClick={(e) => setGenerate('An owl silver cyberpunk')}>
                  An owl silver cyberpunk
                </Dropdown.Item>
                <Dropdown.Item href="#" onClick={(e) => setGenerate(' A surrealism painting of venice by night blue colors')}>
                  A surrealism painting of venice by night blue colors
                </Dropdown.Item>
                <Dropdown.Item href="#" onClick={(e) => setGenerate('A skeleton in a graveyard van gogh style red colors')}>
                  A skeleton in a graveyard van gogh style red colors
                </Dropdown.Item>
                <Dropdown.Item href="#" onClick={(e) => setGenerate('An oil painting of ants cyberpunk')}>
                  An oil painting of ants cyberpunk
                </Dropdown.Item>
                <Dropdown.Item href="#" onClick={(e) => setGenerate('Surrealism big waves at nazaree, portugal on moonlight')}>
                  Surrealism big waves at nazaree, portugal on moonlight
                </Dropdown.Item>
              </DropdownButton>
            <Button onClick={generate_dalle_image} variant="outline-primary">Generate</Button>
            </InputGroup>
            </Form.Group>
            <Form.Label>Model</Form.Label>
            <Form.Select size="lg"
              onChange={e => {
                      console.log("e.target.value", e.target.value);
                      setModel(e.target.value)}}
            >
              <option value="dalle-flow">Dall-e flow craiyon(ex Dall-e mega) & Glid3 xl</option>
              <option value="stable">Stable Diffusion</option>
              <option disabled={true}> craiyon (ex dall-e mega) coming soon</option>
              <option disabled={true}>Disco Diffusion coming soon</option>
            </Form.Select>
          </Form>
          </div>
        <div id="chooseOne">
        <Container className={gridVis}> 
        <Row>

          2. Choose one 
        </Row>
        
        <GridSystem colCount={4} md={3}>
        {/* Here we are mapping every element to an <Item /> and pass props.
            map returns an array of JSX that the grid system will take as children.
        */}
        { images.length > 0 ? images.map((item, i )=> <Item key={i} id={i} name={item.name} image={item.image} />) : <p>Generate images.</p> }
      </GridSystem>
      </Container>

        </div>
        <br/><br/><br/>
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
    </div>
    <br/>
    <br/>
    <br/>
    <div>
      <button onClick={start_ec2}> Start ec2 </button>
      <button onClick={stop_ec2}> Stop ec2 </button>
    </div>
    
    </div>
  </Layout2>
  );
};

export default Generate
