const fs = require("fs");
const salesData = fs.readFileSync("./data.csv", "utf8").split("\n");

function calculateTotalPrice(salesData) {
  let totalRevenue = 0;
  for (let rowIndex = 1; rowIndex < salesData.length; rowIndex++) {
    let [saleDate, productSKU, unitPrice, quantity, lineTotal] = salesData[rowIndex].split(",");
    totalRevenue += +lineTotal;
  }
  return totalRevenue;
}

function getMonthlySalesTotal(salesData) {
  let salesByMonth = {};
  for (let rowIndex = 1; rowIndex < salesData.length; rowIndex++) {
    let [saleDate, productSKU, unitPrice, quantity, lineTotal] = salesData[rowIndex].split(",");
    let [year, month, day] = saleDate.split("-").map(Number);
    salesByMonth[month] = (salesByMonth[month] || 0) + Number(lineTotal);
  }
  return salesByMonth;
}

function getMostPopularItemByMonth(salesData) {
  let popularityByMonth = {};

  for (let rowIndex = 1; rowIndex < salesData.length; rowIndex++) {
    let [saleDate, productSKU, unitPrice, quantity, lineTotal] = salesData[rowIndex].split(",");
    let [year, month, day] = saleDate.split("-").map(Number);
    quantity = Number(quantity);

    if (!popularityByMonth[month]) {
      popularityByMonth[month] = {};
    }

    popularityByMonth[month][productSKU] = (popularityByMonth[month][productSKU] || 0) + quantity;
  }

  let mostPopularItems = {};
  for (let month in popularityByMonth) {
    let productQuantities = popularityByMonth[month];
    let mostPopularSKU = Object.keys(productQuantities).reduce((skuA, skuB) =>
      productQuantities[skuA] > productQuantities[skuB] ? skuA : skuB
    );
    mostPopularItems[month] = mostPopularSKU;
  }

  return mostPopularItems;
}

function getHighestRevenueItemByMonth(salesData) {
  let revenueByMonth = {};

  for (let rowIndex = 1; rowIndex < salesData.length; rowIndex++) {
    let [saleDate, productSKU, unitPrice, quantity, lineTotal] = salesData[rowIndex].split(",");
    let [year, month, day] = saleDate.split("-").map(Number);
    lineTotal = Number(lineTotal);

    if (!revenueByMonth[month]) {
      revenueByMonth[month] = {};
    }

    revenueByMonth[month][productSKU] = (revenueByMonth[month][productSKU] || 0) + lineTotal;
  }

  let highestRevenueItems = {};
  for (let month in revenueByMonth) {
    let productRevenues = revenueByMonth[month];
    let highestRevenueSKU = Object.keys(productRevenues).reduce((skuA, skuB) =>
      productRevenues[skuA] > productRevenues[skuB] ? skuA : skuB
    );
    highestRevenueItems[month] = highestRevenueSKU;
  }

  return highestRevenueItems;
}

function getMinMaxAvgOrdersForTopItems(salesData) {
  const mostPopularItems = getMostPopularItemByMonth(salesData);
  let orderStatsByMonth = {};

  for (let rowIndex = 1; rowIndex < salesData.length; rowIndex++) {
    let [saleDate, productSKU, unitPrice, quantity, lineTotal] = salesData[rowIndex].split(",");
    let [year, month, day] = saleDate.split("-").map(Number);
    quantity = Number(quantity);

    if (mostPopularItems[month] === productSKU) {
      if (!orderStatsByMonth[month]) {
        orderStatsByMonth[month] = [];
      }
      orderStatsByMonth[month].push(quantity);
    }
  }

  let orderStatistics = {};
  for (let month in orderStatsByMonth) {
    const quantities = orderStatsByMonth[month];
    const minOrder = Math.min(...quantities);
    const maxOrder = Math.max(...quantities);
    const avgOrder = quantities.reduce((sum, qty) => sum + qty, 0) / quantities.length;
    orderStatistics[month] = { minOrder, maxOrder, avgOrder: avgOrder.toFixed(2) };
  }

  return orderStatistics;
}

console.log(calculateTotalPrice(salesData));
console.log(getMonthlySalesTotal(salesData));
console.log(getMostPopularItemByMonth(salesData));
console.log(getHighestRevenueItemByMonth(salesData));
console.log(getMinMaxAvgOrdersForTopItems(salesData));
