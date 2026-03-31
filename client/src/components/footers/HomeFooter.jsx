import '../../css/footer/HomeFooter.css' 
import React from 'react'
function HomeFooter() {
    const [toggle, setToggle] = React.useState(1)
    const updateToggle = (index) => {
        setToggle(index)
    }
    return (
        <div className="top-footer">
                <h2 className="heading">Inspirational Getaways</h2>
                <div className='tabs'>
                    <ul className="tab-links">
                        <li className={toggle === 1 ? "tab-link-item active" : "tab-link-item"} onClick={()=> updateToggle(1)}>Popular</li>
                        <li className={toggle === 2 ? "tab-link-item active" : "tab-link-item"} onClick={()=> updateToggle(2)}>Arts and crafts</li>
                        <li className={toggle === 3 ? "tab-link-item active" : "tab-link-item"} onClick={()=> updateToggle(3)}>Beach</li>
                        <li className={toggle === 4 ? "tab-link-item active" : "tab-link-item"} onClick={()=> updateToggle(4)}>Mountains</li>
                        <li className={toggle === 5 ? "tab-link-item active" : "tab-link-item"} onClick={()=> updateToggle(5)}>Outdoors</li>
                        <li className={toggle === 6 ? "tab-link-item active" : "tab-link-item"} onClick={()=> updateToggle(6)}>Things to do</li>
                    </ul>
                </div>
                <div className={toggle === 1 ?"tab-content show" :"tab-content"}>
                        <ul>
                            <li><a className="link" href="/popular"><span className="subheading">Galvestan</span>Hotel Rentings</a></li>
                            <li><a className="link" href="/popular"><span className="subheading">Galvestan</span>Hotel Rentings</a></li>
                            <li><a className="link" href="/popular"><span className="subheading">Galvestan</span>Hotel Rentings</a></li>
                            <li><a className="link" href="/popular"><span className="subheading">Galvestan</span>Hotel Rentings</a></li>
                            <li><a className="link" href="/popular"><span className="subheading">Galvestan</span>Hotel Rentings</a></li>
                            <li><a className="link" href="/popular"><span className="subheading">Galvestan</span>Hotel Rentings</a></li>
                            <li><a className="link" href="/popular"><span className="subheading">Galvestan</span>Hotel Rentings</a></li>
                            <li><a className="link" href="/popular"><span className="subheading">Galvestan</span>Hotel Rentings</a></li>
                            <li><a className="link" href="/popular"><span className="subheading">Galvestan</span>Hotel Rentings</a></li>
                            <li><a className="link" href="/popular"><span className="subheading">Galvestan</span>Hotel Rentings</a></li>
                            <li><a className="link" href="/popular"><span className="subheading">Galvestan</span>Hotel Rentings</a></li>
                            <li><a className="link" href="/popular"><span className="subheading">Galvestan</span>Hotel Rentings</a></li>
                        </ul>
                </div>
                <div className={toggle === 2 ?"tab-content show" :"tab-content"}>
                        <ul>
                            <li><a className="link" href="/popular"><span className="subheading">Galvestan</span>Hotel Rentings</a></li>
                            <li><a className="link" href="/popular"><span className="subheading">Galvestan</span>Hotel Rentings</a></li>
                            <li><a className="link" href="/popular"><span className="subheading">Galvestan</span>Hotel Rentings</a></li>
                            <li><a className="link" href="/popular"><span className="subheading">Galvestan</span>Hotel Rentings</a></li>
                            <li><a className="link" href="/popular"><span className="subheading">Galvestan</span>Hotel Rentings</a></li>
                            <li><a className="link" href="/popular"><span className="subheading">Galvestan</span>Hotel Rentings</a></li>
                            <li><a className="link" href="/popular"><span className="subheading">Galvestan</span>Hotel Rentings</a></li>
                            <li><a className="link" href="/popular"><span className="subheading">Galvestan</span>Hotel Rentings</a></li>
                            <li><a className="link" href="/popular"><span className="subheading">Galvestan</span>Hotel Rentings</a></li>
                        </ul>
                </div>
                <div className={toggle === 3 ?"tab-content show" :"tab-content"}>
                        <ul>
                            <li><a className="link" href="/popular"><span className="subheading">Galvestan</span>Hotel Rentings</a></li>
                            <li><a className="link" href="/popular"><span className="subheading">Galvestan</span>Hotel Rentings</a></li>
                            <li><a className="link" href="/popular"><span className="subheading">Galvestan</span>Hotel Rentings</a></li>
                            <li><a className="link" href="/popular"><span className="subheading">Galvestan</span>Hotel Rentings</a></li>
                            <li><a className="link" href="/popular"><span className="subheading">Galvestan</span>Hotel Rentings</a></li>
                            <li><a className="link" href="/popular"><span className="subheading">Galvestan</span>Hotel Rentings</a></li>
                            <li><a className="link" href="/popular"><span className="subheading">Galvestan</span>Hotel Rentings</a></li>
                            <li><a className="link" href="/popular"><span className="subheading">Galvestan</span>Hotel Rentings</a></li>
                            <li><a className="link" href="/popular"><span className="subheading">Galvestan</span>Hotel Rentings</a></li>
                        </ul>
                </div>
                <div className={toggle === 4 ?"tab-content show" :"tab-content"}>
                        <ul>
                            <li><a className="link" href="/popular"><span className="subheading">Galvestan</span>Hotel Rentings</a></li>
                            <li><a className="link" href="/popular"><span className="subheading">Galvestan</span>Hotel Rentings</a></li>
                            <li><a className="link" href="/popular"><span className="subheading">Galvestan</span>Hotel Rentings</a></li>
                            <li><a className="link" href="/popular"><span className="subheading">Galvestan</span>Hotel Rentings</a></li>
                        </ul>
                </div>
                <div className={toggle === 5 ?"tab-content show" :"tab-content"}>
                        <ul>
                            <li><a className="link" href="/popular"><span className="subheading">Galvestan</span>Hotel Rentings</a></li>
                            <li><a className="link" href="/popular"><span className="subheading">Galvestan</span>Hotel Rentings</a></li>
                            <li><a className="link" href="/popular"><span className="subheading">Galvestan</span>Hotel Rentings</a></li>
                            <li><a className="link" href="/popular"><span className="subheading">Galvestan</span>Hotel Rentings</a></li>
                            <li><a className="link" href="/popular"><span className="subheading">GutanTag</span>Hotel Rentings</a></li>
                            <li><a className="link" href="/popular"><span className="subheading">Galvestan</span>Hotel Rentings</a></li>
                            <li><a className="link" href="/popular"><span className="subheading">Galvestan</span>Hotel Rentings</a></li>
                            <li><a className="link" href="/popular"><span className="subheading">Galvestan</span>Hotel Rentings</a></li>
                            <li><a className="link" href="/popular"><span className="subheading">Galvestan</span>Hotel Rentings</a></li>
                        </ul>
                </div>
                <div className={toggle === 6 ?"tab-content show" :"tab-content"}>
                        <ul>
                            <li><a className="link" href="/popular"><span className="subheading">Galvestan</span>Hotel Rentings</a></li>
                            <li><a className="link" href="/popular"><span className="subheading">Galvestan</span>Hotel Rentings</a></li>
                            <li><a className="link" href="/popular"><span className="subheading">Galvestan</span>Hotel Rentings</a></li>
                            <li><a className="link" href="/popular"><span className="subheading">Galvestan</span>Hotel Rentings</a></li>
                            <li><a className="link" href="/popular"><span className="subheading">Galvestan</span>Hotel Rentings</a></li>
                            <li><a className="link" href="/popular"><span className="subheading">Galvestan</span>Hotel Rentings</a></li>
                        </ul>
                </div>

            </div>
    )
}
export default HomeFooter