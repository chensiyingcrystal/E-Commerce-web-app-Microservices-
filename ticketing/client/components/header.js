import Link from 'next/link';

const Header = ({ currentUser }) => {
    const links = [
        !currentUser && { label: 'Sign Up', href: '/auth/signup' },
        !currentUser && { label: 'Sign In', href: '/auth/signin' },
        currentUser && { label: 'Sign Out', href: '/auth/signout'}
    ].filter(linkConfig => linkConfig) //filtering any entries that are false
    .map(({ label, href}) => {
        //create link inside next js use link and anchor
        return <li key={href} className='nav-item'>
            <Link href={href} legacyBehavior>
                <a className='nav-link'>
                    {label}
                </a>
            </Link>
        </li>;
    });
 
    return <nav className="navbar navbar-light bg-light">
        <Link href="/" legacyBehavior>
            <a className='navbar-brand'>Landing to me</a>
        </Link>

        <div className='d-flex justify-content-end'>
            <ul className='nav d-flex align-items-center'>
                { links }
            </ul>
        </div>
    </nav>
}

export default Header;