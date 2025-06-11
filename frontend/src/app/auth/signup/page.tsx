'use client'

import { useState } from 'react'
import {
  Box,
  Container,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
  VStack,
  Text,
  useToast,
  InputGroup,
  InputRightElement,
  IconButton,
  useColorModeValue,
  Divider,
  HStack,
} from '@chakra-ui/react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { EmailIcon, LockIcon, ViewIcon, ViewOffIcon, PhoneIcon } from '@chakra-ui/icons'

const MotionBox = motion(Box)

export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const toast = useToast()
  const router = useRouter()

  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    const formData = new FormData(e.target as HTMLFormElement)
    
    try {
      // TODO: Implement actual sign up logic
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulated API call
      toast({
        title: 'Account created successfully',
        status: 'success',
        duration: 3000,
      })
      router.push('/auth/signin')
    } catch (error) {
      toast({
        title: 'Error creating account',
        status: 'error',
        duration: 3000,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Box
      minH="100vh"
      bg={useColorModeValue('gray.50', 'gray.900')}
      py={20}
      px={4}
    >
      <Container maxW="container.sm">
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <VStack spacing={8} align="stretch">
            <Box textAlign="center">
              <Heading
                as="h1"
                size="xl"
                bgGradient="linear(to-r, blue.400, purple.500)"
                bgClip="text"
                mb={2}
              >
                Create Account
              </Heading>
              <Text color="gray.600">Join us today</Text>
            </Box>

            <Box
              as="form"
              onSubmit={handleSubmit}
              p={8}
              borderWidth={1}
              borderRadius="lg"
              boxShadow="xl"
              bg={bgColor}
              borderColor={borderColor}
            >
              <VStack spacing={6}>
                <FormControl isRequired>
                  <FormLabel>Full Name</FormLabel>
                  <Input
                    name="name"
                    type="text"
                    placeholder="Enter your full name"
                    size="lg"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Email</FormLabel>
                  <InputGroup size="lg">
                    <Input
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      pl={10}
                    />
                    <InputRightElement pointerEvents="none" h="full">
                      <EmailIcon color="gray.400" />
                    </InputRightElement>
                  </InputGroup>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Phone Number</FormLabel>
                  <InputGroup size="lg">
                    <Input
                      name="phone"
                      type="tel"
                      placeholder="Enter your phone number"
                      pl={10}
                    />
                    <InputRightElement pointerEvents="none" h="full">
                      <PhoneIcon color="gray.400" />
                    </InputRightElement>
                  </InputGroup>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Password</FormLabel>
                  <InputGroup size="lg">
                    <Input
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Create a password"
                      pl={10}
                    />
                    <InputRightElement h="full">
                      <IconButton
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                        icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                        variant="ghost"
                        onClick={() => setShowPassword(!showPassword)}
                      />
                    </InputRightElement>
                  </InputGroup>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Confirm Password</FormLabel>
                  <InputGroup size="lg">
                    <Input
                      name="confirmPassword"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Confirm your password"
                      pl={10}
                    />
                    <InputRightElement h="full">
                      <IconButton
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                        icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                        variant="ghost"
                        onClick={() => setShowPassword(!showPassword)}
                      />
                    </InputRightElement>
                  </InputGroup>
                </FormControl>

                <Button
                  type="submit"
                  colorScheme="blue"
                  size="lg"
                  width="full"
                  isLoading={isLoading}
                  loadingText="Creating account..."
                  _hover={{ transform: 'translateY(-2px)' }}
                  transition="all 0.2s"
                >
                  Sign Up
                </Button>

                <HStack w="full" spacing={4}>
                  <Divider />
                  <Text fontSize="sm" color="gray.500" whiteSpace="nowrap">
                    Or continue with
                  </Text>
                  <Divider />
                </HStack>

                <HStack spacing={4} w="full">
                  <Button
                    variant="outline"
                    w="full"
                    leftIcon={<Text>G</Text>}
                    _hover={{ transform: 'translateY(-2px)' }}
                    transition="all 0.2s"
                  >
                    Google
                  </Button>
                  <Button
                    variant="outline"
                    w="full"
                    leftIcon={<Text>G</Text>}
                    _hover={{ transform: 'translateY(-2px)' }}
                    transition="all 0.2s"
                  >
                    GitHub
                  </Button>
                </HStack>
              </VStack>
            </Box>

            <Text textAlign="center">
              Already have an account?{' '}
              <Link href="/auth/signin" passHref>
                <Text
                  as="span"
                  color="blue.500"
                  cursor="pointer"
                  _hover={{ textDecoration: 'underline' }}
                >
                  Sign in
                </Text>
              </Link>
            </Text>
          </VStack>
        </MotionBox>
      </Container>
    </Box>
  )
} 