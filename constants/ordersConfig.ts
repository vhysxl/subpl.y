// Order status configurations
export const STATUS_CONFIG = {
  pending: {
    title: "Waiting for Payment",
    icon: "hourglass-outline",
    color: "#ffc107",
    emptyMessage: "No pending orders yet",
  },
  processing: {
    title: "Processing",
    icon: "reload-circle-outline",
    color: "#00bfff",
    emptyMessage: "No orders in process",
  },
  completed: {
    title: "Completed",
    icon: "checkmark-outline",
    color: "#32cd32",
    emptyMessage: "No completed orders yet",
  },
};
