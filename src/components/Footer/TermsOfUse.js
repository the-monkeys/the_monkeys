import React from 'react';
import { Link } from 'react-router-dom';
//  bg-white text-black overflow-hidden lg:pl-44 lg:pr-48 flex justify-center
const TermsOfUse = () => {
    return (
        <div className='bg-white text-black overflow-hidden lg:pl-36 lg:pr-44 flex justify-center'>
            <div className='md:m-8'>
                <div className=' text-center m-14'>
                    <h1 className='text-4xl underline font-semibold mb-2'>Terms of Use</h1>
                </div>
                <div className='m-8'>
                    <h2 className='text-2xl font-semibold mb-2'>Acceptance of Terms</h2>
                    <p className='mb-5 text-md'>By using our website, you agree to the Terms of Use. If you do not agree to these terms, you should not use this site.</p>
                </div>

                <div className='m-8 '>
                    <h2 className='text-2xl font-semibold mb-2'>Use of Site</h2>
                    <p className='mb-5 text-md'>The Monkeys grants you a limited license to access and make personal use of this site. You may not download or modify it, or any portion of it, without express written consent from us.</p>
                </div>
                <div className='m-8'>
                    <h2 className='text-2xl font-semibold mb-2'>User Contributions</h2>
                    <p className='mb-5 text-md'>Users are responsible for any content they post on The Monkeys. We do not endorse any user-generated content and are not responsible or liable for any content posted by users.</p>
                </div>
                <div className='m-8'>
                    <h2 className='text-2xl font-semibold mb-2'>Copyright</h2>
                    <p className='mb-5 text-md'>All content on this site, including text, graphics, logos, and images, is the property of The Monkeys and is protected by copyright laws.</p>
                </div>
                <div className='m-8'>
                    <h2 className='text-2xl font-semibold mb-2'>Changes to Terms</h2>
                    <p className='mb-5 text-md'>We reserve the right to update or modify these Terms of Use at any time without prior notice.</p>
                </div>
                <div className='m-8'>
                    <h2 className='text-2xl font-semibold mb-2'>Contact Us</h2>
                    <p className='mb-5 text-md'>If you have any questions about these Terms of Use, please <Link to="#" className='underline cursor-pointer'>contact us.</Link></p>
                </div>
            </div>
        </div>
    );
}

export default TermsOfUse;
