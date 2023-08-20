import Link from 'next/link';

const Header = ({ currentUser }) => {
    const links = [
        !currentUser && { label: 'Sign Up', href: '/auth/signup' },
        !currentUser && { label: 'Sign In', href: '/auth/signin' },
        currentUser && { label: 'Sell Tickets', href: '/tickets/new'},
        currentUser && { label: 'My Orders', href: '/orders'},
        currentUser && { label: 'Sign Out', href: '/auth/signout'}
    ].filter(linkConfig => linkConfig) //filtering any entries that are false
    .map(({ label, href}) => {
        //create link inside next js use link and anchor
        return <li key={href} className='nav-item'>
            <Link className='nav-link' href={href}>
                {label}
            </Link>
        </li>;
    });
 
    return <nav className="navbar navbar-light bg-light">
        <Link className='navbar-brand' href="/">
            Landing to me
        </Link>

        <div className='d-flex justify-content-end'>
            <ul className='nav d-flex align-items-center'>
                { links }
            </ul>
        </div>
    </nav>
}

export default Header;