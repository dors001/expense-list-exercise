import { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Button,
  Input,
  Select,
  TableContainer,
  Text,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
} from "@chakra-ui/react";
import "./App.css";

function App() {
  const schema = z.object({
    description: z.string().min(3),
    amount: z.number({ invalid_type_error: "Amount is required" }).min(0.1),
    category: z.string().nonempty({ message: "Must choose a category" }),
  });

  type FormData = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const [selectCategory, setSelectCategory] = useState("all-categories");
  const [tableData, setTableData] = useState<FormData[]>([]);

  const onSubmit = (data: FormData) => {
    setTableData([...tableData, data]);
  };

  const handleCategoryChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectCategory(event.target.value);
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box padding="1rem">
          <label htmlFor="description" className="form-label">
            Description
          </label>
          <Input
            {...register("description")}
            id="description"
            type="text"
            className="form-input"
          />
          {errors.description && (
            <Text color="red" fontSize="1.5rem">
              {errors.description?.message}
            </Text>
          )}
        </Box>
        <Box padding="1rem">
          <label htmlFor="amount" className="form-label">
            Amount
          </label>
          <Input
            {...register("amount", { valueAsNumber: true })}
            type="number"
            className="form-input"
          />
          {errors.amount && (
            <Text color="red" fontSize="1.5rem">
              {errors.amount?.message}
            </Text>
          )}
        </Box>
        <Box padding="1rem">
          <label htmlFor="category" className="form-label">
            Category
          </label>
          <Select
            {...register("category")}
            placeholder="Select category"
            id="category"
            className="form-input"
          >
            <option value="groceries">Groceries</option>
            <option value="utilities">Utilities</option>
            <option value="entertainment">Entertainment</option>
          </Select>
          {errors.category && (
            <Text color="red" fontSize="1.5rem">
              {errors.category?.message}
            </Text>
          )}
          <Button disabled={!isValid} type="submit" className="btn">
            Submit
          </Button>
        </Box>
      </form>
      <Box padding="1rem">
        <Select
          value={selectCategory}
          onChange={handleCategoryChange}
          name="categories,"
          id="categories"
          className="form-input"
        >
          <option value="all-categories">All Categories</option>
          <option value="groceries">Groceries</option>
          <option value="utilities">Utilities</option>
          <option value="entertainment">Entertainment</option>
        </Select>
      </Box>

      <TableContainer fontSize="1.5rem">
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Description</Th>
              <Th>Amount</Th>
              <Th>Category</Th>
              <Th></Th>
            </Tr>
          </Thead>
          <Tbody>
            {tableData
              .filter(
                (item) =>
                  selectCategory === "all-categories" ||
                  item.category === selectCategory
              )
              .map((row, index) => (
                <Tr key={index}>
                  <Td>{row.description}</Td>
                  <Td>{row.amount}</Td>
                  <Td>{row.category}</Td>
                  <Td>
                    <Button
                      colorScheme="red"
                      variant="outline"
                      onClick={() => {
                        const newTableData = [...tableData];
                        newTableData.splice(index, 1);
                        setTableData(newTableData);
                      }}
                    >
                      Delete
                    </Button>
                  </Td>
                </Tr>
              ))}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
}

export default App;
