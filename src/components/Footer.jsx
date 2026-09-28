export default function Footer() {
    return (
        <footer className="border-t border-line py-10 text-center text-sm text-subtle">
            <div className="mx-auto max-w-6xl px-4 sm:px-6">
                <nav className="flex justify-center gap-6 font-medium text-muted">
                    <a href="#" className="hover:text-fg">Privacy Policy</a>
                    <a href="#" className="hover:text-fg">Terms &amp; Conditions</a>
                </nav>
                <p className="mx-auto mt-4 max-w-xl">
                    ClashGen is unofficial and is not endorsed by or affiliated with Supercell. Clash of Clans is a trademark of Supercell.
                    See{' '}
                    <a className="underline hover:text-fg" href="https://supercell.com/en/fan-content-policy/en/" target="_blank" rel="noreferrer">
                        Supercell's Fan Content Policy
                    </a>.
                </p>
                <p className="mt-2">© 2026 ClashGen</p>
            </div>
        </footer>
    )
}