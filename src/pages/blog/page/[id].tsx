// pages/blog/page/[id].js
import Link from "next/link";
import { client } from "../../../libs/client";
import { Blogs, Categories, Tags } from "@/types/type";
import Image from "next/image";
import * as Icon from "react-feather";
import styles from "../../../../src/styles/TopBody.module.css";
import style from "../../../../src/styles/index.module.css";
import Header from "@/components/header";
import Pagenation from "@/components/Pagenation";
import Footer from "@/components/Footer";
import Rightbar from "@/components/Rightbar";
import { useEffect, useState } from "react";

interface Context {
    params: {
        id: number;
    };
}

const PER_PAGE = 5;

// pages/blog/[id].js
export default function BlogPageId({ blog, category, tag, totalCount }: { blog: Blogs[]; category: Categories[]; tag: Tags[]; totalCount: number }) {
    const [contentHeight, setContentHeight] = useState(0);

    useEffect(() => {
        const contentH = document.getElementById("__next")?.clientHeight;
        setContentHeight(contentH || 0);
    }, []);
    return (
        <div>
            <Header />
            <div className={style.contents_inner}>
                <article className={styles.contents_main}>
                    <p className={styles.article_list}>記事の一覧</p>
                    <ul>
                        {blog.map((blog) => (
                            <Link href={`/blog/${blog.id}`} key={blog.id}>
                                <li className={styles.article_card}>
                                    <Image className={styles.thumbnail} src={blog.eyecatch.url} alt="サムネイル" width={300} height={150} priority />
                                    <div className={styles.article_card_right}>
                                        <h3 className={styles.article_title}>{blog.title}</h3>
                                        <div className={`${styles.flex_center} ${styles.mt_12}`}>
                                            <span className={styles.category}>{blog.category.name}</span>
                                            <span className={styles.flex_center}>
                                                {blog.tag.map((tagItem) => (
                                                    <div className={`${styles.tag} ${styles.flex_center}`} key={tagItem.tag}>
                                                        <Icon.Tag />
                                                        <p>{tagItem.tag}</p>
                                                    </div>
                                                ))}
                                            </span>
                                        </div>
                                        <div className={`${styles.flex_center} ${styles.mt_12}`}>
                                            <Icon.Clock />
                                            <time className={styles.date}>{blog.publishedAt.slice(0, 10).replace(/-/g, "/")}</time>
                                        </div>
                                    </div>
                                </li>
                            </Link>
                        ))}
                    </ul>

                    <Pagenation totalCount={totalCount} />
                </article>
                <aside className={styles.side_bar}>
                    <Rightbar category={category} tag={tag} contentHeight={contentHeight} />
                </aside>
            </div>
            <Footer />
        </div>
    );
}

// 動的なページを作成
export const getStaticPaths = async () => {
    const repos = await client.get({ endpoint: "blogs" });

    const range = (start: number, end: number) => [...Array(end - start + 1)].map((_, i) => start + i);

    const paths = range(1, Math.ceil(repos.totalCount / PER_PAGE)).map((repo) => `/blog/page/${repo}`);

    return { paths, fallback: false };
};

// データを取得
export const getStaticProps = async (context: Context) => {
    const id = context.params.id;

    const data = await client.get({ endpoint: "blogs", queries: { offset: (id - 1) * 5, limit: 5 } });

    const categoryData = await client.get({ endpoint: "categories" });

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
