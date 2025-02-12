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

export default function RevokedAccessPage() {
  const [revokedAccessLogs, setRevokedAccessLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch revoked access logs
  useEffect(() => {
    const fetchRevokedAccessLogs = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/revoked_access`,
          {
            method: "GET",
            cache: "no-cache",
          }
        );

        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const data = await response.json();
        setRevokedAccessLogs(data.revoked_access || []);
      } catch (error) {
        console.error("Error fetching revoked access logs:", error);
        alert("Failed to load revoked access logs. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchRevokedAccessLogs();
  }, []);

  // Function to allow access again
  const allowAccess = async (logDescription) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/allow_access`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ logDescription }),
        }
      );

      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

      alert(`Access allowed for "${logDescription}"`);
      setRevokedAccessLogs((prevLogs) =>
        prevLogs.filter((log) => log.log_description !== logDescription)
      );
    } catch (error) {
      console.error("Error allowing access:", error);
      alert("Failed to allow access. Please try again.");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">Revoked Access Logs</h1>

      {loading ? (
        <div className="flex justify-center mt-4">
          <Spinner size="lg" color="primary" />
        </div>
      ) : revokedAccessLogs.length > 0 ? (
        <Table aria-label="Revoked Access Logs">
          <TableHeader>
            <TableColumn>Log Description</TableColumn>
            <TableColumn>Actions</TableColumn>
          </TableHeader>
          <TableBody>
            {revokedAccessLogs.map((item) => (
              <TableRow key={item.log_id || item.log_description}>
                <TableCell>{item.log_description}</TableCell>
                <TableCell>
                  <Button color="success" onPress={() => allowAccess(item.log_description)}>
                    Allow Access
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <p className="text-center text-gray-600 mt-4">
          No revoked access logs available.
        </p>
      )}
    </div>
  );
}
