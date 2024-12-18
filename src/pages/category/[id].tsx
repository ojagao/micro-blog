import Link from "next/link";
import { client } from "../../libs/client";
import { Blogs, Categories, Context, Tags } from "@/types/type";
import Header from "@/components/header";
import styles from "../../../src/styles/category.module.css";
import Rightbar from "@/components/Rightbar";
import Footer from "@/components/Footer";
import { useEffect, useState } from "react";
import Image from "next/image";
import * as Icon from "react-feather";
import Pagenation from "@/components/Pagenation";

export default function CategoryId({ blogs, totalCount, category, tag }: { blogs: Blogs[]; totalCount: number; category: Categories[]; tag: Tags[] }) {

    const [contentHeight, setContentHeight] = useState(0);

    useEffect(() => {
        const contentH = document.getElementById("__next")?.clientHeight;
        setContentHeight(contentH || 0);
    }, []);

    return (
        <>
            <Header category={category} />
            <div className={styles.contents_inner}>
                <article className={styles.contents_main}>
                    {blogs ? <p className={styles.article_list}>{blogs[0]?.category.name ?? ""}の記事の一覧</p> : <p className={styles.article_list}>記事の一覧</p>}
                    <ul>
                        {blogs?.map((blog) => (
                            <Link href={`/blog/${blog.id}`} key={blog.id}>
                                <li className={styles.article_card}>
                                    <Image className={styles.thumbnail} src={blog.eyecatch.url} alt="サムネイル" width={300} height={150} priority />
                                    <div className={styles.article_card_right}>
                                        <h3 className={styles.article_title}>{blog.title}</h3>
                                        <div className={`${styles.flex_center} ${styles.mt_12} ${styles.sp_colum}`}>
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
                                            <time className={styles.date}>{blog.updatedAt.slice(0, 10).replace(/-/g, "/")}</time>
                                        </div>
                                    </div>
                                </li>
                            </Link>
                        )
                        ) ?? <div className={styles.article_card}>対象カテゴリーのコンテンツがありません</div>
                        }
                    </ul>
                    <Pagenation totalCount={totalCount} />
                </article>
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
    const data = await client.get({ endpoint: "categories" });

    const paths = data.contents.map((content: Categories) => `/category/${content.id}`);
    return { paths, fallback: false };
};

// データをテンプレートに受け渡す部分の処理を記述します
export const getStaticProps = async (context: Context) => {
    const id = context.params.id;
    const data = await client.get({ endpoint: "blogs", queries: { filters: `category[equals]${id}` } });
    // カテゴリーコンテンツの取得
    const categoryData = await client.get({ endpoint: "categories" });
    // タグコンテンツの取得
    const tagData = await client.get({ endpoint: "tag" });

    return {
        props: {
            blogs: data.contents.length > 0 ? data.contents : null,
            totalCount: data.totalCount,
            category: categoryData.contents,
            tag: tagData.contents,
        },
    };
};
