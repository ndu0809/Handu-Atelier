import {
    FaMoon,
    FaSun,
    FaEye,
} from "react-icons/fa";

import {
    useState,
} from "react";

import {
    useTheme,
} from "../../context/ThemeContext";


function ThemeToggle() {

    const {
        theme,
        changeTheme,
    } = useTheme();

    const [
        open,
        setOpen
    ] = useState(false);


    const themes = [

        {
            id: "dark",
            label: "Normal",
            description: "Mode Gelap",
            icon: FaMoon,
        },

        {
            id: "light",
            label: "Terang",
            description: "Mode Terang",
            icon: FaSun,
        },

        {
            id: "protanopia",
            label: "Protanopia",
            description: "Ramah buta merah",
            icon: FaEye,
        },

        {
            id: "deuteranopia",
            label: "Deuteranopia",
            description: "Ramah buta hijau",
            icon: FaEye,
        },

        {
            id: "tritanopia",
            label: "Tritanopia",
            description: "Ramah buta biru",
            icon: FaEye,
        },

    ];


    const currentTheme =
        themes.find(
            item =>
                item.id === theme
        ) || themes[0];


    return (

        <div className="relative">

            <button
                type="button"
                onClick={() =>
                    setOpen(
                        previous =>
                            !previous
                    )
                }
                aria-label="Pilih mode tampilan"
                aria-expanded={open}
                className="
                    w-10
                    h-10
                    rounded-full

                    border
                    border-theme-accent/30

                    bg-theme-surface

                    text-theme-accent

                    flex
                    items-center
                    justify-center

                    transition-all
                    duration-300

                    hover:border-theme-accent
                "
            >

                <currentTheme.icon />

            </button>


            {open && (

                <>

                    <button
                        type="button"
                        aria-label="Tutup pilihan tema"
                        onClick={() =>
                            setOpen(false)
                        }
                        className="
                            fixed
                            inset-0
                            z-40
                            cursor-default
                        "
                    />

                    <div
                        className="
                            absolute
                            right-0
                            top-12
                            z-50

                            w-72

                            rounded-2xl

                            bg-theme-panel

                            border
                            border-theme-border

                            shadow-2xl

                            p-2
                        "
                    >

                        <div
                            className="
                                px-3
                                py-3
                                border-b
                                border-theme-border
                                mb-2
                            "
                        >

                            <p
                                className="
                                    text-sm
                                    font-semibold
                                    text-theme-heading
                                "
                            >
                                Mode Tampilan
                            </p>

                            <p
                                className="
                                    text-xs
                                    text-theme-muted
                                    mt-1
                                "
                            >
                                Pilih tampilan yang
                                nyaman digunakan.
                            </p>

                        </div>


                        {themes.map(
                            (item) => {

                                const Icon =
                                    item.icon;

                                const active =
                                    theme ===
                                    item.id;

                                return (

                                    <button
                                        key={item.id}
                                        type="button"
                                        onClick={() => {

                                            changeTheme(
                                                item.id
                                            );

                                            setOpen(
                                                false
                                            );

                                        }}
                                        className={`
                                            w-full
                                            flex
                                            items-center
                                            gap-3

                                            px-3
                                            py-3

                                            rounded-xl

                                            text-left

                                            transition

                                            ${
                                                active
                                                    ? `
                                                        bg-theme-accent-soft
                                                        text-theme-accent
                                                      `
                                                    : `
                                                        text-theme-text
                                                        hover:bg-theme-surface
                                                      `
                                            }
                                        `}
                                    >

                                        <div
                                            className="
                                                w-9
                                                h-9
                                                rounded-lg

                                                bg-theme-surface

                                                flex
                                                items-center
                                                justify-center

                                                shrink-0
                                            "
                                        >

                                            <Icon />

                                        </div>


                                        <div
                                            className="
                                                flex-1
                                            "
                                        >

                                            <p
                                                className="
                                                    text-sm
                                                    font-medium
                                                "
                                            >
                                                {item.label}
                                            </p>

                                            <p
                                                className="
                                                    text-[11px]
                                                    text-theme-muted
                                                    mt-0.5
                                                "
                                            >
                                                {
                                                    item.description
                                                }
                                            </p>

                                        </div>


                                        {active && (

                                            <span
                                                className="
                                                    text-theme-accent
                                                    text-sm
                                                "
                                            >
                                                ✓
                                            </span>

                                        )}

                                    </button>

                                );

                            }
                        )}

                    </div>

                </>

            )}

        </div>

    );
}

export default ThemeToggle;