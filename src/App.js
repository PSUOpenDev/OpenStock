import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Container, Navbar } from "react-bootstrap";
import HomePage from "./pages/HomePage";
<<<<<<< HEAD
import './App.scss';
=======
import "./App.scss";
import "./index.css"


>>>>>>> 8e57c22a4d1d4dcb2e6756e06d9a3260bc3ec152
function App() {
    return (
        <>
            <BrowserRouter>
                <Container>
                    <Navbar>
                        <Navbar.Brand href="/"></Navbar.Brand>
                    </Navbar>
                </Container>
                <Routes>
                    <Route path="/" element={<HomePage />}></Route>
                </Routes>
            </BrowserRouter>
        </>
    );
}

export default App;
