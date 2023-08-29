import React from "react";
import styles from "../../src/styles/Footer.module.css";
import Link from "next/link";

const Footer = () => {
    return (
        <footer>
            <div className={styles.footer_inner}>
                <div className={styles.footer_title}>
                    <p>
                        AI <br />
                        Web <br />
                        Programing
                    </p>
                </div>
                <nav className={styles.footer_nav}>
                    <ul className={styles.flex_center}>
                        <li>
                            <Link className={styles.footer_link} href="/">お問い合わせ</Link>
                        </li>
                        <li>
                            <Link className={styles.footer_link} href="/">カテゴリー</Link>
                        </li>
                        <li>
                            <Link className={styles.footer_link} href="/">プライバシーポリシー</Link>
                        </li>
                        <li>
                            <Link className={styles.footer_link} href="/">利用規約</Link>
                        </li>
                    </ul>
                </nav>
            </div>
            <p className={styles.copyright}>Copyright © AI Web Programing All rights reserved.</p>
        </footer>
    );
};

export default Footer;
