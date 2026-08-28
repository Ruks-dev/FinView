export const accounts = [
  {
    id: "summit-bank",
    bank: "Summit Bank",
    short: "SB",
    type: "Savings account",
    number: "2721",
    balance: 7560000,
    available: 7450000,
    tone: "wine",
  },
  {
    id: "gtbank",
    bank: "GTBank",
    short: "GT",
    type: "Savings account",
    number: "4821",
    balance: 1250000,
    available: 1245000,
    tone: "coral",
  },
  {
    id: "jaizbank",
    bank: "Jaiz Bank",
    short: "JB",
    type: "Savings account",
    number: "7332",
    balance: 875000,
    available: 860000,
    tone: "darkblue",
  },
  {
    id: "opay",
    bank: "Opay",
    short: "O",
    type: "Current account",
    number: "3792",
    balance: 5000,
    available: 5000,
    tone: "lemon",
  },
  {
    id: "access-bank",
    bank: "Access Bank",
    short: "AB",
    type: "Current account",
    number: "7392",
    balance: 875000,
    available: 860000,
    tone: "blue",
  },
  {
    id: "first-bank",
    bank: "First Bank",
    short: "FB",
    type: "Savings account",
    number: "1064",
    balance: 395000,
    available: 395000,
    tone: "purple",
  },
];

const transactionDate = (daysAgo) => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
};

export const transactions = [
  {
    date: transactionDate(4),
    daysAgo: 4,
    description: "Salary received",
    bank: "GTBank",
    category: "Income",
    amount: 300000,
    incoming: true,
    status: "Completed",
  },
  {
    date: transactionDate(5),
    daysAgo: 5,
    description: "Grocery shopping",
    bank: "Access Bank",
    category: "Food",
    amount: 28500,
    incoming: false,
    status: "Completed",
  },
  {
    date: transactionDate(7),
    daysAgo: 7,
    description: "Internet subscription",
    bank: "First Bank",
    category: "Bills",
    amount: 18000,
    incoming: false,
    status: "Completed",
  },
  {
    date: transactionDate(9),
    daysAgo: 9,
    description: "Fuel station",
    bank: "GTBank",
    category: "Transport",
    amount: 22000,
    incoming: false,
    status: "Completed",
  },
  {
    date: transactionDate(11),
    daysAgo: 11,
    description: "Restaurant payment",
    bank: "Access Bank",
    category: "Food",
    amount: 12500,
    incoming: false,
    status: "Completed",
  },
  {
    date: transactionDate(11),
    daysAgo: 11,
    description: "Mall payment",
    bank: "SummitBank",
    category: "Outfit",
    amount: 110000,
    incoming: false,
    status: "Completed",
  },
];

export const currentTransactions = () =>
  transactions.map(({ daysAgo, ...transaction }) => ({
    ...transaction,
    date: transactionDate(daysAgo),
  }));

export const expenses = [
  { name: "Food", amount: 52500, share: 32, color: "coral" },
  { name: "Transport", amount: 41000, share: 25, color: "blue" },
  { name: "Bills", amount: 36000, share: 22, color: "yellow" },
  { name: "Shopping", amount: 21000, share: 13, color: "green" },
  { name: "Other", amount: 13000, share: 8, color: "purple" },
  { name: "Mall", amount: 110000, share: 10, color: "lime" },
];

export const availableBanks = [
  {
    bank: "Summit Bank",
    short: "SB",
    tone: "green",
    description: "Summit Bank Limited",
  },
  {
    bank: "GTBank",
    short: "GT",
    tone: "coral",
    description: "Guaranty Trust Bank",
  },
  {
    bank: "Jaiz Bank",
    short: "J",
    tone: "blue",
    descrption: "Jaiz Bank",
  },
  {
    bank: "Access Bank",
    short: "AB",
    tone: "blue",
    description: "Access Bank Nigeria",
  },
  {
    bank: "First Bank",
    short: "FB",
    tone: "purple",
    description: "First Bank of Nigeria",
  },
  {
    bank: "Kuda",
    short: "K",
    tone: "green",
    description: "Kuda Microfinance Bank",
  },
];

export const naira = (amount) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount);
