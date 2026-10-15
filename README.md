# Perform Data Operations in React Data Grid using Fetch API
A quick-start project that shows how to perform server-side data operations in the Syncfusion React Data Grid using the Fetch API. This project contains the code to integrate the Data Grid with an Express.js backend, process paging, sorting, filtering, and searching on the server, and handle data requests through the dataStateChange event. 

## Key Features

- **Express.js Server ↔ SQL Server**: Robust TypeScript backend with type-safe database operations
- **Syncfusion React Grid**: Built-in search, filter, sort, and paging capabilities
- **Complete CRUD Operations**: Add, edit, delete, and update records directly from the grid

## Prerequisites

  - Node.js: LTS version (v20.x or later)

  - npm/yarn: For package management.

  - React: For creating and serving the React client application
  
## Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   ```

2. **Run the application**

**Run the Express.js server**

```bash
   cd server
   npm install
   npm run build
   npm start
```

**Run the React client**

```bash
  cd client
  npm install
  npm run dev
```

3. **Open the application**

   The server runs at http://localhost:3000
   Navigate to the React application in your browser (typically `http://localhost:5173`).

## Configuration

**Security Note**: For production environments, store sensitive credentials using:

- Environment variables

- Secure storage solutions (e.g., Azure Key Vault, AWS Secrets Manager)

## Project Layout

| File/Folder | Purpose |
|-------------|---------|
| `server/src/routes/patients.routes.ts` | Server-side route handling grid data operations |
| `server/src/controllers/patients.controller.ts` | Controller logic for data operations |
| `server/src/utils/data.ts` | Entity model containing the patient data |
| `server/src/types/interface.ts` | TypeScript interfaces and types |
| `client/src/components/PatientsGrid.tsx` | Grid component with dataStateChange |
| `client/src/services/customDataService.ts` | Custom data service for API calls and data operations |
| `client/src/types/interface.ts` | TypeScript interfaces for client-side types |
| `CUSTOM_DATA_BINDING.md` | Detailed documentation of the custom data binding implementation |

## Common Tasks

### Search Records
1. Use the **Search** box in the toolbar
2. Enter keywords to filter records (searches across all columns)

### Filter Records
1. Use the **Filter** box in the toolbar
2. Enter keywords to filter records (Filters data in each columns)

### Sort Records
1. Click the column header to sort ascending
2. Click again to sort descending

## Reference
For detailed information, refer to the [Syncfusion React Grid documentation](https://ej2.syncfusion.com/react/documentation/grid/getting-started).