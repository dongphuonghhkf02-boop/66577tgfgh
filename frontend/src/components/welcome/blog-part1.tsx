import React from "react";
import { useState } from "react";
import CardBlog1 from "./card-blog1";
import styles from "./blog-part1.module.css";

export type BlogPart1Type = {
  className?: string;
};

const BlogPart1: React.FC<BlogPart1Type> = ({ className = "" }) => {
  const [cardBlog1Items] = useState([
    {
      device: "Default" as const,
      imageContainer: "/Image-Container@2x.png",
      showRole: false,
      showDate: false,
      showButton: true,
      showTag: false,
      device1: "Default" as const,
      prop: "Читати більше",
      showLabel: true,
      primaryButtonJustifyContent: "flex-end" as const,
      iconContainerBackgroundColor: "#1b4332" as const,
      size: 16,
      showFire: true,
    },
    {
      device: "Default" as const,
      imageContainer: "/Image-Container@2x.png",
      showRole: false,
      showDate: false,
      showButton: true,
      showTag: false,
      device1: "Default" as const,
      prop: "Читати більше",
      showLabel: true,
      primaryButtonJustifyContent: undefined,
      iconContainerBackgroundColor: undefined,
      size: 16,
      showFire: true,
    },
    {
      device: "Default" as const,
      imageContainer: "/Image-Container@2x.png",
      showRole: false,
      showDate: false,
      showButton: true,
      showTag: false,
      device1: "Default" as const,
      prop: "Читати більше",
      showLabel: true,
      primaryButtonJustifyContent: undefined,
      iconContainerBackgroundColor: undefined,
      size: 16,
      showFire: true,
    },
  ]);
  return (
    <section className={[styles.blogPart, className].join(" ")}>
      <div className={styles.blogSection}>
        <h2 className={styles.h2}>
          <span className={styles.span}>БЛОГ</span>
          <span className={styles.span2}>
            <span className={styles.span3}>{` `}</span>
            <span className={styles.span4}>АГРОНОМА</span>
          </span>
        </h2>
        <div className={styles.cardsGroup}>
          {cardBlog1Items.map((item, index) => (
            <CardBlog1
              key={index}
              device={item.device}
              imageContainer={item.imageContainer}
              showRole={item.showRole}
              showDate={item.showDate}
              showButton={item.showButton}
              showTag={item.showTag}
              device1={item.device1}
              prop={item.prop}
              showLabel={item.showLabel}
              primaryButtonJustifyContent={item.primaryButtonJustifyContent}
              iconContainerBackgroundColor={item.iconContainerBackgroundColor}
              size={item.size}
              showFire={item.showFire}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogPart1;
