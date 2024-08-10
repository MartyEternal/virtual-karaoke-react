import { Link } from "react-router-dom";


export default function Main() {
    return (
        <div>
            <h1>Main Page</h1>
            <Link to="/authpage">Log in</Link>
        </div>
    )
}