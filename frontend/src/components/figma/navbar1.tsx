import React from "react";
import { type CSSProperties } from "react";
import { Link } from "react-router-dom";
import Search1 from "./search1";
import User1 from "./user1";
import Cart1 from "./cart1";
import PrimaryButton1 from "./primary-button1";
import styles from "./navbar1.module.css";

export type Navbar1Type = {
  className?: string;
  size?: any;
  size1?: any;
  size2?: any;

  /** Variant props */
  device?: any;
  state?: any;
};

const Navbar1: React.FC<Navbar1Type> = ({
  className = "",
  device = "Desktop",
  state = "Default",
  size = 20,
  size1 = 20,
  size2 = 24,
}) => {
  return (
    <header
      className={[styles.navbar, className].join(" ")}
      data-device={device}
      data-state={state}
    >
      <div className={styles.mainContent}>
        <div className={styles.leftContant}>
          <Link to="/" aria-label="На головну" style={{ display: "inline-flex", textDecoration: "none" }}>
            <img
              className={styles.logoIcon}
              loading="lazy"
              width={116}
              height={82}
              alt="Торговий дім ТАМІС АГРО"
              src="/logo@2x.png"
              style={{ cursor: "pointer" }}
            />
          </Link>
          <nav className={styles.link}>
            <div className={styles.div}>Каталог</div>
            <div className={styles.div2}>Культури</div>
            <div className={styles.div3}>Про нас</div>
            <div className={styles.div4}>Контакти</div>
          </nav>
        </div>
        <div className={styles.rightContent}>
          <div className={styles.iconButton}>
            <div className={styles.iconButtons}>
              <Search1 size={size} />
            </div>
            <div className={styles.iconButtons2}>
              <User1 size={size1} />
            </div>
            <div className={styles.iconButtons3}>
              <Cart1 size={16} />
            </div>
          </div>
          <PrimaryButton1
            state="Default"
            type="Filled"
            prop="Замовити дзвінок"
            showCall
            size="24"
          />
        </div>
      </div>
    </header>
  );
};

export default Navbar1;
