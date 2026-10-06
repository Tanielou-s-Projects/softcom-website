"use client"

import { useId, useState, type CSSProperties } from "react"
import styles from "./hero-prototype.module.css"

// Throwaway study: can Mistral's quiet type / changing colour field support
// Softcom's capsule? One approved direction, pending visual review.
export function HeroPrototype() {
  const [run, setRun] = useState(0)
  const [paused, setPaused] = useState(false)
  const [still, setStill] = useState(false)
  const gradientId = useId()

  return (
    <main className={styles.study} data-paused={paused} data-still={still}>
      <section
        key={run}
        className={styles.hero}
        aria-labelledby="hero-study-title"
      >
        <div className={styles.headline}>
          <h1 id="hero-study-title">
            <span>
              <span>Technology for</span>
            </span>
            <span>
              <span>Organisations.</span>
            </span>
          </h1>
        </div>
        <div className={styles.intro}>
          <p>
            We build the systems that help organisations operate, grow, and
            better serve the people who depend on them.
          </p>
        </div>

        <div className={styles.field} aria-hidden="true">
          <div className={styles.tiles}>
            {Array.from({ length: 96 }, (_, i) => (
              <i
                key={i}
                style={
                  {
                    "--tile-color": [
                      "#004bff",
                      "#0033aa",
                      "#006bda",
                      "#008eb8",
                      "#00c4df",
                      "#00ffff",
                    ][(i * 7 + Math.floor(i / 12) * 3) % 6],
                    "--tile-delay": `${((i * 13) % 17) * -0.29}s`,
                    "--reveal-delay": `${0.1 + Math.abs((i % 12) - 5.5) * 0.075 + Math.floor(i / 12) * 0.045}s`,
                  } as CSSProperties
                }
              />
            ))}
          </div>
          <div className={styles.grid} />
          <div className={styles.mark}>
            <svg viewBox="0 0 1094 790" fill="none">
              <defs>
                <linearGradient
                  id={gradientId}
                  x1="173"
                  y1="616"
                  x2="921"
                  y2="173"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#004bff" />
                  <stop offset="1" stopColor="#00ffff" />
                </linearGradient>
              </defs>
              <path
                className={styles.bridge}
                d="M173 616L921 173"
                pathLength="1"
                stroke={`url(#${gradientId})`}
                strokeWidth="346"
              />
              <image
                className={styles.endA}
                href="/brand/hero-blob-a.svg"
                x="748"
                y="0"
                width="346"
                height="346"
              />
              <image
                className={styles.endB}
                href="/brand/hero-blob-b.svg"
                x="0"
                y="443"
                width="346"
                height="346"
              />
            </svg>
          </div>
          <span className={styles.coordinateA}>01 / ORGANISATIONS</span>
          <span className={styles.coordinateB}>02 / SOCIETY</span>
          <span className={styles.crossA}>+</span>
          <span className={styles.crossB}>+</span>
        </div>

        <div className={styles.outcome}>
          <span className={styles.arrow} aria-hidden="true">
            ↓<br />↓<br />↓
          </span>
          <div>
            <p className={styles.outcomeLabel}>
              Stronger systems. Wider possibilities.
            </p>
            <h2>
              Progress
              <br />
              for Society.
            </h2>
            <p className={styles.location}>From Nigeria. Across Africa.</p>
          </div>
        </div>
      </section>

      <div
        className={styles.controls}
        role="group"
        aria-label="Hero prototype controls"
      >
        <span>Hero study / 01</span>
        <button
          onClick={() => {
            setPaused(false)
            setStill(false)
            setRun((n) => n + 1)
          }}
        >
          Replay ↺
        </button>
        <button
          disabled={still}
          aria-pressed={paused}
          onClick={() => setPaused((p) => !p)}
        >
          {paused ? "Resume" : "Pause"}
        </button>
        <button aria-pressed={still} onClick={() => setStill((s) => !s)}>
          Still frame
        </button>
      </div>
    </main>
  )
}
