export const getStatusConfig = (status: string) => {
  switch (status) {
    case "pending":
      return {
        bgColor: "bg-yellow-100",
        textColor: "text-yellow-800",
        icon: "hourglass-outline" as const,
        iconColor: "#ffc107",
      };
    case "processing":
      return {
        bgColor: "bg-blue-100",
        textColor: "text-blue-800",
        icon: "reload-circle-outline" as const,
        iconColor: "#00bfff",
      };
    case "completed":
      return {
        bgColor: "bg-green-100",
        textColor: "text-green-800",
        icon: "checkmark-circle-outline" as const,
        iconColor: "#32cd32",
      };
    case "failed":
    case "cancelled":
      return {
        bgColor: "bg-red-100",
        textColor: "text-red-800",
        icon: "close-circle-outline" as const,
        iconColor: "#f44336",
      };
    default:
      return {
        bgColor: "bg-gray-100",
        textColor: "text-gray-800",
        icon: "help-circle-outline" as const,
        iconColor: "#666",
      };
  }
};
