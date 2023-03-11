import { Box, Heading, VStack } from "@chakra-ui/react";

export default function Home() {
  return (
    <Box display={"grid"} placeItems="center" h="full" w="full">
      <VStack spacing={8}>
        <Heading borderBottom="4px currentColor solid" pb={4} size={"4xl"}>
          scoyo 😎
        </Heading>
        <Heading size={"2xl"}>Hotel Management System</Heading>
      </VStack>
    </Box>
  );
}
