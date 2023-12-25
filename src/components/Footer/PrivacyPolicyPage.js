import React from 'react';
import { Link } from 'react-router-dom';
import "./FooterComponent.css";

const PrivacyPolicyPage = () => {
    return (
        <div className='footer-component-container'>
            <div className='footer-component-container-in'>
                <div className='text-center m-14'>
                    <h1>Privacy Policy for The Monkeys</h1>
                </div>
                <div className='m-8'>
                    <h2>Introduction</h2>
                    <p>At The Monkeys, we are committed to protecting your privacy. This Privacy Policy outlines the types of information we collect, how we use it, and the measures we take to safeguard it.</p>
                </div>

                <div className='m-8 '>
                    <h2>Information We Collect</h2>
                    <p>We collect information to provide better services to our users. This can be information that you provide to us directly, such as your name and email address when you create an account or leave a comment, and information we get from your use of our services, like the device and browser you're using.</p>
                </div>
                <div className='m-8'>
                    <h2>How We Use Information</h2>
                    <p>We use the information we collect to provide, maintain, and improve our services, and to develop new ones. We also use this information to offer you tailored content, such as giving you more relevant search results and articles.</p>
                </div>
                <div className='m-8'>
                    <h2>Information We Share</h2>
                    <p>We do not share personal information with companies, organizations, or individuals outside of The Monkeys unless one of the following circumstances applies:</p>
                    <ul className='list-disc ml-12'>
                        <li>With your consent</li>
                        <li>For legal reasons</li>
                    </ul>
                </div>
                <div className='m-8'>
                    <h2>Security</h2>
                    <p>We work hard to protect The Monkeys and our users from unauthorized access to or unauthorized alteration, disclosure, or destruction of information we hold.</p>
                </div>
                <div className='m-8'>
                    <h2>Changes</h2>
                    <p>Our Privacy Policy may change from time to time. We will post any privacy policy changes on this page.</p>
                </div>
                <div className='m-8'>
                    <h2>Contact Us</h2>
                    <p>If you have any questions about this Privacy Policy, please <Link to="#" className='underline cursor-pointer'>contact us.</Link></p>
                </div>
            </div>
        </div>
    );
}

export default PrivacyPolicyPage;
