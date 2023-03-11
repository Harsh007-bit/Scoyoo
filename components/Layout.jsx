import useAutoAnimate from "@/useAutoAnimate";
import { VStack, Heading, Flex } from "@chakra-ui/react";
import Link from "next/link";

const Layout = ({ children }) => {
  return (
    <>
      <Flex height={"100vh"} width={"100vw"}>
        <VStack
          alignItems={"start"}
          width={300}
          p={8}
          flex={"none"}
          height="full"
          spacing={8}
          bg={"gray.100"}
        >
          <Link href={"/"}>
            <Heading size={"lg"}>scoyo 😎</Heading>
          </Link>
          <VStack fontSize={"xl"} alignItems={"start"}>
            <Link href={"/create"}>Create</Link>
            <Link href={"/bookings"}>List</Link>
          </VStack>
        </VStack>
        <VStack
          ref={useAutoAnimate()}
          flex={1}
          height="full"
          overflow={"scroll"}
        >
          {children}
        </VStack>
      </Flex>
    </>
  );
};

export default Layout;
