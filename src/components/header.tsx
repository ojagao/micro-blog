import Image from "next/image";
import styles from "../../src/styles/header.module.css";
import { useState } from "react";
import Link from "next/link";
import { Categories } from "@/types/type";

const Header = ({ category }: { category: Categories[] }) => {
    const hoverOpenClass = styles.hover_open;

    return (
        <header>
            <nav className={styles.nav_bar}>
                <Link className={styles.icon_box} href="/">
                    <Image src="/images/AI.png" alt="icon" width={50} height={50} priority />
                    <h1 className={styles.h1}>AI・Web・Programingを学ぼう</h1>
                </Link>
                <ul className={styles.link_list}>
                    <li>
                        <Link className={styles.header_link} href="/">
                            記事一覧
                        </Link>
                    </li>
                    <li className={styles.header_hover}>
                        <Link href="/" className={styles.header_link}>
                            カテゴリー ∨
                        </Link>
                        <div className={hoverOpenClass}>
                            <ul>
                                {category.map((category) => (
                                    <li key={category.id}>
                                        <Link href={`/category/${category.id}`} className={styles.category_name}>{category.name}</Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;
