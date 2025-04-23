import {TabName} from "@/components/core/tabs";
import {HomeTab} from "@/components/pages/home";

export default async function Home({searchParams}: { searchParams: Promise<{ tab: TabName }> }) {
    const { tab } = await searchParams;

    return (
        <div className={"w-full h-full"}>
            <Content tab={tab}/>
        </div>
    );
}

const Content = ({tab}:{tab:TabName}) => {
    switch (tab){
        case "home.html":
            return <HomeTab/>
        default:
            return <>Oops! You have fallen into the abyss. Please try again later.</>
    }
}