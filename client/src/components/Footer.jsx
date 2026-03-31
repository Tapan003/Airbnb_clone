import '../css/Footer.css'
import images from '../assets/images'

function Footer(){
    return (
        <div className="footer">
            <div className="bottom-footer">
                <footer >
                    <div className="footer-content">
                        <section className="footer-section">
                            <h4>Support</h4>
                            <ul className="footer-links">
                                <li><a href="/help">Help Center</a></li>
                                <li><a href="/">Get help with a safety issue</a></li>
                                <li><a href="/help">AirCover</a></li>
                                <li><a href="/help">Anti-discrimination</a></li>
                                <li><a href="/help">Disability support</a></li>
                                <li><a href="/help">Cancellation options</a></li>
                                <li><a href="/help">Report neibourhood concern</a></li>
                            </ul>
                        </section>
                        <section className="footer-section">
                            <h4>Hosting</h4>
                            <ul className="footer-links">
                                <li><a href="/help">Airbnb your Home</a></li>
                                <li><a href="/help">Airbnb your experience</a></li>
                                <li><a href="/help">Airbnb your service</a></li>
                                <li><a href="/help">AirCover for Hosts</a></li>
                                <li><a href="/help">Hosting resources</a></li>
                                <li><a href="/help">Community forum</a></li>
                                <li><a href="/help">Hosting responsibly</a></li>
                                <li><a href='/help'>Join a free hosting class</a></li>
                                <li><a href="/help">Find a co-host</a></li>
                                <li><a href="/help">Refer a host</a></li>
                            </ul>
                        </section>
                        <section className="footer-section">
                            <h4>Airbnb</h4>
                            <ul className="footer-links">
                                <li><a href="/news">2025 Summer Release</a></li>
                                <li><a href="/investors">Newsroom</a></li>
                                <li><a href="/help">Careers</a></li>
                                <li><a href="/help">Investors</a></li>
                                <li><a href="/careers">Airbnb.org emergency stays</a></li>
                            </ul>
                        </section>
                    </div>
                    <hr></hr>
                    <div>
                        <section className="footer-bottom-section">
                            <div className="footer-bottom-left">
                                 <p>© {new Date().getFullYear()} Airbnb, Inc.·<a href="/privacy">Privacy</a>·<a href="/terms">Terms</a>·<a href="/sitemap">Company details</a></p>
                            </div>
                            <div className="footer-bottom-right">
                                <div className="language-currency">
                                    <div className="footer-links">
                                        <button className="language-button"><a href="/language"><img src={images.globeIcon} alt="Language icon"></img>English (United States)</a></button>
                                        <button className="currency-button"><a href="/currency">₹ INR</a></button>
                                    </div>
                                </div>
                                <div className="social-links">
                                    <ul className="footer-links">
                                        <li><a href="/facebook"><img className="social-icon" src={images.facebookLogo} alt="Facebook icon"></img></a></li>
                                        <li><a href="/twitter"><img className="social-icon" src={images.twitterIcon} alt="Twitter icon"></img></a></li>
                                        <li><a href="/instagram"><img className="social-icon" src={images.instagramIcon} alt="Instagram icon"></img></a></li>
                                    </ul>
                                </div>
                            </div>
                        </section>
                    </div>
                </footer>

            </div>
        </div>
    )
}

export default Footer