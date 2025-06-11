'use client'

import { useState, useEffect } from 'react'
import {
  Box,
  Container,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  VStack,
  useDisclosure,
  useColorModeValue,
  Badge,
  IconButton,
  Tooltip,
} from '@chakra-ui/react'
import { motion, AnimatePresence } from 'framer-motion'
import { userApi } from '@/lib/api'

const MotionBox = motion(Box)
const MotionTr = motion(Tr)

export default function UsersPage() {
  const [users, setUsers] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const toast = useToast()
  const bgColor = useColorModeValue('gray.50', 'gray.900')
  const cardBg = useColorModeValue('white', 'gray.800')

  const fetchUsers = async () => {
    try {
      const response = await userApi.getAll()
      setUsers(response.data)
    } catch (error) {
      toast({
        title: 'Error fetching users',
        status: 'error',
        duration: 3000,
      })
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)
    const userData = {
      name: formData.get('name'),
      email: formData.get('email'),
    }

    try {
      await userApi.create(userData)
      toast({
        title: 'User created successfully',
        status: 'success',
        duration: 3000,
      })
      onClose()
      fetchUsers()
    } catch (error) {
      toast({
        title: 'Error creating user',
        status: 'error',
        duration: 3000,
      })
    }
  }

  return (
    <Box bg={bgColor} minH="100vh" py={10}>
      <Container maxW="container.xl">
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box mb={8} display="flex" justifyContent="space-between" alignItems="center">
            <Heading
              bgGradient="linear(to-r, blue.400, purple.500)"
              bgClip="text"
            >
              Users Management
            </Heading>
            <Button
              colorScheme="blue"
              onClick={onOpen}
              size="lg"
              _hover={{ transform: 'translateY(-2px)' }}
              transition="all 0.2s"
            >
              Add New User
            </Button>
          </Box>

          <Box
            bg={cardBg}
            shadow="xl"
            borderRadius="lg"
            overflow="hidden"
            borderWidth="1px"
          >
            <Table variant="simple">
              <Thead bg={useColorModeValue('gray.50', 'gray.700')}>
                <Tr>
                  <Th>Name</Th>
                  <Th>Email</Th>
                  <Th>Status</Th>
                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                <AnimatePresence>
                  {users.map((user: any, index: number) => (
                    <MotionTr
                      key={user.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Td>{user.name}</Td>
                      <Td>{user.email}</Td>
                      <Td>
                        <Badge colorScheme="green">Active</Badge>
                      </Td>
                      <Td>
                        <Tooltip label="Edit user">
                          <IconButton
                            aria-label="Edit user"
                            icon="✏️"
                            size="sm"
                            colorScheme="blue"
                            mr={2}
                          />
                        </Tooltip>
                        <Tooltip label="Delete user">
                          <IconButton
                            aria-label="Delete user"
                            icon="🗑️"
                            size="sm"
                            colorScheme="red"
                          />
                        </Tooltip>
                      </Td>
                    </MotionTr>
                  ))}
                </AnimatePresence>
              </Tbody>
            </Table>
          </Box>
        </MotionBox>

        <Modal isOpen={isOpen} onClose={onClose} size="xl">
          <ModalOverlay backdropFilter="blur(10px)" />
          <ModalContent>
            <ModalHeader>Add New User</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <form onSubmit={handleCreateUser}>
                <VStack spacing={4}>
                  <FormControl isRequired>
                    <FormLabel>Name</FormLabel>
                    <Input
                      name="name"
                      placeholder="Enter user's name"
                      size="lg"
                      _focus={{
                        borderColor: 'blue.400',
                        boxShadow: '0 0 0 1px var(--chakra-colors-blue-400)',
                      }}
                    />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>Email</FormLabel>
                    <Input
                      name="email"
                      type="email"
                      placeholder="Enter user's email"
                      size="lg"
                      _focus={{
                        borderColor: 'blue.400',
                        boxShadow: '0 0 0 1px var(--chakra-colors-blue-400)',
                      }}
                    />
                  </FormControl>
                  <Button
                    type="submit"
                    colorScheme="blue"
                    size="lg"
                    width="full"
                    mt={4}
                    _hover={{ transform: 'translateY(-2px)' }}
                    transition="all 0.2s"
                  >
                    Create User
                  </Button>
                </VStack>
              </form>
            </ModalBody>
          </ModalContent>
        </Modal>
      </Container>
    </Box>
  )
} 