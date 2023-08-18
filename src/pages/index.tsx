import Head from "next/head";
import { Inter } from "next/font/google";
import Header from "@/components/header";
import TopBody from "@/components/TopBody";
import { client } from "../libs/client";

const inter = Inter({ subsets: ["latin"] });

interface Blogs {
    id: string;
    title: string;
    content: string;
    eyecatch: { url: string };
    category: { name: string };
    tag: { name: string }[];
    publishedAt: string;
}

export default function Home({ blogs }: { blogs: Blogs[] }) {
    console.log(blogs);
    return (
        <>
            <Head>
                <title>AIとWebの探求</title>
                <meta name="description" content="他の方々の助けになれば嬉しいなという想いでAIを触ったりプログラミングをしたり、Web系エンジニアを目指す中で気づいたことを共有します" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                {/* 決まっていないアイコン */}
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Header />
            <TopBody blogs={blogs} />
        </>
    );
}

export async function getStaticProps() {
    const data = await client.get({ endpoint: "blogs" });

    return {
        props: {
            blogs: data.contents,
        },
    };
}
