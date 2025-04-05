Sure! Here's a polished `README.md` file in English for your GitHub project:

---

# 🧳 Travel Cost Planner

A simple and modern React app to track and manage travel expenses collaboratively. Built with **React** and **Supabase** for backend data storage, this application helps users monitor planned vs actual costs, manage refunds, and organize expenses by categories and trips.

---

## ✨ Features

- ✅ Add, edit, and manage travel expenses
- 📊 Filter costs by **trip name** and **category**
- 🧾 Track planned and actual costs
- 💳 Track who paid and who owes
- 🔄 Mark expenses as **paid**, **refunded**, or **suspended**
- 🔍 Filter interface to narrow down data
- 🗳️ Voting system for marking interesting expenses
- 💡 Clean and responsive UI

---

## 🛠️ Tech Stack

- **Frontend:** React (Hooks)
- **Backend:** Supabase (PostgreSQL + API)
- **Styling:** CSS with responsive design and custom scrollbar
- **Icons & Fonts:** Google Fonts, Emojis

---

## 🖼️ UI Overview

The app features:
- A **form** to submit new expenses
- A **filter** panel to select specific trips or categories
- A **list** of expenses with actionable buttons (mark as paid, refunded, suspended)
- Voting system for interesting items

Each expense includes:
- Trip name, cost name, planned and actual amounts
- Date of payment, payer, and payee
- Category with color-coded tags
- Source link for reference

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/travel-cost-planner.git
cd travel-cost-planner
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up Supabase

- Go to [Supabase](https://supabase.com/) and create a new project
- Create a table named `facts` with fields matching the structure in the code (e.g., `name_of_trip`, `cost_name`, `planned_cost`, etc.)
- Replace the Supabase credentials in your `supabase.js` file with your project's API key and URL

```js
// supabase.js
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://your-project.supabase.co";
const supabaseKey = "your-anon-key";
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
```

### 4. Run the app

```bash
npm start
```

The app should open in your browser at `http://localhost:3000`.

---

## 🧠 Folder Structure

```
📦 root
 ┣ 📄 App.jsx            ← Main component
 ┣ 📄 style.css          ← Styling for the UI
 ┣ 📄 supabase.js        ← Supabase client config
 ┣ 📄 index.js           ← Entry point
 ┗ 📁 public/
    ┗ 📄 logo4.png        ← App logo
```

---

## 🗃️ Example Expense Data

```json
{
  "name_of_trip": "Trip to Spain",
  "cost_name": "Hotel Booking",
  "planned_cost": 2000,
  "actual_cost": 2200,
  "paid_by": "Joanna",
  "payer": "Tomasz",
  "category": "Accommodation",
  "refund_done": true,
  "is_paid": false,
  "suspended": false,
  "payment_date": "2025-03-25",
  "source": "https://example.com"
}
```

---

## 🧩 Categories

The app includes these predefined expense categories:

- Transport
- Accommodation
- Tickets
- Shopping
- Currency Exchange
- Food
- Tips
- Other

Each category is styled with a unique color for clarity.

---

## 📌 To-Do / Ideas

- [ ] Add authentication for multi-user collaboration
- [ ] Export data to CSV
- [ ] Summary dashboard with totals per trip
- [ ] Add offline mode or caching
- [ ] Implement dark/light mode toggle

---

## 📄 License

MIT License. Feel free to fork and customize this app for your own needs!

---

Let me know if you’d like the README with Polish translations or if you want me to generate a `supabase.sql` to create the schema!
