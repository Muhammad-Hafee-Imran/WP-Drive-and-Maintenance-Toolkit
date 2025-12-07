import { useState, useCallback } from "@wordpress/element";
import { __ } from "@wordpress/i18n";

export default function useNotice(timeout = 5000) {
    const [notice, setNotice] = useState({ message: "", type: "" });

    const showNotice = useCallback((message, type = "success") => {
        setNotice({ message, type });
        setTimeout(() => setNotice({ message: "", type: "" }), timeout);
    }, [timeout]);

    return [notice, showNotice];
}
