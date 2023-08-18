import Image from "next/image";
import styles from "../../src/styles/header.module.css";
import { useState } from "react";
import Link from "next/link";

const Header = () => {
    const hoverOpenClass = styles.hover_open;

    return (
        <header>
            <nav className={styles.nav_bar}>
                <Link className={styles.icon_box} href="/">
                    <Image src="/images/AI.png" alt="icon" width={50} height={50} />
                    <h1 className={styles.h1}>AI & Web</h1>
                </Link>
                <ul className={styles.link_list}>
                    <li className={styles.header_hover}>
                        <Link href="/" className={styles.header_link}>
                            カテゴリー
                        </Link>
                        <div className={hoverOpenClass}>
                            <ul>
                                <li>
                                    <Link className={styles.header_link} href="/">
                                        HTML
                                    </Link>
                                </li>
                                <li>
                                    <Link className={styles.header_link} href="/">
                                        CSS
                                    </Link>
                                </li>
                                <li>
                                    <Link className={styles.header_link} href="/">
                                        JavaScript
                                    </Link>
                                </li>
                                <li>
                                    <Link className={styles.header_link} href="/">
                                        TypeScript
                                    </Link>
                                </li>
                                <li>
                                    <Link className={styles.header_link} href="/">
                                        Next.js
                                    </Link>
                                </li>
                                <li>
                                    <Link className={styles.header_link} href="/">
                                        React
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </li>
                    <li>
                        <Link className={styles.header_link} href="/">
                            記事一覧
                        </Link>
                    </li>
                    <li>
                        <Link className={styles.header_link} href="/">
                            お問い合わせ
                        </Link>
                    </li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;
