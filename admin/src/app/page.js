"use client";
import { Divider } from "@nextui-org/react";
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

export default function Dashboard() {
  const [logVTime, setLogVTime] = useState([]);
  const [eventsTypeVTime, setEventsTypeVTime] = useState([]);
  const [criticalAlertsVTime, setCriticalAlertsVTime] = useState([]);
  const [criticalAlertGroupByEventType, setCriticalAlertGroupByEventType] =
    useState([]);
  const [logCount, setLogCount] = useState(0);
  const [transactionFraudCount, setTransactionFraudCount] = useState(0);
  const [accessAuthFraudCount, setAccessAuthFraudCount] = useState(0);
  const [eventSeverityVTime, setEventSeverityVTime] = useState([]);
  const [eventSeverityDaily, setEventSeverityDaily] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/dashboard?threshold=0.7`
        );
        const data = await response.json();
        setEventsTypeVTime(data.eventTypeVTime || []);
        setLogVTime(data.logVTime || []);
        setCriticalAlertsVTime(data.criticalAlertsVTime || []);
        setCriticalAlertGroupByEventType(data.criticalAlertGroupByEventType || []);
        setLogCount(data.logcount || 0);
        setTransactionFraudCount(data.transactionFraudCount || 0);
        setAccessAuthFraudCount(data.accessAuthFraudCount || 0);
        setEventSeverityVTime(data.eventSeverityVTime || []);
        setEventSeverityDaily(data.eventSeverityDaily || []);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };
    
    fetchData();
  }, []);

  return (
    <>
      <section className="w-full h-screen flex flex-col gap-8 flex-nowrap">
        <h3 className="text-2xl underline underline-offset-4 uppercase tracking-widest">
          FinTech Fraud Analysis Dashboard
        </h3>
        <div className="flex gap-8 h-1/2 flex-nowrap w-full">
          <div className="w-full h-full flex flex-col items-center gap-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                width={500}
                height={300}
                data={logVTime}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#FFD700" />
              </LineChart>
            </ResponsiveContainer>
            <span className="text-lg">Fraudulent Logs Detected in the Past Week</span>
          </div>
          <div className="w-full h-full flex flex-col items-center gap-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart width={800} height={400}>
                <Tooltip />
                <Pie
                  data={eventsTypeVTime}
                  cx={285}
                  cy={140}
                  innerRadius={120}
                  outerRadius={140}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {eventsTypeVTime.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <span className="text-lg">
              Fraud Logs Grouped By Event Type (Past Week)
            </span>
          </div>
        </div>
      </section>
      <Divider className="my-4" />
      <section className="w-full h-[50vh] flex flex-col items-center gap-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            width={500}
            height={300}
            data={criticalAlertsVTime}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="count" stroke="#FFD700" activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
        <span className="text-lg">Critical Alerts Detected in Past Week</span>
      </section>
      <Divider className="my-4" />
      <section className="w-full h-[50vh] flex flex-col flex-nowrap gap-8">
        <h3 className="text-2xl underline underline-offset-4 uppercase tracking-widest">
          Fraud Statistics
        </h3>
        <div className="text-black flex gap-8 h-full flex-nowrap w-full">
          <div className="w-1/3 h-full rounded-3xl bg-[#a4c9f0] flex flex-col items-center justify-around">
            <div className="w-3/4 object-contain">
              <img src="/router.png" className="" />
            </div>
            <div className="text-xl font-bold">
              Total Fraudulent Logs Detected in Past 24 Hours: {logCount}
            </div>
          </div>
          <div className="w-1/3 h-full rounded-3xl bg-[#a4c9f0] flex flex-col items-center justify-around">
            <div className="w-3/4 object-contain">
              <img src="/router.png" className="" />
            </div>
            <div className="text-xl font-bold">
              Transaction-Related Fraud (Weekly): {transactionFraudCount}
            </div>
          </div>
          <div className="w-1/3 h-full rounded-3xl bg-[#a4c9f0] flex flex-col items-center justify-around">
            <div className="w-3/4 object-contain">
              <img src="/router.png" className="" />
            </div>
            <div className="text-xl font-bold">
              Access and Authentication Fraud (Weekly): {accessAuthFraudCount}
            </div>
          </div>
        </div>
      </section>
      <Divider className="my-4" />
    </>
  );
}
