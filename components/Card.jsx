import { getPrice } from "@/utils";
import {
  VStack,
  Box,
  Button,
  HStack,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useToast,
  Text,
} from "@chakra-ui/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import EditModal from "./EditModal";

const Card = ({ data = { user: { email: "harsh@nice.com" }, room: "A1" } }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isOpen2,
    onOpen: onOpen2,
    onClose: onClose2,
  } = useDisclosure();
  return (
    <VStack
      w={"full"}
      h={240}
      rounded="xl"
      justify="center"
      border="1px #00000020 solid"
      shadow={"md"}
      z={"base"}
    >
      <HStack justify={"space-between"}>
        <Box>{new Date(data.checkIn).toLocaleString()}</Box>
        <Box>{new Date(data.checkOut).toLocaleString()}</Box>
      </HStack>
      <Box>
        {data?.user?.email} - {data?.room}
      </Box>
      <HStack>
        <Button colorScheme={"orange"} onClick={onOpen} variant={"solid"}>
          Edit
        </Button>
        <Button colorScheme={"red"} variant="outline" onClick={onOpen2}>
          Delete
        </Button>
      </HStack>

      {isOpen && (
        <EditModal data={data} isOpen={isOpen} onClose={onClose} id={1} />
      )}
      {isOpen2 && (
        <RefundModal data={data} isOpen={isOpen2} onClose={onClose2} id={1} />
      )}
    </VStack>
  );
};

export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const RefundModal = ({ data, isOpen, onClose }) => {
  const queryClient = useQueryClient();
  const toast = useToast();
  const deleteMutation = useMutation(
    async (id) => {
      const _res = await fetch(`/api/bookings?_id=${id}`, {
        method: "DELETE",
      });
      const res = await _res.json();
      return res;
    },
    {
      onSuccess: (data) => {
        toast({
          title: "Booking Cancelled.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        queryClient.refetchQueries(["bookings"]);
        onClose();
      },
    }
  );
  const price = getPrice({
    checkIn: data.checkIn,
    checkOut: data.checkOut,
    room: data.room,
  });
  const refundAmount = (() => {
    const difference = new Date(data.checkIn).getTime() - new Date().getTime();

    if (difference > 48 * 60 * 60 * 1000) {
      return Math.floor(price);
    } else if (
      difference <= 48 * 60 * 60 * 1000 &&
      difference >= 24 * 60 * 60 * 1000
    ) {
      return Math.floor(price / 2);
    }

    return 0;
  })();
  return (
    <>
      <Modal size={"xl"} isCentered isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Refund</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text fontSize={"3xl"}>₹ {refundAmount}</Text>
            <Text fontSize={"xl"}>Original: ₹ {price}</Text>
          </ModalBody>
          <ModalFooter>
            <Button variant="outline" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button
              variant="solid"
              colorScheme="orange"
              isLoading={deleteMutation.isLoading}
              onClick={() => deleteMutation.mutate(data._id)}
            >
              Cancel Booking
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default Card;
