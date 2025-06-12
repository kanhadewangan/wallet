'use client'

import { Box, Container, Heading, SimpleGrid, VStack, Button, Text, useColorModeValue } from '@chakra-ui/react'
import { motion } from 'framer-motion'
import Link from 'next/link'

const MotionBox = motion(Box)

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
    },
  }),
}

const features = [
  {
    title: 'Users',
    description: 'Manage your user accounts and profiles',
    href: '/users',
    color: 'blue',
  },
  {
    title: 'Posts',
    description: 'Create and manage your content',
    href: '/posts',
    color: 'green',
  },
  {
    title: 'Payments',
    description: 'Handle all your financial transactions',
    href: '/payments',
    color: 'purple',
  },
  {
    title: 'Transactions',
    description: 'Track and manage your transaction history',
    href: '/transactions',
    color: 'orange',
  },
]

export default function Home() {
  const bgColor = useColorModeValue('gray.50', 'gray.900')
  const cardBg = useColorModeValue('white', 'gray.800')

  return (
    <Box bg={bgColor} minH="100vh">
      <Container maxW="container.xl" py={20}>
        <VStack spacing={12}>
          <MotionBox
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            textAlign="center"
          >
            <Heading
              as="h1"
              size="2xl"
              bgGradient="linear(to-r, blue.400, purple.500)"
              bgClip="text"
              mb={4}
            >
              Welcome to Your App
            </Heading>
            <Text fontSize="xl" color="gray.600">
              Choose a section to get started
            </Text>
          </MotionBox>

          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={8} w="full">
            {features.map((feature, i) => (
              <MotionBox
                key={feature.title}
                custom={i}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Box
                  p={8}
                  bg={cardBg}
                  shadow="xl"
                  borderWidth="1px"
                  borderRadius="lg"
                  _hover={{
                    shadow: '2xl',
                    transform: 'translateY(-5px)',
                  }}
                  transition="all 0.3s"
                >
                  <VStack spacing={4} align="start">
                    <Heading size="md">{feature.title}</Heading>
                    <Text color="gray.600">{feature.description}</Text>
                    <Link href={feature.href} passHref>
                      <Button
                        colorScheme={feature.color}
                        w="full"
                        size="lg"
                        mt={4}
                      >
                        Get Started
                      </Button>
                    </Link>
                  </VStack>
                </Box>
              </MotionBox>
            ))}
          </SimpleGrid>
        </VStack>
      </Container>
    </Box>
  )
} 