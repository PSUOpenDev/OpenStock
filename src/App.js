import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Container, Navbar } from "react-bootstrap";
import HomePage from "./pages/HomePage";
import "./App.scss";
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
