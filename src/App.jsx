import { useState } from "react";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import Preloader from "./components/common/Preloader";

const App = () => {
  const [loading, setLoading] = useState(true);

  return (
    <>
      {/* Preloader should be outside BrowserRouter for better control */}
      {loading && <Preloader onFinish={() => setLoading(false)} />}
      
      <BrowserRouter>
        {!loading && <AppRoutes />}
      </BrowserRouter>
    </>
  );
};

export default App;