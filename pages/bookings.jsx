import Card from "@/components/Card";
import useAutoAnimate from "@/useAutoAnimate";
import {
  Button,
  Box,
  Heading,
  Grid,
  HStack,
  useDisclosure,
  Text,
  CheckboxGroup,
  Checkbox,
  Input,
  Select,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";

export default function Home() {
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState({});
  const { isLoading, isFetching } = useQuery(
    ["bookings", filter],
    async () => {
      const _res = await fetch(`/api/bookings`);
      const res = await _res.json();
      return res;
    },
    {
      onSuccess: (data) => {
        setBookings(data);
      },
    }
  );

  const filteredData =
    Object.keys(filter).length === 0
      ? bookings
      : bookings.filter((b) => {
          const actualFilter = Object.entries(filter).filter(
            ([_, v]) => v !== "" && v !== false
          );
          for (const [k, v] of actualFilter) {
            if (b[k] === v) return true;
          }
          return false;
        });

  return (
    <Box p={8} h="full" w="full">
      <Heading size={"xl"} mb={8} display="flex" alignItems={"center"} gap={4}>
        List Bookings
        {isLoading ||
          (isFetching && (
            <Text fontSize={"sm"} fontWeight="normal">
              Fetching Bookings...
            </Text>
          ))}
      </Heading>
      <Filter filters={[filter, setFilter]} />
      <Grid
        templateColumns={"repeat(3,1fr)"}
        gap={8}
        py={8}
        w="full"
        ref={useAutoAnimate()}
      >
        {filteredData.map((data) => {
          return <Card data={data} />;
        })}
      </Grid>
    </Box>
  );
}

const Filter = ({ filters: [filters, setFilters] }) => {
  const { isOpen, onToggle } = useDisclosure();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ defaultValues: filters });
  return (
    <Box w="full" zIndex={"sticky"} pos={"sticky"} top={8}>
      <HStack ref={useAutoAnimate()} justify={"end"} position="relative">
        <Button onClick={onToggle}>Filter</Button>
        {isOpen && (
          <Box
            h={320}
            onReset={() => {
              console.log("reset");
              setFilters({});
              reset();
            }}
            w={500}
            display="flex"
            gap={2}
            flexDirection={"column"}
            justifyContent="center"
            pos="absolute"
            bg="white"
            bottom={-328}
            border="1px #00000020 solid"
            rounded="3xl"
            as="form"
            onSubmit={handleSubmit((data) => {
              setFilters(data);
            })}
            p={8}
            right={0}
            shadow="lg"
          >
            <Checkbox colorScheme="orange" {...register("passed")}>
              Passed
            </Checkbox>
            <CheckboxGroup colorScheme="orange">
              <Text>Room Type</Text>
              <HStack>
                <Checkbox {...register("roomTypeA")}>A</Checkbox>
                <Checkbox {...register("roomTypeB")}>B</Checkbox>
                <Checkbox {...register("roomTypeC")}>C</Checkbox>
              </HStack>
            </CheckboxGroup>
            <Box>
              <Select {...register("room")} placeholder="room no" w={120}>
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
            </Box>{" "}
            <Text>CheckIn - CheckOut Time</Text>
            <HStack gap={1}>
              <Input
                placeholder="start"
                size="md"
                type="datetime-local"
                {...register("checkIn")}
              />
              <Input
                placeholder="end"
                {...register("checkOut")}
                size="md"
                type="datetime-local"
              />
            </HStack>
            <HStack gap={1} pt={2}>
              <Button type="submit" colorScheme={"orange"}>
                Apply
              </Button>
              <Button type="reset" variant={"outline"} colorScheme="red">
                Reset
              </Button>
            </HStack>
          </Box>
        )}
      </HStack>
    </Box>
  );
};
