import { Notice } from "@wordpress/components";
import { __ } from "@wordpress/i18n";

const NoticeMessage = ({ notice }) =>
    notice.message ? (
        <Notice status={notice.type} isDismissible={false}>
            {__(notice.message, "wpmudev-plugin-test")}
        </Notice>
    ) : null;

export default NoticeMessage;
