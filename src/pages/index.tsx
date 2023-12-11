import Head from "next/head";
import Header from "@/components/header";
import TopBody from "@/components/TopBody";
import { client } from "../libs/client";
import { Blogs, Categories, Tags } from "@/types/type";
import styles from "../../src/styles/index.module.css";
import Rightbar from "@/components/Rightbar";
import Footer from "@/components/Footer";
import { useEffect, useState } from "react";

export default function Home({ blog, category, tag, totalCount }: { blog: Blogs[]; category: Categories[]; tag: Tags[]; totalCount: number }) {
    const [contentHeight, setContentHeight] = useState(0);

    useEffect(() => {
        const contentH = document.getElementById("__next")?.clientHeight;
        setContentHeight(contentH || 0);
    }, []);
    return (
        <>
            <Head>
                <title>AI・Web・Programingを学ぼう</title>
                <meta name="description" content="他の方々の助けになれば嬉しいなという想いでAIを触ったりプログラミングをしたり、Web系エンジニアを目指す中で気づいたことを共有します" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                {/* 決まっていないアイコン */}
                <link rel="icon" href="/images/AI.png" />
            </Head>
            <Header />
            <div className={styles.contents_inner}>
                <TopBody blogs={blog}  totalCount={totalCount} />
                <aside className={styles.side_bar}>
                    <Rightbar category={category} tag={tag} contentHeight={contentHeight} />
                </aside>
            </div>
            <Footer />
        </>
    );
}

export const getStaticProps = async () => {
    const data = await client.get({ endpoint: "blogs", queries: { offset: 0, limit: 6 } });
    // カテゴリーコンテンツの取得
    const categoryData = await client.get({ endpoint: "categories" });
    // タグコンテンツの取得
    const tagData = await client.get({ endpoint: "tag" });

    return {
        props: {
            blog: data.contents,
            category: categoryData.contents,
            tag: tagData.contents,
            totalCount: data.totalCount,
        },
    };
};
