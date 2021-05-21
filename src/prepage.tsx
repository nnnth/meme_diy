import React from 'react'
import  './prepage.css'
function prepage() {
    return (
        <header className="header">
            <div className="brand-box">
                <span className="brand">Example Brand</span>
            </div>

            <div className="text-box">
                <h1 className="heading-primary">
                    <span className="heading-primary-main">Heading Primary Main</span>
                    <span className="heading-primary-sub">The secondary heading</span>
                </h1>
                <a href="#" className="btn btn-white btn-animated">Discover our tours</a>
            </div>
        </header>
    )
}