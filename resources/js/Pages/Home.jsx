import React from 'react';
import Navbar from "../Layouts/Navbar";
import Sidebar from "../Layouts/Sidebar";

function Home() {
    return (
        <div className="flex">
            <Sidebar>
                <div>
                    Home content goes here.
                </div>
            </Sidebar>
        </div>
    );
}

Home.layout = page => (
    <>
        <Navbar />
        {page}
    </>
);

export default Home;