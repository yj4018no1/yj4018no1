import React from 'react';
import { ZHome0 } from "./ZHome0";
import { ZHome1 } from "./ZHome1";
import { ZHome2 } from "./ZHome2";

export const ZHomeIndex = (props) => {

    return (
        <div className="homeindex"  >
            <div className="content content-index01">
                <ZHome0 />
                <ZHome1 />
                <ZHome2 />
            </div>
        </div>
    )
}