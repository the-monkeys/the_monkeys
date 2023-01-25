import { Link } from "react-router-dom"
import monkey from '../images/monkey.png'

export default function Logo () {
    return(
        <div>
            <Link className='logo text-lightBlack flex items-center text-2xl space-x-2 text-bold' to="/">
                <img className="w-[32px] h-[32px]" src={monkey} alt="The Monkeys" />
                <span className="mt-2">|</span>
                <span className="mt-4">The Monkeys</span>
            </Link>
        </div>
    )
}