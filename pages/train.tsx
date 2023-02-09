import { ChangeEvent, useRef, useState } from 'react';
import type { NextPage } from 'next'
import Layout2 from '../components/layout2';
import {
  AspectRatio,
  Box,
  BoxProps,
  forwardRef,
  Heading,
  Input,
  Stack,
  Text,
  Image,
  Flex,
  Button,
  Tooltip,
  useToast
} from "@chakra-ui/react";
import { motion, useAnimation } from "framer-motion";


const Train: NextPage = () => {
  // const [file, setFile] = useState<File>();
  // const inputRef = useRef<HTMLInputElement | null>(null);

  // const handleUploadClick = () => {
  //   // 👇 We redirect the click event onto the hidden input element
  //   inputRef.current?.click();
  // };

  // const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
  //   if (!e.target.files) {
  //     return;
  //   }

  //   setFile(e.target.files[0]);

  //   // 🚩 do the file upload here normally...
  // };

  const first = {
  rest: {
    rotate: "-15deg",
    scale: 0.95,
    x: "-50%",
    filter: "grayscale(80%)",
    transition: {
      duration: 0.5,
      type: "tween",
      ease: "easeIn"
    }
  },
  hover: {
    x: "-70%",
    scale: 1.1,
    rotate: "-20deg",
    filter: "grayscale(0%)",
    transition: {
      duration: 0.4,
      type: "tween",
      ease: "easeOut"
    }
  }
};

  const second = {
  rest: {
    rotate: "15deg",
    scale: 0.95,
    x: "50%",
    filter: "grayscale(80%)",
    transition: {
      duration: 0.5,
      type: "tween",
      ease: "easeIn"
    }
  },
  hover: {
    x: "70%",
    scale: 1.1,
    rotate: "20deg",
    filter: "grayscale(0%)",
    transition: {
      duration: 0.4,
      type: "tween",
      ease: "easeOut"
    }
  }
};

  const third = {
  rest: {
    scale: 1.1,
    filter: "grayscale(80%)",
    transition: {
      duration: 0.5,
      type: "tween",
      ease: "easeIn"
    }
  },
  hover: {
    scale: 1.3,
    filter: "grayscale(0%)",
    transition: {
      duration: 0.4,
      type: "tween",
      ease: "easeOut"
    }
  }
};

  const PreviewImage = forwardRef<BoxProps, typeof Box>((props, ref) => {
  return (
    <Box
      bg="white"
      top="0"
      height="100%"
      width="100%"
      position="absolute"
      borderWidth="1px"
      borderStyle="solid"
      rounded="sm"
      borderColor="gray.400"
      as={motion.div}
      backgroundSize="cover"
      backgroundRepeat="no-repeat"
      backgroundPosition="center"
      backgroundImage={`url("https://image.shutterstock.com/image-photo/paella-traditional-classic-spanish-seafood-600w-1662253543.jpg")`}
      {...props}
      ref={ref}
    />
  );
});
  
  
  const controls = useAnimation();
  const startAnimation = () => controls.start("hover");
  const stopAnimation = () => controls.stop();
  const toast = useToast();

  const [imagesSelected, setImagesSelected] = useState(undefined);
  const [imagePreviews, setImagePreviews] = useState([]);

  const selectFiles = (event) => {
    let images = [];
        for (let i = 0; i < event.target.files.length; i++) {
      images.push(URL.createObjectURL(event.target.files[i]));
    }

    if (images.length < 5 || images.length > 10) {
       toast({
          title: 'Not enough or too many',
          description: "Please add between 5 and 10 images to begin training.",
          status: 'error',
          duration: 3000,
          isClosable: true,
        })
      setImagesSelected(undefined)
      setImagePreviews([])
      return
    }

    setImagesSelected(event.target.files);
    setImagePreviews(images);


  };
  
  const uploadImages = () => {
    const files = Array.from(imagesSelected ?? {});
    console.log(files);
  
  };
  

  return (
    <Layout2>
      <Box my="12" >
        <Flex justifyContent="center" my="12" align="center" gap="32">
          <AspectRatio width="64" ratio={1} >
            <Box 
          borderColor="gray.300"
          borderStyle="dashed"
          borderWidth="2px"
          rounded="md"
          shadow="sm"
          role="group"
          transition="all 150ms ease-in-out"
          _hover={{
            shadow: "md"
          }}
          as={motion.div}
          initial="rest"
          animate="rest"
          whileHover="hover"
        >
          <Box position="relative" height="100%" width="100%" >
            <Box
              position="absolute"
              top="0"
              left="0"
              height="100%"
              width="100%"
              display="flex"
              flexDirection="column"
            >
              <Stack
                height="100%"
                width="100%"
                display="flex"
                alignItems="center"
                justify="center"
                spacing="4"
              >
                <Box height="16" width="12" position="relative">
                  <PreviewImage
                    variants={first}
                    backgroundImage="url('https://images.unsplash.com/photo-1611312449408-fcece27cdbb7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=738&q=80')"
                  />
                  <PreviewImage
                    variants={second}
                    backgroundImage="url('https://images.unsplash.com/photo-1624687943971-e86af76d57de?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80')"
                  />
                  <PreviewImage
                    variants={third}
                    backgroundImage="url('https://images.unsplash.com/photo-1607861716497-e65ab29fc7ac?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=928&q=80')"
                  />
                </Box>
                <Stack p="8" textAlign="center" spacing="1">
                  <Heading fontSize="lg" color="gray.700" fontWeight="bold">
                    Drop images here
                  </Heading>
                  <Text fontWeight="light">or click to upload</Text>
                </Stack>
              </Stack>
            </Box>
            <Input
              type="file"
              multiple
              height="100%"
              width="100%"
              position="absolute"
              top="0"
              left="0"
              opacity="0"
              aria-hidden="true"
              accept="image/*"
              onDragEnter={startAnimation}
              onDragLeave={stopAnimation}
              onChange={selectFiles}
              id="file-input"
              value={selectFiles}
            />
          </Box>
            </Box>
           </AspectRatio>
            <Box>
              <Tooltip label={!imagesSelected ? "Please first add some images" : "Let's rocket!"}>
                <Button colorScheme='green' onClick={uploadImages}>Start training</Button>
              </Tooltip>
            </Box>
        </Flex>
        {imagePreviews && (
        <Flex justifyContent="center"> 
          <Box w={900} display="flex" flexWrap="wrap">
              {imagePreviews.map((img, i) => {
                return <Image src={img} alt={'image-' + i} key={i} width={300} />;
          })}
          </Box>
        </Flex>
      )}
    </Box>
    </Layout2>
  );
}

export default Train;
