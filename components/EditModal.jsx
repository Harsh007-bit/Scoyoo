import { getPrice } from "@/utils";
import {
  VStack,
  Button,
  Input,
  Select,
  HStack,
  useDisclosure,
  Heading,
  Box,
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
import { useForm } from "react-hook-form";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const EditModal = ({ data, isOpen, onClose }) => {
  const { register, handleSubmit, watch } = useForm({});
  const price = (() => {
    const nice = watch(["checkIn", "checkOut", "room"]);
    return getPrice({ checkIn: nice[0], checkOut: nice[1], room: nice[2] });
  })();
  const queryClient = useQueryClient();
  const toast = useToast();
  const updateMutation = useMutation(
    async (formData) => {
      const _res = await fetch(`/api/bookings?id=${data._id}`, {
        method: "PUT",
        headers: new Headers({ contentType: "application/json" }),
        body: JSON.stringify(formData),
      });
      const res = await _res.json();
      return res;
    },
    {
      onSuccess: (data) => {
        toast({
          title: "Booking Updated.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        queryClient.refetchQueries(["bookings"]);
        onClose();
      },
    }
  );
  return (
    <>
      <Modal size={"xl"} isCentered isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent
          as="form"
          onSubmit={handleSubmit((data) => {
            const filteredData = Object.fromEntries(
              Object.entries(data).filter(([_, v]) => v !== "" && v !== false)
            );
            delete filteredData["email"];
            delete filteredData["__v"];
            delete filteredData["_id"];
            updateMutation.mutate({
              ...filteredData,
              user: data.email ? { email: data.email } : undefined,
            });
          })}
        >
          <ModalHeader fontSize={"3xl"}>Edit Booking</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            ₹ {price || 0}
            <Box
              display={"flex"}
              mt={4}
              flexDirection="column"
              gap={4}
              rounded="xl"
            >
              <Box>
                <Text>Enter user email</Text>
                <Input
                  type={"email"}
                  {...register("email")}
                  placeholder="john@bruhh.com"
                />
              </Box>
              <Box>
                <Text>Choose Room No</Text>
                <Select {...register("room")} placeholder="choose" w={120}>
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
                <Text>Start and End Time</Text>
                <HStack>
                  <Input
                    {...register("checkIn")}
                    placeholder="start time"
                    size="md"
                    type="datetime-local"
                  />
                  <Input
                    placeholder="end time"
                    size="md"
                    {...register("checkOut")}
                    type="datetime-local"
                  />
                </HStack>
              </Box>
            </Box>
          </ModalBody>
          <ModalFooter>
            <Button variant="outline" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button
              type="submit"
              variant="solid"
              colorScheme="orange"
              isLoading={updateMutation.isLoading}
            >
              Update
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default EditModal;
