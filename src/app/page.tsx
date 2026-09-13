import "./custom.css";
import Link from "next/link";
import React from "react";
import { ReadIndex } from "@/utils";
import { Metadata } from "next";
import Image from "next/image";

const getStaticProps = async () => {
  const indexEntries: IndexEntry[] = await ReadIndex(true);

  const news = [
    [
      '"Over the Shoulder: Improving SBOM Accuracy by Watching the Build" <br/> was accepted to ACM SCORED 2026, Prague',
      "To Appear Oct 06, 2026",
    ],
    [
      '<a href="https://youtu.be/VYY3HnRtV6U?si=yOaUd6htQnPzMJnE">Asleep at the Wheel (PyCon US 2026)</a> is now on YouTube.',
      "Uploaded Jul 02, 2026",
    ],
    [
      'Catch our talk, <a href="https://us.pycon.org/2026/schedule/presentation/116">Asleep at the Wheel @ PyCon US 2026!</a>',
      "Presented May 16, 2026",
    ],
  ];

  return { articles: indexEntries.filter((x) => x.pinned), news };
};

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Home / Sanchit Sahay",
  };
}

export default async function Home() {
  const { articles, news } = await getStaticProps();

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
            In my previous roles, I&apos;ve worked closely on building systems
            that enhance virtualization and cloud infrastructure, and on
            improving developer tooling.
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
              <tr>
                <td>[2026-Pres]</td>
                <td>
                  <b>New York University</b>
                  <div className="mobile">
                    Ph.D.{" "}
                    <span style={{ color: "var(--text-color-alt)" }}>
                      Computer Science
                    </span>
                  </div>
                </td>
                <td className="full">
                  Ph.D.{" "}
                  <span style={{ color: "var(--text-color-alt)" }}>
                    Computer Science
                  </span>
                </td>
              </tr>

              <tr>
                <td>[2024-2026]</td>
                <td>
                  <b></b>
                  <div className="mobile">M.S.</div>
                </td>
                <td className="full">M.S.</td>
              </tr>

              <tr>
                <td>[2022-2024]</td>
                <td>
                  <b>Commvault Systems </b>
                  <div className="mobile">Virtualization</div>
                </td>
                <td className="full">Virtualization</td>
              </tr>

              <tr>
                <td>[2021-2021]</td>
                <td>
                  <b>LegalAI </b>
                  <div className="mobile">Web & DevOps Intern</div>
                </td>
                <td className="full">Web & DevOps Intern</td>
              </tr>

              <tr>
                <td>[2018-2022]</td>
                <td>
                  <b>Manipal Institute of Technology </b>
                  <div className="mobile">
                    B.Tech{" "}
                    <span style={{ color: "var(--text-color-alt)" }}>(IT)</span>
                  </div>
                </td>
                <td className="full">
                  {" "}
                  B.Tech{" "}
                  <span style={{ color: "var(--text-color-alt)" }}>(IT)</span>
                </td>
              </tr>
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
