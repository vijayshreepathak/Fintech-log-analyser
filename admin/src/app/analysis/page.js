"use client";
import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  RadialBarChart,
  RadialBar,
  Legend,
} from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];
const FINTECH_RISK_THRESHOLD = 75; // Adjustable threshold for high-risk logs

export default function Page() {
  const [dailyRiskLogs, setDailyRiskLogs] = useState([]);
  const [eventTypeRisks, setEventTypeRisks] = useState([]);
  const [userRisks, setUserRisks] = useState([]);

  useEffect(() => {
    const fetchRiskData = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/ml`);
        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.statusText}`);
        }
        const data = await response.json();
        setDailyRiskLogs(data.dailyRiskLogs || []);
        setEventTypeRisks(data.eventTypeRisks || []);
        setUserRisks(data.userRisks || []);
      } catch (error) {
        console.error("Error fetching risk data:", error);
      }
    };

    fetchRiskData();
  }, []);

  return (
    <section className="w-full h-screen flex flex-col items-center gap-8 p-4">
      {/* Risk Logs Over Time */}
      <div className="flex flex-col w-full h-1/2 items-center">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={dailyRiskLogs}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="count" stroke="#FF4500" />
          </LineChart>
        </ResponsiveContainer>
        <span className="text-lg font-semibold">
          Logs with Risk Score ≥ {FINTECH_RISK_THRESHOLD}
        </span>
      </div>

      {/* Risk Analysis by Event Type and Users */}
      <div className="flex w-full h-1/2 items-center">
        {/* Event Type Risk Pie Chart */}
        <div className="w-1/2 h-full flex flex-col items-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip />
              <Pie
                data={eventTypeRisks}
                cx="50%"
                cy="50%"
                innerRadius="40%"
                outerRadius="60%"
                fill="#8884d8"
                dataKey="count"
              >
                {eventTypeRisks.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <span className="text-lg font-semibold">
            Risk by Event Type (≥ {FINTECH_RISK_THRESHOLD})
          </span>
        </div>

        {/* User Risk Radial Bar Chart */}
        <div className="w-1/2 h-full flex flex-col items-center">
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart
              innerRadius="10%"
              outerRadius="80%"
              barSize={10}
              data={userRisks}
            >
              <RadialBar
                minAngle={15}
                label={{ position: "insideStart", fill: "#fff" }}
                dataKey="count"
              />
              <Tooltip />
              <Legend iconSize={10} layout="horizontal" align="center" />
            </RadialBarChart>
          </ResponsiveContainer>
          <span className="text-lg font-semibold">
            High-Risk Logs by Users (≥ {FINTECH_RISK_THRESHOLD})
          </span>
        </div>
      </div>
    </section>
  );
}
