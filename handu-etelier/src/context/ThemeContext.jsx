import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";


const ThemeContext =
    createContext(null);


export function ThemeProvider({
    children
}) {

    const getDeviceTheme = () => {

        if (
            typeof window === "undefined"
        ) {
            return "light";
        }

        return window.matchMedia(
            "(prefers-color-scheme: dark)"
        ).matches
            ? "dark"
            : "light";
    };


    const [
        theme,
        setTheme
    ] = useState(
        getDeviceTheme
    );


    useEffect(() => {

        const mediaQuery =
            window.matchMedia(
                "(prefers-color-scheme: dark)"
            );


        const updateTheme =
            (event) => {

                setTheme(
                    event.matches
                        ? "dark"
                        : "light"
                );

            };


        // Terapkan saat pertama kali
        setTheme(
            mediaQuery.matches
                ? "dark"
                : "light"
        );


        // Dengarkan perubahan
        // Dark/Light perangkat
        mediaQuery.addEventListener(
            "change",
            updateTheme
        );


        return () => {

            mediaQuery.removeEventListener(
                "change",
                updateTheme
            );

        };

    }, []);


    useEffect(() => {

        const root =
            document.documentElement;

        root.setAttribute(
            "data-theme",
            theme
        );

    }, [
        theme
    ]);


    return (

        <ThemeContext.Provider
            value={{
                theme
            }}
        >
            {children}
        </ThemeContext.Provider>

    );
}


export function useTheme() {

    return useContext(
        ThemeContext
    );

}