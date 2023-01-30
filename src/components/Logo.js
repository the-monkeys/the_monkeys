import { Link } from "react-router-dom"
import monkey from '../images/logo-1.jpg'

export default function Logo () {
    return(
        <div>
            <Link className='logo text-lightBlack flex items-center pt-2 w-40' to="/">
                <img className="" src={monkey} alt="The Monkeys" />
            </Link>
        </div>
    )
}