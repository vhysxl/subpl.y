import { View, ScrollView, RefreshControl, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import { useAuthStore } from "@/lib/stores/useAuthStore";
import { fetchDashboard, monthlyReport } from "@/lib/fetcher/statiscticsFetch";
import { generatePDF } from "@/lib/common/pdfReportGenerator";
import { AuditLog, DashboardStats } from "@/type";
import { auditFetch } from "@/lib/fetcher/auditFetch";
import { formatDate } from "@/lib/common/formatDate";
import { useAuthGuard } from "@/lib/hooks/useAuthGuard";
import AdminHeader from "@/app/components/admin/AdminHeader";
import PaginationControls from "@/app/components/admin/PaginationControls";
import AdminButton from "@/app/components/admin/AdminButton";
import FailedMsg from "@/app/components/ui/FailedMsg";
import BodyText from "@/app/components/ui/BodyText";

const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [auditLoading, setAuditLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);
  const { user } = useAuthStore();

  useAuthGuard();

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await fetchDashboard();
      setStats(data);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  //ini audit logs
  const fetchAuditLogs = async (page: number = 1) => {
    try {
      setAuditLoading(true);
      const data = await auditFetch(page);

      if (data && data.length > 0) {
        setAuditLogs(data);
        setHasNextPage(data.length >= 10);
      } else {
        setAuditLogs([]);
        setHasNextPage(false);
      }
    } catch (error: any) {
      console.error(error);
    } finally {
      setAuditLoading(false);
    }
  };

  //pagination control
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (hasNextPage) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const generateMonthlyReport = async () => {
    try {
      Alert.alert("Generate Report", "Generate monthly sales report?", [
        { text: "Cancel", style: "cancel" },
        {
          text: "Generate",
          onPress: async () => {
            const currentDate = new Date();
            const year = currentDate.getFullYear();
            const month = currentDate.getMonth() + 1;

            const reportData = await monthlyReport(year, month);
            await generatePDF(reportData);
          },
        },
      ]);
    } catch (error) {
      Alert.alert("Error", "Failed to generate report");
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  useEffect(() => {
    fetchAuditLogs(currentPage);
  }, [currentPage]);

  if (loading) {
    return (
      <View className="flex-1 bg-background justify-center items-center">
        <BodyText>Loading dashboard...</BodyText>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 bg-background justify-center items-center">
        <FailedMsg error={error} onPress={fetchDashboardStats} />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      <AdminHeader
        Heading={`Welcome, ${user?.name || "Admin"}`}
        Body="Dashboard Overview"
      />

      <ScrollView
        className="flex-1 px-4"
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={() => {
              fetchDashboardStats();
              fetchAuditLogs(currentPage);
            }}
          />
        }
        showsVerticalScrollIndicator={false}>
        <View className="flex-row flex-wrap justify-between mb-6">
          <View className="bg-white border border-gray-100 p-4 rounded-xl shadow-sm w-[48%] mb-3">
            <BodyText className="text-gray-600 text-sm mb-1">
              New Orders
            </BodyText>
            <BodyText className="font-bold text-2xl text-gray-900">
              {stats?.dailyOrders || 0}
            </BodyText>
            <BodyText className="text-xs text-gray-500">Today</BodyText>
          </View>

          <View className="bg-white border border-gray-100 p-4 rounded-xl shadow-sm w-[48%] mb-3">
            <BodyText className="text-gray-600 text-sm mb-1">
              New Users
            </BodyText>
            <BodyText className="font-bold text-2xl text-blue-600">
              {stats?.dailyUsers || 0}
            </BodyText>
            <BodyText className="text-xs text-gray-500">Today</BodyText>
          </View>

          <View className="bg-white border border-gray-100 p-4 rounded-xl shadow-sm w-[48%] mb-3">
            <BodyText className="text-gray-600 text-sm mb-1">Revenue</BodyText>
            <BodyText className="font-bold text-2xl text-green-600">
              Rp {stats?.dailyRevenue?.toLocaleString("id-ID") || "0"}
            </BodyText>
            <BodyText className="text-xs text-gray-500">Today</BodyText>
          </View>

          <View className="bg-white border border-gray-100 p-4 rounded-xl shadow-sm w-[48%] mb-3">
            <BodyText className="text-gray-600 text-sm mb-1">
              Unprocessed
            </BodyText>
            <BodyText className="font-bold text-2xl text-orange-600">
              {stats?.unprocessedOrders || 0}
            </BodyText>
            <BodyText className="text-xs text-gray-500">Orders</BodyText>
          </View>
        </View>

        <View className="mb-6">
          <AdminButton
            onPress={generateMonthlyReport}
            title="📊 Generate Monthly Report"
            type="normal"
            fullWidth={true}
          />
        </View>

        <View className="bg-white border border-gray-100 rounded-xl shadow-sm mb-6">
          <View className="p-4 border-b border-gray-100">
            <BodyText className="font-semibold text-lg text-gray-900">
              Admin Activity Log
            </BodyText>
            <BodyText className="text-sm text-gray-500 mt-1">
              Recent admin activities and changes
            </BodyText>
          </View>

          {auditLoading ? (
            <View className="p-4 justify-center items-center">
              <BodyText className="text-gray-500">
                Loading audit logs...
              </BodyText>
            </View>
          ) : auditLogs.length === 0 ? (
            <View className="p-4 justify-center items-center">
              <BodyText className="text-gray-500">No audit logs found</BodyText>
            </View>
          ) : (
            <View>
              {auditLogs.map((log, index) => (
                <View
                  key={log.auditId}
                  className={`p-4 ${
                    index !== auditLogs.length - 1
                      ? "border-b border-gray-50"
                      : ""
                  }`}>
                  <View className="flex-row justify-between items-start mb-2">
                    <BodyText className="font-medium text-gray-900 flex-1 mr-2">
                      {log.activity}
                    </BodyText>
                    <BodyText className="text-xs text-gray-500">
                      {formatDate(log.createdAt)}
                    </BodyText>
                  </View>
                  <BodyText className="text-sm text-gray-600">
                    by {log.adminName}
                  </BodyText>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {auditLogs.length > 0 && (
        <PaginationControls
          onPressNext={handleNextPage}
          onPressPrevious={handlePrevPage}
          disabled={!hasNextPage}
          currentPage={currentPage}
        />
      )}
    </View>
  );
};

export default Dashboard;
