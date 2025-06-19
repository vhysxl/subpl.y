import * as Print from "expo-print";
import * as Sharing from "expo-sharing";

export const generatePDF = async (reportData: any) => {
  const html = `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .summary { margin-bottom: 20px; }
            .breakdown { margin-top: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            .metric { background: #f8f9fa; padding: 15px; margin: 10px 0; border-radius: 8px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Laporan Penjualan Bulanan</h1>
            <p>Periode: ${reportData.period}</p>
            <p>Generated: ${new Date().toLocaleDateString("id-ID")}</p>
          </div>
          
          <div class="summary">
            <h2>Ringkasan</h2>
            <div class="metric">
              <strong>Total Orders: ${reportData.summary.totalOrders}</strong>
            </div>
            <div class="metric">
              <strong>Total Revenue: Rp ${reportData.summary.totalRevenue.toLocaleString(
                "id-ID",
              )}</strong>
            </div>
          </div>
          
          ${
            reportData.breakdown
              ? `
          <div class="breakdown">
            <h2>Breakdown per Game</h2>
            <table>
              <tr>
                <th>Game</th>
                <th>Orders</th>
                <th>Revenue</th>
                <th>Quantity</th>
              </tr>
              ${reportData.breakdown.gameBreakdown
                .map(
                  (item: any) => `
                <tr>
                  <td>${item.gameName}</td>
                  <td>${item.totalOrders}</td>
                  <td>Rp ${item.totalRevenue.toLocaleString("id-ID")}</td>
                  <td>${item.totalQuantity}</td>
                </tr>
              `,
                )
                .join("")}
            </table>
            
            <h2>Breakdown per Type</h2>
            <table>
              <tr>
                <th>Type</th>
                <th>Orders</th>
                <th>Revenue</th>
              </tr>
              ${reportData.breakdown.typeBreakdown
                .map(
                  (item: any) => `
                <tr>
                  <td>${item.type}</td>
                  <td>${item.totalOrders}</td>
                  <td>Rp ${item.totalRevenue.toLocaleString("id-ID")}</td>
                </tr>
              `,
                )
                .join("")}
            </table>
          </div>
          `
              : ""
          }
        </body>
      </html>
    `;

  const { uri } = await Print.printToFileAsync({ html });
  await Sharing.shareAsync(uri, { UTI: ".pdf", mimeType: "application/pdf" });
};
