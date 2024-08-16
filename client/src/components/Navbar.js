import React from 'react';

export default function Navbar() {
    const scrollToComponent = (id) => {
        document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <nav className='nav'>
            <a href='/' className='siteTitle'>ZY GPA Dashboard</a>
            <ul>
                <li onClick={() => scrollToComponent('semesterly-data-table')}>Top Semester GPAs</li>
                <li onClick={() => scrollToComponent('cumulative-data-table')}>Top Cumulative GPAs</li>
                <li onClick={() => scrollToComponent('line-chart')}>Historical GPAs</li>
                <li onClick={() => scrollToComponent('bar-chart')}>Semester Bar Charts</li>
                <li onClick={() => scrollToComponent('file-upload')}>File Upload</li>
            </ul>
        </nav>
    );
}

