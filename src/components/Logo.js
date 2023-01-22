import { Link } from "react-router-dom"

export default function Logo () {
    return(
        <div className="text-4xl md:text-3xl font-bold font-dance">
            <Link className='text-lightBlack' to="/">The Monkeys'</Link>
        </div>
    )
}