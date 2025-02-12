"use client";
import React from "react";
import { saveAs } from "file-saver";
import { Button } from "@nextui-org/react";

export default function ExportLogsPage() {
  const downloadFile = async (format) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/exportLogsAs${format}`
      );

      if (!response.ok) throw new Error(`Failed to download ${format}`);

      const blob = await response.blob();
      saveAs(blob, `AllLogs.${format.toLowerCase()}`);
    } catch (error) {
      console.error(`Error downloading ${format}:`, error);
      alert(`Failed to download logs as ${format}. Please try again.`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6 p-6">
      <h1 className="text-2xl font-bold mb-4">Export Logs</h1>
      <div className="flex gap-4">
        <Button color="primary" onPress={() => downloadFile("CSV")}>
          Download CSV
        </Button>
        <Button color="secondary" onPress={() => downloadFile("HTML")}>
          Download HTML
        </Button>
      </div>
    </div>
  );
}
