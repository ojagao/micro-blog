import Header from "@/components/header";
import Head from "next/head";
import { client } from "../../libs/client";
import Image from "next/image";
import Rightbar from "@/components/Rightbar";
import styles from "../../../src/styles/blog.module.css";
import * as Icon from "react-feather";
import { Blogs, Categories, Tags } from "@/types/type";
import Footer from "@/components/Footer";
import { useEffect, useState } from "react";

interface Content {
    id: string;
}

interface Context {
    params: {
        id: string;
    };
}

export default function BlogId({ blogs, category, tag }: { blogs: Blogs; category: Categories[]; tag: Tags[] }) {
    const [contentHeight, setContentHeight] = useState(0);

    useEffect(() => {
        const contentH = document.getElementById("__next")?.clientHeight;
        setContentHeight(contentH || 0);
    }, []);
    return (
        <>
            <Head>
                <title>{blogs.title}</title>
                <meta name="description" content="他の方々の助けになれば嬉しいなという想いでAIを触ったりプログラミングをしたり、Web系エンジニアを目指す中で気づいたことを共有します" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                {/* 決まっていないアイコン */}
                <link rel="icon" href="/images/AI.png" />
            </Head>
            <Header category={category} />
            <div className={styles.contents_inner}>
                <main className={styles.contents_main}>
                    <Image className={styles.thumbnail} src={blogs.eyecatch.url} width={820} height={410} alt="サムネイルの画像" />
                    <div className={styles.article_inner}>
                        <h2 className={styles.article_title}>{blogs.title}</h2>
                        <div className={styles.flex_center}>
                            <time className={styles.date}>{blogs.publishedAt.slice(0, 10).replace(/-/g, "/")}</time>
                            <span className={styles.flex_center}>
                                {blogs.tag.map((tagItem) => (
                                    <div className={`${styles.tag} ${styles.flex_center}`} key={tagItem.tag}>
                                        <Icon.Tag />
                                        <p>{tagItem.tag}</p>
                                    </div>
                                ))}
                            </span>
                        </div>
                        <div id="article" className={styles.article_conetnt} dangerouslySetInnerHTML={{ __html: blogs.content }} />
                    </div>
                </main>
                <aside className={styles.side_bar}>
                    <Rightbar category={category} tag={tag} contentHeight={contentHeight} />
                </aside>
            </div>
            <Footer />
        </>
    );
}

// 静的生成のためのパスを指定します
export const getStaticPaths = async () => {
    const data = await client.get({ endpoint: "blogs" });

    const paths = data.contents.map((content: Content) => `/blog/${content.id}`);
    return { paths, fallback: false };
};

// データをテンプレートに受け渡す部分の処理を記述します
export const getStaticProps = async (context: Context) => {
    const id = context.params.id;
    const data = await client.get({ endpoint: "blogs", contentId: id });
    // カテゴリーコンテンツの取得
    const categoryData = await client.get({ endpoint: "categories" });
    // タグコンテンツの取得
    const tagData = await client.get({ endpoint: "tag" });

    return {
        props: {
            blogs: data,
            category: categoryData.contents,
            tag: tagData.contents,
        },
    };
};
