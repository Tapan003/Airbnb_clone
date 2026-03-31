import Navbar from "./components/Navbar.jsx"
import {Outlet, useLocation} from 'react-router-dom'
import Footer from "./components/Footer.jsx"
import './css/Layout.css'

function Layout() {
    const location = useLocation();
    // const noNav = ['/ListingsPage']
    // const showNav = !noNav.includes(location.pathname)
    const HideNav = location.pathname.startsWith('/listing')

    return (
        <>
            <div className="layout">
                {/* {showNav && <Navbar /> } */}
                {!HideNav && <Navbar /> }
                <main>
                    <Outlet />
                </main>
                <Footer/>
            </div>
        </>
    )
}

export default Layout