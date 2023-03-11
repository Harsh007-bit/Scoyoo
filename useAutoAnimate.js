import autoAnimate from "@formkit/auto-animate";
import { useRef, useEffect } from "react";

export default function useAutoAnimate() {
    const parent = useRef(null);
    useEffect(() => {
        parent.current && autoAnimate(parent.current, { duration: 150 });
    }, [parent]);
    return parent;
}