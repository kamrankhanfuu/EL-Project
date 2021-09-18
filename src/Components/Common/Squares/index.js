import React from "react";
const Squares = (props) => {
    return (
        <>
            {(props.data)
                    ?
                    <div>
                        <div className="square square-2" style={{ transform: props.data }} />
                        <div className="square square-3" style={{ transform: props.data }} />
                        <div className="square square-4" style={{ transform: props.data }} />
                        <div className="square square-6" style={{ transform: props.data }} />
                    </div>
                    : 
                    <div>
                        <div className="squares square1" />
                        <div className="squares square2" />
                        <div className="squares square3" />
                        <div className="squares square4" />
                        <div className="squares square5" />
                        <div className="squares square6" />
                        <div className="page-header-image" />
                    </div>
            }
        </>
    )
}
export default Squares;