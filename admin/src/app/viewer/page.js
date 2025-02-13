"use client";

import React, { useEffect, useMemo } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
  Spinner,
  getKeyValue,
  Input,
  Button,
} from "@nextui-org/react";
import useSWR from "swr";
import { Slider } from "@/components/ui/slider";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export default function Page() {
  const [page, setPage] = React.useState(1);
  const [sortBy, setSortBy] = React.useState("");
  const [sortDirection, setSortDirection] = React.useState(true);
  const [search, setSearch] = React.useState("");
  const [fraudProbability, setFraudProbability] = React.useState(0);

  const { data, isLoading } = useSWR(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/getLogs?page=${page}&len=10&sortBy=${sortBy}&${search}&sortOrder=${sortDirection ? "asc" : "desc"}`,
    fetcher,
    {
      keepPreviousData: true,
    }
  );

  const rowsPerPage = 10;
  const pages = useMemo(() => {
    return data?.count ? Math.ceil(data.count / rowsPerPage) : 0;
  }, [data?.count, rowsPerPage]);

  useEffect(() => {
    setPage(1);
  }, [sortBy, sortDirection, search]);

  const searchButtonClick = () => {
    const transactionID = document.getElementById("transactionID").value;
    const userID = document.getElementById("userID").value;
    const sourceAccount = document.getElementById("sourceAccount").value;
    const destinationAccount = document.getElementById("destinationAccount").value;
    const currencyType = document.getElementById("currencyType").value;
    const paymentMethod = document.getElementById("paymentMethod").value;
    setSearch(
      `transactionID=${transactionID}&userID=${userID}&sourceAccount=${sourceAccount}&destinationAccount=${destinationAccount}&currencyType=${currencyType}&paymentMethod=${paymentMethod}&fraudProbability=${fraudProbability}`
    );
    setSortBy("TransactionTimestamp");
    setSortDirection(true);
  };

  return (
    <div className="flex flex-col p-4 bg-[#10172a] text-white min-h-screen">
      {/* Search Section */}
      <div className="flex flex-col gap-4 mb-8">
        <h1 className="text-2xl font-semibold">Search Criteria</h1>

        {/* Input Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="flex flex-col">
            <label htmlFor="transactionID" className="text-sm mb-1">
              Transaction ID
            </label>
            <Input
              id="transactionID"
              className="w-full"
              type="text"
              placeholder="Enter Transaction ID"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="userID" className="text-sm mb-1">
              User ID
            </label>
            <Input
              id="userID"
              className="w-full"
              type="text"
              placeholder="Enter User ID"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="sourceAccount" className="text-sm mb-1">
              Source Account
            </label>
            <Input
              id="sourceAccount"
              className="w-full"
              type="text"
              placeholder="Enter Source Account"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="destinationAccount" className="text-sm mb-1">
              Destination Account
            </label>
            <Input
              id="destinationAccount"
              className="w-full"
              type="text"
              placeholder="Enter Destination Account"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="currencyType" className="text-sm mb-1">
              Currency Type
            </label>
            <Input
              id="currencyType"
              className="w-full"
              type="text"
              placeholder="Enter Currency Type"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="paymentMethod" className="text-sm mb-1">
              Payment Method
            </label>
            <Input
              id="paymentMethod"
              className="w-full"
              type="text"
              placeholder="Enter Payment Method"
            />
          </div>
        </div>

        {/* Fraud Probability Slider */}
        <div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-4">
          <div className="flex items-center gap-4 w-full">
            <label className="text-sm">Fraud Probability:</label>
            <Slider
              className="flex-1"
              defaultValue={[0]}
              max={100}
              step={1}
              onValueChange={(e) => setFraudProbability(e[0])}
            />
            <span className="text-sm px-3 py-1 bg-white text-black rounded">
              {fraudProbability}%
            </span>
          </div>
          <Button
            color="primary"
            className="w-full sm:w-1/3"
            onClick={searchButtonClick}
          >
            Search
          </Button>
        </div>
      </div>

      {/* Table Section */}
      <div className="flex flex-col gap-4">
        <Table
          aria-label="Transaction Logs"
          className="bg-[#1e293b] rounded-lg overflow-auto"
        >
          <TableHeader>
            {[
              "TransactionID",
              "UserID",
              "SourceAccount",
              "DestinationAccount",
              "TransactionAmount",
              "CurrencyType",
              "TransactionType",
              "TransactionStatus",
              "TransactionTimestamp",
              "PaymentMethod",
              "Fraud Probability",
            ].map((col) => (
              <TableColumn
                key={col}
                allowsSorting
                onClick={() => {
                  setSortBy(col);
                  setSortDirection((prev) => !prev);
                }}
              >
                {col}
              </TableColumn>
            ))}
          </TableHeader>
          <TableBody
            items={data?.logs ?? []}
            loadingContent={<Spinner />}
            loadingState={isLoading ? "loading" : "idle"}
          >
            {(item) => (
              <TableRow key={item.TransactionID}>
                {(columnKey) => <TableCell>{getKeyValue(item, columnKey)}</TableCell>}
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
        <Pagination
          total={pages}
          current={page}
          onChange={(page) => setPage(page)}
          className="mt-4"
        />
      </div>
    </div>
  );
}
