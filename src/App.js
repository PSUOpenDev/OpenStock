import "./App.scss";
import "./index.css";

import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Container, Navbar } from "react-bootstrap";

import HomePage from "./pages/HomePage";
import React from "react";

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
