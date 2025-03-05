
const device = {
    mobile: 'mobile',
    tablet: 'tablet',
    desktop: 'desktop',
};
const theme = {
    light: 'light',
    dark: 'dark',
};


const getTheme = () => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? theme.dark : theme.light

}

const style = {
    // Configuración base
    settings: {
        // device: getBreakpoint(),
        theme: getTheme(),
    },

    // Paleta base de colores
    baseColors: {
        primary: {
            //base
            black: "#192531",
            gray: "#787878",
            white: "#FAFAFA",
            blue: "#00D3FF",
            green: "#00FF99",
            //text
            grayText: "#C4C7CA",

        },
        secondary: {
            100: '#E6FFF5',
            500: '#00FF99',
            900: '#00995C',
        },
        neutral: {
            100: '#FAFAFA',
            200: '#E4E8EB',
            300: '#C1C7CC',
            900: '#192531',
        },
        semantic: {
            error: '#FF4444',
            warning: '#FFBB33',
            success: '#00C851',
            info: '#33B5E5',
        },

    },

    // Sistema de temas
    themes: {
        light: {
            colors: {
                background: 'baseColors.neutral.100',
                surface: 'baseColors.neutral.200',
                text: 'baseColors.neutral.900',
                primary: 'baseColors.primary.500',
                secondary: 'baseColors.secondary.500',
                error: 'baseColors.semantic.error',
            },
        },
        dark: {
            colors: {
                background: 'baseColors.neutral.900',
                surface: 'baseColors.neutral.700',
                text: 'baseColors.neutral.100',
                primary: 'baseColors.secondary.500',
                secondary: 'baseColors.primary.500',
                error: 'baseColors.semantic.error',
            },
        },
    },

    // Tipografía escalable
    typography: {
        scale: {
            ratio: 1.333,
            baseSize: '16px',
        },
        fonts: {
            primary: "'Inter', sans-serif",
            secondary: "'Roboto Mono', monospace",
        },
        variants: {
            h1: {
                sizes: {
                    mobile: 'calc(1rem * var(--scale-ratio) * 2)',
                    desktop: 'calc(1rem * var(--scale-ratio) * 2.5)',
                },
                weight: 700,
                lineHeight: 1.2,
            },
            body: {
                sizes: {
                    mobile: '1rem',
                    desktop: '1.1rem',
                },
                weight: 400,
                lineHeight: 1.6,
            },
        },
    },

    // Sistema espacial responsivo
    spacing: {
        scale: '1rem',
        multipliers: [0, 0.5, 1, 2, 3, 4, 5],
        breakpoints: {
            sm: '576px',
            md: '768px',
            lg: '992px',
            xl: '1200px',
        },
    },

    // Componentes comunes
    components: {
        button: {
            borderRadius: '0.5rem',
            padding: '0.75rem 1.5rem',
            variants: ['filled', 'outline', 'ghost'],
        },
        card: {
            padding: '2rem',
            borderRadius: '1rem',
            shadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        },
    },

    // Utilidades
    utils: {
        transitions: {
            fast: '0.15s',
            normal: '0.3s',
            slow: '0.5s',
        },
        zIndex: {
            modal: 1000,
            dropdown: 500,
            header: 100,
        },
    },
};


export default style