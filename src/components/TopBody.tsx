import React from "react";
import Link from "next/link";
import styles from "../../src/styles/TopBody.module.css";
import Rightbar from "./Rightbar";
import Image from "next/image";
import * as Icon from "react-feather";

interface Blogs {
    id: string;
    title: string;
    content: string;
    eyecatch: { url: string };
    category: { name: string };
    tag: { name: string }[];
    publishedAt: string;
}

const TopBody = ({ blogs }: { blogs: Blogs[] }) => {
    blogs.map((blog) => {
        console.log(blog);
    });

    return (
        <main>
            <div className={styles.contents_inner}>
                <article className={styles.contents_main}>
                    <p className={styles.article_list}>＊ 記事の一覧 ＊</p>
                    <ul>
                        {blogs.map((blog) => (
                            <Link href={`/blog/${blog.id}`} key={blog.id}>
                                <li className={styles.article_card}>
                                    <Image className={styles.thumbnail} src={blog.eyecatch.url} alt="サムネイル" width={300} height={150} />
                                    <div className={styles.article_card_right}>
                                        <h3 className={styles.article_title}>{blog.title}</h3>
                                        <div className={`${styles.flex_center} ${styles.mt_12}`}>
                                            <span className={styles.category}>{blog.category.name}</span>
                                            <span className={styles.flex_center}>
                                                {blog.tag.map((tagItem) => (
                                                    <div className={`${styles.tag} ${styles.flex_center}`} key={tagItem.name}>
                                                        <Icon.Tag />
                                                        <p>{tagItem.name}</p>
                                                    </div>
                                                ))}
                                            </span>
                                        </div>
                                        <div className={`${styles.flex_center} ${styles.mt_12}`}>
                                            <Icon.Clock />
                                            <time className={styles.date}>{blog.publishedAt.slice(0, 10).replace(/-/g, "/")}</time>
                                        </div>
                                    </div>
                                    {/* <div className="blog-content" dangerouslySetInnerHTML={{ __html: blog.content }} /> */}
                                </li>
                            </Link>
                        ))}
                    </ul>
                </article>
                <aside className={styles.side_bar}>
                    <Rightbar />
                </aside>
            </div>
        </main>
    );
};

export default TopBody;
