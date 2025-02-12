DATA FETCHER AND STORAGE

This JavaScript code fetches sales data from the given  Petpooja API and stores it in a local SQLite database.It ensures that all relevant sales information is properly structured and stored for further analysis.

> SETUP GUIDE

1) Clone the repository
2) Install Dependencies:
   npm i axios
   npm i sqlite
3)Create an env file
    to store the API_URL

> RUN THE SCRIPT
    node getDataa.js

>The script makes a sales data table with columns:
     id
     receipt_number
     sale_date
     transaction_time
     sale_amount
     tax_amount
     discount_amount
     round_off
     Round-off Value
     net_sale
     payment_mode
     order_type
     transaction_status

> PUSH TO GITHUB
     git add .
     git commit -m "Initial commit: Fetch sales data and store in SQLite"
     git push origin main
     
