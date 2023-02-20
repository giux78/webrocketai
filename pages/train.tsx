import type { NextPage } from 'next';
import { ChangeEvent, useRef, useState } from 'react';
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
  useToast,
  useBoolean,
  Modal,
  ModalOverlay,
  Spinner,
} from '@chakra-ui/react';
import { motion, useAnimation } from 'framer-motion';

const Train: NextPage = () => {
  const first = {
    rest: {
      rotate: '-15deg',
      scale: 0.95,
      x: '-50%',
      filter: 'grayscale(80%)',
      transition: {
        duration: 0.5,
        type: 'tween',
        ease: 'easeIn',
      },
    },
    hover: {
      x: '-70%',
      scale: 1.1,
      rotate: '-20deg',
      filter: 'grayscale(0%)',
      transition: {
        duration: 0.4,
        type: 'tween',
        ease: 'easeOut',
      },
    },
  };

  const second = {
    rest: {
      rotate: '15deg',
      scale: 0.95,
      x: '50%',
      filter: 'grayscale(80%)',
      transition: {
        duration: 0.5,
        type: 'tween',
        ease: 'easeIn',
      },
    },
    hover: {
      x: '70%',
      scale: 1.1,
      rotate: '20deg',
      filter: 'grayscale(0%)',
      transition: {
        duration: 0.4,
        type: 'tween',
        ease: 'easeOut',
      },
    },
  };

  const third = {
    rest: {
      scale: 1.1,
      filter: 'grayscale(80%)',
      transition: {
        duration: 0.5,
        type: 'tween',
        ease: 'easeIn',
      },
    },
    hover: {
      scale: 1.3,
      filter: 'grayscale(0%)',
      transition: {
        duration: 0.4,
        type: 'tween',
        ease: 'easeOut',
      },
    },
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
  const startAnimation = () => controls.start('hover');
  const stopAnimation = () => controls.stop();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const [imagesSelected, setImagesSelected] = useState(undefined);
  const [imagesPreview, setImagesPreview] = useState([]);

  const [identifier, setIdentifier] = useState('');
  const handleChange = (event) => setIdentifier(event.target.value);

  const [description, setDescription] = useState('');
  const handleChangeDesc = (event) => setDescription(event.target.value);

  const selectFiles = (event) => {
    let images = [];
    let images64 = [];
    for (let i = 0; i < event.target.files.length; i++) {
      console.log(i);
      const reader = new window.FileReader();
      reader.onload = function () {
        const dataURL = reader.result;
        const base64 = dataURL.split(',')[1];
        images64.push(base64);
      };
      const bs64 = reader.readAsDataURL(event.target.files[i]);
      images.push(URL.createObjectURL(event.target.files[i]));
    }

    if (images.length < 5 || images.length > 10) {
      toast({
        title: 'Not enough or too many',
        description: 'Please add between 5 and 10 images to begin training.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      setImagesSelected(undefined);
      setImagesPreview([]);
      return;
    }

    setImagesSelected(images64);
    setImagesPreview(images);
  };

  const SERVER_URL = 'http://localhost:9090/v1.0';

  const uploadImages = async (event) => {
    event.preventDefault();
    if (!imagesSelected) {
      toast({
        title: 'No images',
        description: 'Please add some images first.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    // start function to simulate api call for 10 seconds in order to test loading spinner
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 10000);
    return;

    // on real call we need to set "isLoading" to "true" at the beginning and "isLoading" to "false" after the last response, also reset all inputs after last response
    // end simulate function

    const files = Array.from(imagesSelected ?? {});
    const body = JSON.stringify({
      files,
    });
    //const body = files

    console.log(body);
    const res = await fetch(
      SERVER_URL + '/train/' + description + '/' + identifier,
      {
        body,
        headers: new Headers({
          accept: '*/*',
          'content-type': 'application/json',
        }),
        //mode: 'no-cors',
        method: 'POST',
      }
    );

    const result = await res.json();
  };

  return (
    <Layout2>
      {!isLoading && (
        <Box mt="2">
          <Text>Identifier: {identifier}</Text>
          <Input
            value={identifier}
            onChange={handleChange}
            placeholder="Unique identifier for concept"
            size="lg"
          />
          <br />
          <br></br>
          <Text>Class description: {description}</Text>
          <Input
            value={description}
            onChange={handleChangeDesc}
            placeholder="Class description"
            size="lg"
          />
          <Flex justifyContent="center" my="12" align="center" gap="32" mt="16">
            <AspectRatio width="64" ratio={1}>
              <Box
                borderColor="gray.300"
                borderStyle="dashed"
                borderWidth="2px"
                rounded="md"
                shadow="sm"
                role="group"
                transition="all 150ms ease-in-out"
                _hover={{
                  shadow: 'md',
                }}
                as={motion.div}
                initial="rest"
                animate="rest"
                whileHover="hover"
              >
                <Box position="relative" height="100%" width="100%">
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
                        <Heading
                          fontSize="lg"
                          color="gray.700"
                          fontWeight="bold"
                        >
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
              <Tooltip
                label={
                  !imagesSelected
                    ? 'Please first add some images'
                    : "Let's rocket!"
                }
              >
                <Button colorScheme="green" onClick={uploadImages}>
                  Start training
                </Button>
              </Tooltip>
            </Box>
          </Flex>
          {imagesPreview && (
            <Flex justifyContent="center">
              <Box w={900} display="flex" flexWrap="wrap">
                {imagesPreview.map((img, i) => {
                  return (
                    <Image
                      boxSize="300px"
                      objectFit="cover"
                      src={img}
                      alt={'image-' + i}
                      key={i}
                    />
                  );
                })}
              </Box>
            </Flex>
          )}
        </Box>
      )}
      {isLoading && (
        <Modal isOpen={isLoading} onClose={() => setIsLoading(false)}>
          <ModalOverlay />
          <Flex
            position="absolute"
            height="100vh"
            width="100vw"
            top="0"
            left="0"
            justifyContent="center"
            alignItems="center"
            flexDirection="column"
          >
            <Spinner
              thickness="4px"
              speed="0.65s"
              emptyColor="gray.200"
              color="blue.500"
              size="xl"
              mb="30px"
            />
            <Text>Training is in progress, this might take few minutes...</Text>
          </Flex>
        </Modal>
      )}
    </Layout2>
  );
};

export default Train;
