import React from "react";

const Icon = ({
    name,
    size = 20,
    strokeWidth = 1.8
}) => {
    const common = {
        width: size,
        height: size,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth,
        strokeLinecap: "round",
        strokeLinejoin: "round"
    };

    const icons = {
        dashboard: (
            <>
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="7" height="7" rx="1" />
            </>
        ),

        users: (
            <>
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </>
        ),

        user: (
            <>
                <circle cx="12" cy="8" r="4" />
                <path d="M4 21a8 8 0 0 1 16 0" />
            </>
        ),

        costume: (
            <>
                <path d="M8 4l4 3 4-3 4 3 2 7-4 2-1-4v8H7v-8l-1 4-4-2 2-7z" />
            </>
        ),

        category: (
            <>
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="7" height="7" rx="1" />
            </>
        ),

        calendar: (
            <>
                <rect x="3" y="4" width="18" height="17" rx="2" />
                <path d="M16 2v4M8 2v4M3 10h18" />
            </>
        ),

        clipboard: (
            <>
                <rect x="5" y="4" width="14" height="17" rx="2" />
                <path d="M9 4V2h6v2M9 10h6M9 14h6M9 18h3" />
            </>
        ),

        chart: (
            <>
                <path d="M4 19V5M4 19h17" />
                <path d="M7 15l4-5 3 3 5-7" />
            </>
        ),

        wallet: (
            <>
                <path d="M3 7a2 2 0 0 1 2-2h15v14H5a2 2 0 0 1-2-2z" />
                <path d="M3 7h17v4h-5a2 2 0 0 0 0 4h5" />
            </>
        ),

        star: (
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z" />
        ),

        search: (
            <>
                <circle cx="11" cy="11" r="7" />
                <path d="M20 20l-4-4" />
            </>
        ),

        plus: (
            <>
                <path d="M12 5v14M5 12h14" />
            </>
        ),

        edit: (
            <>
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L8 18l-4 1 1-4z" />
            </>
        ),

        trash: (
            <>
                <path d="M3 6h18" />
                <path d="M8 6V4h8v2" />
                <path d="M19 6l-1 15H6L5 6" />
                <path d="M10 11v6M14 11v6" />
            </>
        ),

        eye: (
            <>
                <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
                <circle cx="12" cy="12" r="3" />
            </>
        ),

        logout: (
            <>
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <path d="M16 17l5-5-5-5" />
                <path d="M21 12H9" />
            </>
        ),

        settings: (
            <>
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06-1.41 1.41-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V19.5h-2v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06-1.41-1.41.06-.06A1.65 1.65 0 0 0 9.6 15a1.65 1.65 0 0 0-1.51-1H8v-2h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06 1.41-1.41.06.06A1.65 1.65 0 0 0 12.5 8a1.65 1.65 0 0 0 1-1.51V6.4h2v.09A1.65 1.65 0 0 0 16.5 8a1.65 1.65 0 0 0 1.82-.33l.06-.06 1.41 1.41-.06.06A1.65 1.65 0 0 0 19.4 11a1.65 1.65 0 0 0 1.51 1H21v2h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </>
        ),

        bell: (
            <>
                <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
                <path d="M10 21h4" />
            </>
        ),

        menu: (
            <>
                <path d="M4 6h16M4 12h16M4 18h16" />
            </>
        ),

        arrow: (
            <>
                <path d="M5 12h14" />
                <path d="M13 6l6 6-6 6" />
            </>
        )
    };

    return (
        <svg {...common}>
            {icons[name] || icons.dashboard}
        </svg>
    );
};

export default Icon;