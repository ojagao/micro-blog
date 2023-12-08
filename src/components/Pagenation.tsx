import Link from "next/link";
import styles from "../../src/styles/Pagenation.module.css"

const Pagenation = ({ totalCount }: { totalCount: number }) => {
    const PER_PAGE = 7;

    const range = (start :number, end: number) => [...Array(end - start + 1)].map((_, i) => start + i);

    return (
        <ul className={styles.pagenation}>
            {range(1, Math.ceil(totalCount / PER_PAGE)).map((number, index) => (
                <li key={index}>
                    <Link className={styles.pagenation_number} href={`/blog/page/${number}`}>{number}</Link>
                </li>
            ))}
        </ul>
    );
};

export default Pagenation;
