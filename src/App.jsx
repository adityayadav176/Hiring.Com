import { useLocation } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes.jsx"
function App() {
  const location = useLocation();
  console.log("Current URL:", window.location.href);
  console.log("APP CURRENT PATH:", location.pathname);
  return <AppRoutes/>;
}

export default App
