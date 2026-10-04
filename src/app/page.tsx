import "./custom.css";
import Link from "next/link";
import React from "react";
import { ReadIndex } from "@/utils";
import { Metadata } from "next";
import Image from "next/image";
import { news } from "../../resumaker/ledger";
import { siteTimeline } from "../../resumaker/render/site";

const getStaticProps = async () => {
  const indexEntries: IndexEntry[] = await ReadIndex(true);

  return {
    articles: indexEntries.filter((x) => x.pinned),
    news,
    timeline: siteTimeline(),
  };
};

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Home / Sanchit Sahay",
  };
}

const grey = { color: "var(--text-color-alt)" };

export default async function Home() {
  const { articles, news, timeline } = await getStaticProps();

  return (
    <>
      <div className="window">
        <div className="portrait">
          <Image
            src="/mt_washington.jpg"
            className="window-portrait"
            width={200}
            height={200}
            alt="portrait"
          />
          <figcaption>Mt. Washington, 2025</figcaption>
        </div>
        <div className="scrollable">
          It was the best of webpages, it was the worst of webpages.
          <p>
            I&apos;m a Computer Science PhD student at NYU&apos;s{" "}
            <Link href="https://ssl.engineering.nyu.edu/">
              Secure Systems Lab
            </Link>{" "}
            working on software supply-chain security and operating systems
            research.
          </p>
          <p>
            In previous roles I built systems for virtualization and cloud
            infrastructure, and spent a good deal of time on developer tooling.
          </p>
          <p>
            Check out some of my <Link href="/blog">Pocket Litter</Link> here:
          </p>
          <ul>
            {articles.map((art) => (
              <li key={art.slug} className="pin">
                <Link href={`/blog/${art.slug}`}>{art.title}</Link>
                <span> {art.blurb} </span>
              </li>
            ))}
          </ul>
          <table>
            <tbody className="timeline">
              {timeline.map((row) => {
                const label = (
                  <>
                    {row.label}{" "}
                    {row.suffix ? <span style={grey}>{row.suffix}</span> : null}
                  </>
                );

                return (
                  <tr key={row.id}>
                    <td>[{row.years}]</td>
                    <td>
                      <b>{row.org}</b>
                      <div className="mobile">{label}</div>
                    </td>
                    <td className="full">{label}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="news-title">
        <b>
          <u>NEWS</u>
        </b>
        <hr />
      </div>

      <div style={{ marginTop: "5px", marginBottom: "40px" }}>
        {news.map((x, idx) => (
          <div key={idx} className="news">
            <span
              style={{ margin: "0px", padding: "0px" }}
              dangerouslySetInnerHTML={{ __html: x[0] }}
            ></span>
            <br className="mobile" />
            <span
              style={{
                margin: "0px",
                padding: "0px",
                color: "var(--text-color-alt)",
              }}
              dangerouslySetInnerHTML={{ __html: x[1] }}
            ></span>
          </div>
        ))}
      </div>
    </>
  );
}
