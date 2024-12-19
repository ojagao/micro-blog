import { useEffect, useRef, useState, Suspense, useCallback } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { useRouter } from "next/router";
import { client } from "../libs/client";
import Header from "../components/header";
import { Blogs } from "@/types/type";
import styles from "../../src/styles/random-article.module.css";
import Image from "next/image";
import html2canvas from 'html2canvas';
import ReactDOM from 'react-dom';

interface Article extends Blogs {}

const Card = ({ position, blog, onClick }: { position: [number, number, number]; blog: Blogs; onClick: () => void }) => {
  const meshRef = useRef<THREE.Mesh | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isContentVisible, setIsContentVisible] = useState(false);
  const { gl } = useThree();

  useFrame(() => {
    if (meshRef.current) {
      const cardPosition = new THREE.Vector3(...position);
      const toCenter = new THREE.Vector3();
      toCenter.copy(cardPosition);
      toCenter.negate();
      toCenter.y = 0;
      toCenter.normalize();
      const angle = Math.atan2(toCenter.x, toCenter.z) + Math.PI;
      meshRef.current.rotation.y = angle;
    }
  });

  const handleCardClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsRevealed(true);
    // カバーのアニメーション後にコンテンツを表示
    setTimeout(() => {
      setIsContentVisible(true);
    }, 500);
    // 遷移の処理を遅らせる
    setTimeout(() => {
      onClick();
    }, 1000);
  };

  return (
    <mesh ref={meshRef} position={position}>
      <planeGeometry args={[1.5, 2.5]} />
      <meshPhysicalMaterial
        color="white"
        roughness={0.1}
        metalness={0}
        clearcoat={1}
        clearcoatRoughness={0.1}
        side={THREE.DoubleSide}
      />
      <Html
        transform
        scale={[0.15, 0.15, 0.15]}
        rotation={[0, 0, 0]}
        position={[0, 0, 0.01]}
        distanceFactor={10}
        zIndexRange={[20, 0]}
        center
        occlude
        prepend
      >
        <div
          className={styles.article_card}
          data-article-id={blog.id}
          onClick={handleCardClick}
        >
          <div className={`${styles.card_content} ${isContentVisible ? styles.revealed : ''}`}>
            {blog.eyecatch && (
              <div className={styles.image_container}>
                <Image
                  src={blog.eyecatch.url}
                  alt={blog.title}
                  width={400}
                  height={200}
                  style={{
                    objectFit: 'cover',
                    borderRadius: '8px',
                    width: '100%',
                    height: 'auto',
                  }}
                  quality={95}
                  priority
                  className={styles.thumbnail}
                />
              </div>
            )}
            <h3 className={styles.article_title}>{blog.title}</h3>
            <p id="article" className={styles.article_content} dangerouslySetInnerHTML={{ __html: blog.content }} />
          </div>
          <div className={`${styles.card_cover} ${isRevealed ? styles.hidden : ''}`}>
            <div className={styles.cover_content}>
              <span className={styles.question_mark}>?</span>
              <p className={styles.cover_text}>Click to Reveal</p>
            </div>
          </div>
        </div>
      </Html>
    </mesh>
  );
};

const Scene = ({ blogs }: { blogs: Blogs[] }) => {
  const router = useRouter();
  const groupRef = useRef<THREE.Group | null>(null);
  const { camera } = useThree();
  const [targetRotation, setTargetRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [previousX, setPreviousX] = useState(0);
  const [isMoving, setIsMoving] = useState(false);
  const startTimeRef = useRef(0);
  const lastMoveTime = useRef(Date.now());
  const isAutoRotating = useRef(false);

  useEffect(() => {
    camera.position.z = 12;
  }, [camera]);

  const normalizeAngle = (angle: number) => {
    let normalized = angle % (Math.PI * 2);
    if (normalized > Math.PI) {
      normalized -= Math.PI * 2;
    } else if (normalized < -Math.PI) {
      normalized += Math.PI * 2;
    }
    return normalized;
  };

  const getShortestRotation = (current: number, target: number) => {
    const diff = normalizeAngle(target - current);
    if (diff > Math.PI) {
      return diff - Math.PI * 2;
    } else if (diff < -Math.PI) {
      return diff + Math.PI * 2;
    }
    return diff;
  };

  const getNearestCardIndex = () => {
    if (!groupRef.current) return 0;

    const currentRotation = normalizeAngle(groupRef.current.rotation.y);
    const cardCount = blogs.length;
    const anglePerCard = (Math.PI * 2) / cardCount;

    let nearestIndex = Math.round(-currentRotation / anglePerCard);

    while (nearestIndex < 0) {
      nearestIndex += cardCount;
    }
    nearestIndex = nearestIndex % cardCount;

    return nearestIndex;
  };

  const alignToNearestCard = () => {
    if (isAutoRotating.current || isDragging) return;

    const nearestIndex = getNearestCardIndex();
    const anglePerCard = (Math.PI * 2) / blogs.length;
    const targetAngle = normalizeAngle(-nearestIndex * anglePerCard);
    const currentRotation = normalizeAngle(groupRef.current?.rotation.y || 0);

    const shortestRotation = getShortestRotation(currentRotation, targetAngle);
    setTargetRotation(currentRotation + shortestRotation);
    isAutoRotating.current = true;
  };

  useFrame(() => {
    if (groupRef.current) {
      const currentRotation = normalizeAngle(groupRef.current.rotation.y);
      const normalizedTarget = normalizeAngle(targetRotation);
      const rotationDiff = getShortestRotation(currentRotation, normalizedTarget);

      if (Math.abs(rotationDiff) > 0.001) {
        const speed = isDragging ? 0.05 : 0.1;
        groupRef.current.rotation.y += rotationDiff * speed;
        lastMoveTime.current = Date.now();
        setIsMoving(true);
      } else {
        setIsMoving(false);
        isAutoRotating.current = false;

        if (!isDragging && Date.now() - lastMoveTime.current > 300) {
          alignToNearestCard();
        }
      }
    }
  });

  const getEventX = (event: MouseEvent | TouchEvent): number => {
    if ("touches" in event) {
      return event.touches[0]?.clientX || 0;
    }
    return (event as MouseEvent).clientX;
  };

  const handleStart = (event: MouseEvent | TouchEvent) => {
    setIsDragging(true);
    setPreviousX(getEventX(event));
    startTimeRef.current = Date.now();
    setIsMoving(false);
    isAutoRotating.current = false;
  };

  const handleMove = (event: MouseEvent | TouchEvent) => {
    if (isDragging) {
      const currentX = getEventX(event);
      const deltaX = currentX - previousX;
      setTargetRotation(targetRotation + deltaX * 0.005);
      setPreviousX(currentX);
      setIsMoving(true);
      lastMoveTime.current = Date.now();
    }
  };

  const handleEnd = (event: MouseEvent | TouchEvent) => {
    const timeDiff = Date.now() - startTimeRef.current;
    setIsDragging(false);
    lastMoveTime.current = Date.now();

    if (!isMoving && timeDiff < 200) {
      const clientX = getEventX(event);
      const elements = document.elementsFromPoint(clientX, event.clientY || 0);
      const cardElement = elements.find((el) => el.closest(".article_card"));
      if (cardElement) {
        const cardDiv = cardElement.closest(".article_card") as HTMLElement;
        const articleId = cardDiv?.dataset.articleId;
        if (articleId) {
          router.push(`/blog/${articleId}`);
        }
      }
    }
  };

  useEffect(() => {
    const canvas = document.querySelector("canvas");
    if (!canvas) return;

    canvas.addEventListener("mousedown", handleStart);
    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleEnd);

    canvas.addEventListener("touchstart", handleStart, { passive: true });
    window.addEventListener("touchmove", handleMove, { passive: true });
    window.addEventListener("touchend", handleEnd);

    return () => {
      canvas.removeEventListener("mousedown", handleStart);
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleEnd);

      canvas.removeEventListener("touchstart", handleStart);
      window.removeEventListener("touchmove", handleMove);
      window.removeEventListener("touchend", handleEnd);
    };
  }, [isDragging, previousX, targetRotation, isMoving]);

  const center = new THREE.Vector3(0, 0, 0);

  return (
    <group ref={groupRef} position={center}>
      {blogs.map((blog, index) => {
        const angle = (index / blogs.length) * Math.PI * 2;
        const radius = 7;
        const x = Math.sin(angle) * radius;
        const z = Math.cos(angle) * radius;

        return <Card key={blog.id} position={[x, 0, z]} blog={blog} onClick={() => router.push(`/blog/${blog.id}`)} />;
      })}
    </group>
  );
};

const RandomArticle = ({ blogs, categories }: { blogs: Blogs[]; categories: any[] }) => {
  const [dpr, setDpr] = useState(1);

  useEffect(() => {
    setDpr(window.devicePixelRatio || 1);
  }, []);

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Header category={categories} />
      <Canvas
        camera={{ position: [0, 0, 8], fov: 80 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
          precision: "highp",
          stencil: false,
          depth: true,
          logarithmicDepthBuffer: true,
        }}
        dpr={dpr}
        linear
        flat
        style={{
          width: "100%",
          height: "calc(100% - 60px)",
          background: "rgb(250, 250, 250)",
        }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <Suspense fallback={null}>
          <Scene blogs={blogs} />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default RandomArticle;

export const getStaticProps = async () => {
  const [blogsData, categoriesData] = await Promise.all([client.get({ endpoint: "blogs" }), client.get({ endpoint: "categories" })]);

  const shuffledBlogs = [...blogsData.contents].sort(() => Math.random() - 0.5).slice(0, 10);

  return {
    props: {
      blogs: shuffledBlogs,
      categories: categoriesData.contents,
    },
    revalidate: 60,
  };
};
