"use client";
import React from "react";
import ChatCard from "../Chat/ChatCard";
import TableOne from "../Tables/TableUsers";
import Calendar from "../Calender";
import DashboardStatsView from "../CardDataStats";

const Dashboard: React.FC = () => {
  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
        <DashboardStatsView />
      </div>

      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        <div className="col-span-12 xl:col-span-8">
          <TableOne />
        </div>
        <ChatCard />
        <div className="col-span-12 xl:col-span-12">
          <Calendar />
        </div>
      </div>
    </>
  );
};

export default Dashboard;
