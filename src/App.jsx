import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Explore from "./pages/Explore";
import Author from "./pages/Author";
import ItemDetails from "./pages/ItemDetails";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import AuthorItems from "./components/author/AuthorItems";

function App() {
  return (
    <Router>
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/author/:authorId" element={<Author />} />
        <Route path="/author/:authorId/items" element={<AuthorItems />} />
        <Route path="/item-details/:itemId" element={<ItemDetails />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;