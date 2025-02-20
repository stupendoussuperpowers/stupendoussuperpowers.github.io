import './custom.css';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <div className='window'>
      <div className='portrait'>
        <Image src='/staring_off_into_the_distance.jpg'
          width={150}
          height={400}
          alt='portrait'
          style={{ objectFit: "cover" }}
        />
      </div>
      <div className='scrollable'>
        <p>
          Come one, come all to my corner of the internet!
        </p>
        <p>
          I&apos;m a graduate student in CS at NYU, with a focus on Systems. Over the past years, I&apos;ve worked on building
          scalable and resilient distributed systems. I&apos;m deeply interested in the cloud, virtualization, web technologies and building
          data intensive applications which can leverage AI.
        </p>
        <p>
          Take a look at my recent <Link href="/projects">Projects</Link>, or check me out on <a href="https://github.com/stupendoussuperpowers">Github</a>. You can also head over to my scaffolded <Link href="/blog">Blog</Link>, the choices are endless.
        </p>
        <p>
          [2024-Pres] <b>New York University</b>, MS Computer Science <br />

          [2022-2024] <b>Commvault Systems</b>, Virtual Server Agent team. <br />

          [2021-2021] <b>LegalAI</b>, Fullstack Web & DevOps Intern. <br />

          [2018-2022] <b>Manipal Institute of Technology</b>, B.Tech (IT)
        </p>
        <p>
          [Languages] Python, Javascript, Rust, C/C++, Go, Java <br />
          [Virtualization/Cloud] Docker, Kubernetes, VMware, AWS, GCP, Azure
          [Frameworks] React.js, Node.js, pandas, numpy, tensorflow, keras, Spark
          [Misc.] MySQL, Postgres, Redis, MongoDB, Distributed Systems, Operating Systems, Languages
        </p>

      </div>
    </div >
  );
}
