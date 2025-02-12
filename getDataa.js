require("dotenv").config();

const axios = require("axios");
const sqlite3 = require("sqlite3").verbose();

const API_URL = process.env.API_URL;

//connect to the database
const db = new sqlite3.Database("sales_data.db", (err) => {
    if (err) {
        console.error("Error opening database:", err.message);
        process.exit(1);
    }
    console.log("Connected to SQLite database");
});

//creating table
const createTable = () => {
    const query = `CREATE TABLE IF NOT EXISTS sales_data (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    receipt_number TEXT,
    sale_date TEXT,
transaction_time TEXT,
    sale_amount REAL,
    tax_amount REAL,
    discount_amount REAL,
    round_off REAL,
    net_sale REAL,
    payment_mode TEXT,
    order_type TEXT,
    transaction_status TEXT
  )`;

    db.run(query, (err) => {
        if (err) console.error("Error creating table:", err.message);
    });
};

// Fetching sales data 
const fetchSalesData = async () => {
    try {
        const response = await axios.get(API_URL);
        const salesData = response.data?.Records || [];
        if (!Array.isArray(salesData)) {
            throw new Error("Invalid data format received from API");
        }

        console.log(`Fetched ${salesData.length} records from API`);
        return salesData;
    } catch (error) {
        console.error("Error fetching sales data:", error.message);
        return [];
    }
};

// Inserting data
const insertSalesData = (salesData) => {
    return new Promise((resolve, reject) => {
        if (salesData.length === 0) {
            console.log("No valid sales data to insert.");
            return resolve();
        }

        const insertStmt = db.prepare(
            `INSERT INTO sales_data 
          (receipt_number, sale_date, transaction_time, sale_amount, tax_amount, discount_amount, round_off, net_sale, payment_mode, order_type, transaction_status) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
        );

        salesData.forEach((sale) => {
            const values = [
                sale["Receipt number"] || "Unknown",
                sale["Receipt Date"] || "N/A",
                sale["Transaction Time"] || "N/A",
                parseFloat(sale["Invoice amount"]) || 0,
                parseFloat(sale["Tax amount"]) || 0,
                parseFloat(sale["Discount amount"]) || 0,
                parseFloat(sale["Round Off"]) || 0,
                parseFloat(sale["Net sale"]) || 0,
                sale["Payment Mode"] || "Unknown",
                sale["Order Type"] || "Unknown",
                sale["Transaction status"] || "Unknown",
            ];

            insertStmt.run(values, (err) => {
                if (err) console.error("Error inserting data:", err.message);
            });
        });

        insertStmt.finalize((err) => {
            if (err) return reject(err);
            console.log("Sales data inserted successfully");
            resolve();
        });
    });
};

//fetch and store the data to the database
const fetchAndStoreSalesData = async () => {
    try {
        createTable();
        const salesData = await fetchSalesData();
        await insertSalesData(salesData);
    } catch (error) {
        console.error("Unexpected error:", error.message);
    } finally {
        db.close((err) => {
            if (err) console.error("Error closing database:", err.message);
            else console.log("Database connection closed.");
        });
    }
};

//call the function
fetchAndStoreSalesData();

