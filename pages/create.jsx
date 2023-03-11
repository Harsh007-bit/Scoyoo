import { sleep } from "@/components/Card";
import {
  Box,
  HStack,
  Text,
  Input,
  Select,
  Heading,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { getPrice } from "@/utils";

export default function Home() {
  const { register, handleSubmit, reset, watch } = useForm();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const price = (() => {
    const nice = watch(["checkIn", "checkOut", "room"]);
    return getPrice({ checkIn: nice[0], checkOut: nice[1], room: nice[2] });
  })();
  const [data, setData] = useState({});
  return (
    <>
      <Box display={"grid"} placeItems="center" h="full" w="full">
        <Box
          display={"flex"}
          flexDirection="column"
          gap={4}
          as="form"
          bg="gray.50"
          shadow={"lg"}
          p={8}
          onSubmit={handleSubmit((data) => {
            setData(data);
            onOpen();
          })}
          rounded="xl"
        >
          <Heading size={"lg"}>Create Booking</Heading>₹ {price || 0}
          <Box>
            <Text>Enter user email</Text>
            <Input
              type={"email"}
              {...register("email")}
              required
              placeholder="john@bruhh.com"
            />
          </Box>
          <Box>
            <Text>Choose Room No</Text>
            <Select {...register("room")} required placeholder="choose" w={120}>
              <option value="A1">A1</option>
              <option value="A2">A2</option>
              <option value="B1">B1</option>
              <option value="B2">B2</option>
              <option value="B3">B3</option>
              <option value="C1">C1</option>
              <option value="C1">C2</option>
              <option value="C2">C3</option>
              <option value="C3">C4</option>
              <option value="C4">C5</option>
            </Select>
          </Box>
          <Box>
            <Text>CheckIn and CheckOut Time</Text>
            <HStack>
              <Input
                required
                {...register("checkIn")}
                placeholder="start time"
                size="md"
                type="datetime-local"
              />
              <Input
                onChange={(e) => setData(e.target.value)}
                placeholder="end time"
                size="md"
                required
                {...register("checkOut")}
                type="datetime-local"
              />
            </HStack>
          </Box>
          <Button type="submit" colorScheme={"orange"}>
            Book Room
          </Button>
        </Box>
      </Box>
      {isOpen && (
        <ConfirmModal
          isOpen={isOpen}
          data={data}
          onClose={() => {
            reset();
            setData({});
            onClose();
          }}
        />
      )}
    </>
  );
}

const ConfirmModal = ({ isOpen, onClose, data }) => {
  const toast = useToast();
  const { isLoading } = useQuery(
    ["available", data],
    async () => {
      const _res = await fetch(
        `/api/bookings/is-available?room=${data.room}&checkIn=${data.checkIn}&checkOut=${data.checkOut}`
      );
      const res = await _res.json();
      return res;
    },
    {
      onSuccess: (data) => {
        setAvailable(data);
      },
      onError: (data) => {
        setAvailable(false);
        toast({
          duration: 1000,
          status: "error",
          description: "Failed to fetch availability",
        });
      },
    }
  );
  const [available, setAvailable] = useState(true);
  const bookMutation = useMutation(
    async (data) => {
      const _res = await fetch(`/api/bookings`, {
        method: "POST",
        headers: new Headers({ contentType: "application/json" }),
        body: JSON.stringify({
          room: data.room,
          user: { email: data.email },
          checkIn: data.checkIn,
          checkOut: data.checkOut,
        }),
      });
      const res = await _res.json();
      return res;
    },
    {
      onSuccess: () => {
        toast({
          title: "Booking Successful",
          status: "success",
          duration: 2000,
          isClosable: true,
        });
        onClose();
      },
      onError: (data) => {
        toast({
          duration: 1000,
          status: "error",
          description: "Failed to Book",
        });
      },
    }
  );
  return (
    <Modal isCentered isOpen={isOpen} size={"3xl"} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Confirm Booking</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {isLoading ? (
            <Text>Loading...</Text>
          ) : available ? (
            <Text>
              Room is Available. Are you sure you want to book this room?
            </Text>
          ) : (
            <Text>Room is not available. Please choose another room.</Text>
          )}
        </ModalBody>
        <ModalFooter>
          <Button variant={"outline"} mr={3} onClick={onClose}>
            Close
          </Button>
          <Button
            colorScheme={"orange"}
            isLoading={bookMutation.isLoading}
            isDisabled={!available}
            onClick={() => bookMutation.mutate(data)}
          >
            Book Now
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
