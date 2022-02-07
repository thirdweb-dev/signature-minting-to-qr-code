import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import AddNewContract from "./components/contracts/AddNewContract";
import ContractList from "./components/contracts/ContractList";
import AddNewForm from "./components/forms/AddNewForm";
import FormList from "./components/forms/FormList";
import Layout from "./components/Layout";
import ContractsPage from "./routes/contracts";
import FormsPage from "./routes/forms";
import HomePage from "./routes/home";
import QrCodesPages from "./routes/qrCodes";

const App = () => (
  <Router>
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/contracts" element={<ContractsPage />}>
          <Route path="" element={<ContractList />} />
          <Route path="new" element={<AddNewContract />} />
        </Route>

        <Route path="/forms" element={<FormsPage />}>
          <Route path="" element={<FormList />} />
          <Route path="new" element={<AddNewForm />} />
        </Route>

        <Route path="/qr-codes" element={<QrCodesPages />}>
          <Route path="" element={<FormList />} />
        </Route>

        <Route
          path="*"
          element={
            <main style={{ padding: "1rem" }}>
              <p>There's nothing here!</p>
            </main>
          }
        />
      </Routes>
    </Layout>
  </Router>
);

export default App;
