import { Spinner } from "react-bootstrap";
import "bootstrap"

const Loader = () => {
    return (<>
        <div className="">
            <Spinner
                animation="border"
                role="status"
                style={{
                    width: "75px",
                    height: "75px",
                    display: "block",
                    margin: "auto"

                }}
            ></Spinner>
        </div>

    </>)
}

export default Loader;