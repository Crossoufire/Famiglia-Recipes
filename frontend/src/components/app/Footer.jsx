import {Separator} from "@/components/ui/separator";


export const Footer = () => (
    <footer className="w-full p-2 border-t border-t-neutral-500 bg-cyan-950/30 mt-20">
        <div className="grid md:grid-cols-12 mx-auto gap-4 md:max-w-screen-xl text-center md:text-left">
            <div className="md:col-span-6 flex flex-col gap-y-1">
                <div className="text-xl flex gap-x-2 font-bold items-center justify-center md:justify-start">
                    <img src="/favicon.ico" width={16} alt="favicon"/> Famiglia Recipes
                </div>
                <p className="md:w-[85%]">
                    Welcome to Familgia Recipes and explore our curated collection of cherished family recipes.
                </p>
            </div>
            <div className="md:col-span-3 flex flex-col gap-y-1">
                <div className="font-bold text-xl">Powered by</div>
                <ul>
                    <li><a href="https://flask.palletsprojects.com/" className="text-light" rel="noreferrer"
                           target="_blank">Flask</a></li>
                    <li><a href="https://reactjs.org/" className="text-light" rel="noreferrer" target="_blank">React</a>
                    </li>
                </ul>
            </div>
            <div className="md:col-span-3 flex flex-col gap-y-1">
                <div className="font-bold text-xl">Information</div>
                <ul>
                    <li><a href="https://github.com/Crossoufire/FamigliaRecipes" className="text-light" rel="noreferrer"
                           target="_blank">Github</a></li>
                </ul>
            </div>
        </div>
        <Separator className="mt-3 mb-2"/>
        <div className="text-center">
            © 2024 Copyright: Crossoufire
        </div>
    </footer>
);
