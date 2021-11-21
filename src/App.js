import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Container, Navbar } from "react-bootstrap";
import HomePage from "./pages/HomePage";

function App() {
    return (
        <BrowserRouter>
            <Container>
                <Navbar>
                    <Container>
                        <Navbar.Brand href="/"></Navbar.Brand>
                    </Container>
                </Navbar>
            </Container>
            <Routes>
                <Route path="/" element={<HomePage />}></Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
