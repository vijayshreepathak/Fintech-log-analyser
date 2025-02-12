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
  Select,
  SelectItem,
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
  const [unique, setUnique] = React.useState("");
  const [uniqueCount, setUniqueCount] = React.useState(0);

  useEffect(() => {
    if (!unique.length) return;
    const fn = async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/unique/` + unique
      );
      setUniqueCount(await res.text());
    };
    fn();
  }, [unique]);

  const { data, isLoading } = useSWR(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/getLogs?page=${page}&len=10&sortBy=${sortBy}&${search}&sortOrder=${sortDirection ? "asc" : "desc"}`,
    fetcher,
    {
      keepPreviousData: true,
    }
  );
  
  const rowsPerPage = 10;
  const pages = useMemo(() => {
    return data?.count ? Math.floor(data.count / rowsPerPage) : 0;
  }, [data?.count, rowsPerPage]);
  
  useEffect(() => {
    setPage(1);
  }, [sortBy, sortDirection, search]);

  const loadingState = isLoading || data?.logs.length === 0 ? "loading" : "idle";

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
  <div className="flex flex-col">
  <div className="flex flex-col gap-2 mb-6">
    <span className="text-2xl">Search By</span>

    <div className="flex flex-wrap gap-2">
      <Input id="transactionID" className="flex-1 min-w-[250px]" type="text" label="Transaction ID" placeholder="Enter Transaction ID" />
      <Input id="userID" className="flex-1 min-w-[250px]" type="text" label="User ID" placeholder="Enter User ID" />
      <Input id="sourceAccount" className="flex-1 min-w-[250px]" type="text" label="Source Account" placeholder="Enter Source Account" />
    </div>
    <div className="flex flex-wrap gap-2">
      <Input id="destinationAccount" className="flex-1 min-w-[250px]" type="text" label="Destination Account" placeholder="Enter Destination Account" />
      <Input id="currencyType" className="flex-1 min-w-[250px]" type="text" label="Currency Type" placeholder="Enter Currency Type" />
      <Input id="paymentMethod" className="flex-1 min-w-[250px]" type="text" label="Payment Method" placeholder="Enter Payment Method" />
    </div>

    {/* Fraud Probability & Search Button */}
    <div className="flex flex-wrap justify-between items-center mt-3 gap-2">
      <div className="flex items-center gap-3 flex-1 min-w-[250px]">
        <span className="min-w-fit">Fraud Probability</span>
        <Slider defaultValue={[0]} max={100} step={1} onValueChange={(e) => setFraudProbability(e[0])} />
        <span className="font-bold text-[#020817] bg-white px-3 py-1 rounded-full flex items-center">
          {fraudProbability}
        </span>
      </div>
      <Button className="flex-1 min-w-[200px]" color="primary" onClick={searchButtonClick}>Search</Button>
    </div>

  </div>
      <Table aria-label="Transaction Logs">
        <TableHeader>
          {["TransactionID", "UserID", "SourceAccount", "DestinationAccount", "TransactionAmount", "CurrencyType", "TransactionType", "TransactionStatus", "TransactionTimestamp", "IPAddress", "Geolocation", "PaymentMethod", "RiskLevel"].map((col) => (
            <TableColumn key={col} allowsSorting onClick={() => {
              setSortBy(col);
              setSortDirection((prev) => !prev);
            }}>
              {col === "RiskLevel" ? "Fraud Probability" : col}
            </TableColumn>
          ))}
        </TableHeader>
        <TableBody items={data?.logs ?? []} loadingContent={<Spinner />} loadingState={loadingState}>
          {(item) => (
            <TableRow key={Math.random()}>
              {(columnKey) => <TableCell>{getKeyValue(item, columnKey)}</TableCell>}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
