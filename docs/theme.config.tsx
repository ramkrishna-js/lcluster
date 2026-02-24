import { useRouter } from 'next/router'

export default {
    logo: <img src="/logo.svg" style={{ height: 28 }} />,
    project: {
        link: 'https://github.com/yourname/lcluster',
    },
    docsRepositoryBase: 'https://github.com/yourname/lcluster/tree/main/docs',
    useNextSeoProps() {
        return {
            titleTemplate: '%s — lcluster'
        }
    },
    head: (
        <>
            <link rel="icon" href="/favicon.ico" />
        </>
    ),
    primaryHue: 150,  // green hue matching neon theme
    footer: {
        text: (
            <span>
                lcluster · Built by <strong>Ram Krishna</strong> with the help of{' '}
                <strong>Claude (Anthropic AI)</strong> · MIT License
            </span>
        )
    },
    sidebar: {
        defaultMenuCollapseLevel: 1,
        toggleButton: true,
    },
    navigation: true,
    darkMode: true,
    nextThemes: {
        defaultTheme: 'dark',
    },
}
