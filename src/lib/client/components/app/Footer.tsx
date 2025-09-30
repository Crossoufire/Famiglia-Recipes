export const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="w-full p-5 border-t border-t-neutral-500/20 bg-background mt-20">
            <div className="text-center">
                © 2023-{currentYear} - Famiglia-Recipes
            </div>
        </footer>
    );
}
