# SoluLabs Payments Gateway

A mock Payment Gateway built with Next.js App Router and TypeScript that simulates real-world payment processing flows including retries, timeouts, transaction persistence, and idempotency handling.

---

## Features

### Payment Form
- Cardholder name input
- Card number formatting (`4242 4242 4242 4242`)
- Expiry date validation (`MM/YY`)
- CVV validation
- Amount input with currency selector (`INR`, `USD`)
- Real-time validation with field-level errors
- Submit button disabled until form is valid

---

### Card Detection
- Detects:
  - Visa
  - Mastercard
  - American Express
- Dynamic card badge rendering
- CVV length changes based on card type

---

### Live Card Preview
- Updates in real time while typing
- Displays:
  - Cardholder name
  - Formatted card number
  - Expiry date

---

### Payment Lifecycle
Supports complete payment states:
- Idle
- Processing
- Success
- Failed
- Timeout

---

### Mock Payment Gateway (`/api/pay`)
Server-side randomized responses:
| Outcome | Probability |
|---|---|
| Success | ~60% |
| Failed | ~25% |
| Timeout | ~15% |

Timeout responses simulate delayed network conditions using an 8-second response delay.

---

### Timeout Handling
Frontend request cancellation using:
- `AbortController`
- 6-second client timeout

---

### Retry Logic
- Maximum 3 attempts per transaction
- Retry counter shown to user
- Retry disabled after max attempts
- Same transaction ID reused across retries

---

### Transaction History
- Persistent transaction history using `localStorage`
- Displays:
  - Transaction ID
  - Amount
  - Status
  - Timestamp
- Clickable transaction detail view

---

### Idempotency
Transactions use:
```ts
crypto.randomUUID()
```

The same transaction ID is reused for retries to avoid duplicate transaction entries.

---

## Tech Stack

- Next.js 15 (App Router)
- TypeScript
- Zustand
- Tailwind CSS
- React Hooks
- AbortController API

---

## Folder Structure

```bash
src/
├── app/
│   ├── api/
│   │   └── pay/
│   └── page.tsx
│
├── components/
│   ├── CardInput.tsx
│   ├── CardPreview.tsx
│   ├── PaymentForm.tsx
│   ├── StatusScreen.tsx
│   └── TransactionHistory.tsx
│
├── hooks/
│   └── usePayment.ts
│
├── store/
│   └── paymentStore.ts
│
├── utils/
│   ├── formatters.ts
│   ├── validators.ts
│   └── cardUtils.ts
│
├── types/
│   └── payment.ts
```

---

## State Management

This project uses Zustand for global state management.

Global state includes:
- Payment status
- Transaction history
- Shared payment lifecycle state

Local component state is used for:
- Form values
- Input focus state
- Field-level validation UI

---

## Getting Started

### 1. Clone the repository

```bash
git clone <your-repository-url>
```

### 2. Navigate into the project

```bash
cd SoluLabs-Payments-Gateway
```

### 3. Install dependencies

```bash
npm install
```

### 4. Start development server

```bash
npm run dev
```

### 5. Open in browser

```bash
http://localhost:3000
```

---

## Validation Rules

### Card Number
- Auto-formatted with spaces
- Validates supported card types

### Expiry Date
- Must follow `MM/YY`
- Rejects expired dates

### CVV
- 3 digits for Visa/Mastercard
- 4 digits for American Express

### Amount
- Must be greater than 0

---

## Accessibility

Implemented accessibility considerations:
- Visible labels for all inputs
- `aria-describedby` for validation errors
- Keyboard-friendly navigation
- Responsive layouts
- Proper focus handling after payment transitions

---

## Error Handling

The application distinguishes between:
- API failures
- Network failures
- Client-side timeouts

Friendly messages are shown instead of raw errors.

---

## Assumptions Made

- Transactions are stored only on the frontend using `localStorage`
- No real payment processing occurs
- Mock gateway behavior is randomized intentionally
- Retry attempts are scoped per transaction ID

---

## Key Real-World Payment UX Considerations Implemented

- Preventing double submissions
- Request timeout handling
- Idempotent retries
- Persistent transaction tracking
- Clear processing feedback
- Retry attempt limitation

---

## Scripts

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Start Production Server

```bash
npm run start
```

### Lint

```bash
npm run lint
```

---

## Author

Gulam Mohammad Ali

---

## License

MIT