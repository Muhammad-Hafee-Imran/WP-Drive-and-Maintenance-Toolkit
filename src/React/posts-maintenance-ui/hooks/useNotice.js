import { useState } from "@wordpress/element";

export default function useNotice() {
    const [notice, setNotice] = useState({ type: "", message: "" });

    const showNotice = (type, message) => {
        setNotice({ type, message });
    };

    const clearNotice = () => {
        setNotice({ type: "", message: "" });
    };

    return {
        notice,
        showNotice,
        clearNotice,
    };
}
