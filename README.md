# Sanepid App

A web application for managing health and safety controls, documentation, and compliance reports for food service establishments.

## Features

- Controls management with status tracking
- Documentation repository with HACCP analysis
- Monthly reports with compliance tracking
- User management with different roles
- Responsive design for desktop and mobile devices

## Technology Stack

- **Frontend**: React, Tailwind CSS
- **State Management**: React Context API
- **Routing**: React Router
- **API Communication**: Axios
- **Form Handling**: Formik with Yup validation
- **UI Components**: Custom components and React Tabs
- **Notifications**: React Toastify

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn
- IntelliJ IDEA or WebStorm (for development in the IntelliJ environment)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/your-username/sanepid-app.git
cd sanepid-app
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Start the development server:

```bash
npm start
# or
yarn start
```

The application will be available at `http://localhost:3000`.

### Using IntelliJ IDEA

To run the project in IntelliJ IDEA:

1. Open IntelliJ IDEA
2. Select "Open" and navigate to the project folder
3. Wait for the IDE to index the files and recognize the project structure
4. Open the terminal in IntelliJ (View → Tool Windows → Terminal)
5. Run `npm install` to install dependencies
6. Create a Run Configuration:
    - Go to Run → Edit Configurations
    - Click the "+" button and select "npm"
    - Name it "Start Sanepid App"
    - Set "Command" to "start"
    - Click "Apply" and "OK"
7. Run the application using the green "Run" button or Run → Run 'Start Sanepid App'

## Mock Data Mode

The applicationng with mock data, which is useful for development and testing without a backend API:

### Mock Data Configuration

- Mock data mode is enabled by default (see `.env` file)
- You can toggle between mock data and real API in the configuration panel (gear icon at the bottom right)
- When using mock data, you can use the following demo login credentials:
    - Client User: john@example.com / password
    - Client Admin: jane@example.com / password
    - Sanepid User: robert@example.com / password

### Environment Variables

The application uses environment variables for configuration:

- `REACT_APP_API_URL`: The base URL for the backend API (default: http://localhost:8080/api)
- `REACT_APP_USE_MOCK_DATA`: Whether to use mock data instead of making real API calls (default: true)

You can change these in the `.env` file or through the configuration panel.

## Project Structure

```
sanepid-app/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── common/
│   │   ├── controls/
│   │   ├── documents/
│   │   ├── layout/
│   │   └── reports/
│   ├── contexts/
│   │   └── AuthContext.js
│   ├── hooks/
│   │   └── useAuth.js
│   ├── pages/
│   │   ├── ControlsPage/
│   │   ├── ControlsPage.js
│   │   ├── DocumentsPage.js
│   │   ├── HomePage.js
│   │   ├── LoginPage.js
│   │   ├── OnboardingPage.js
│   │   └── ReportsPage.js
│   ├── services/
│   │   ├── api.js
│   │   ├── authService.js
│   │   ├── controlsService.js
│   │   ├── documentsService.js
│   │   └── reportsService.js
│   ├── styles/
│   │   └── global.css
│   ├── mockData.js
│   ├── App.js
│   └── index.js
├── .env
├── package.json
├── README.md
└── tailwind.config.js
```

## Backend API Integration

When ready to connect to a real backend API:

1. Set `REACT_APP_USE_MOCK_DATA=false` in the `.env` file or through the configuration panel
2. Set `REACT_APP_API_URL` to your API's base URL
3. Ensure your backend API implements the required endpoints (see service files for expected endpoints)

## License

[MIT](LICENSE)