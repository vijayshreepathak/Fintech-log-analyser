"use client";
import React, { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Spinner,
  Button,
} from "@nextui-org/react";

export default function BlockedIPsPage() {
  const [blockedIPs, setBlockedIPs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch blocked IPs on component load
  useEffect(() => {
    const fetchBlockedIPs = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/blocked_ips`,
          {
            method: "GET",
            cache: "no-cache",
          }
        );

        if (!response.ok) throw new Error("Failed to fetch blocked IPs");

        const data = await response.json();
        setBlockedIPs(data.blocked_ips || []);
      } catch (error) {
        console.error("Error fetching blocked IPs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlockedIPs();
  }, []);

  // Function to unblock an IP
  const unblockIP = async (ip) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/unblock_ip`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ip }),
        }
      );

      if (!response.ok) throw new Error("Failed to unblock IP");

      setBlockedIPs((prev) => prev.filter((item) => item.ip_address !== ip));
      alert(`IP ${ip} unblocked successfully!`);
    } catch (error) {
      console.error("Error unblocking IP:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center w-full p-6">
      <h1 className="text-2xl font-bold my-4">Blocked IP Management</h1>

      {loading ? (
        <Spinner size="lg" color="primary" />
      ) : blockedIPs.length === 0 ? (
        <p className="text-lg font-semibold mt-4">No blocked IPs to display.</p>
      ) : (
        <Table aria-label="Blocked IPs Table" className="w-full max-w-3xl">
          <TableHeader>
            <TableColumn>IP Address</TableColumn>
            <TableColumn>Actions</TableColumn>
          </TableHeader>
          <TableBody>
            {blockedIPs.map((item) => (
              <TableRow key={item.ip_address}>
                <TableCell>{item.ip_address}</TableCell>
                <TableCell>
                  <Button
                    color="danger"
                    auto
                    onPress={() => unblockIP(item.ip_address)}
                  >
                    Unblock
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
