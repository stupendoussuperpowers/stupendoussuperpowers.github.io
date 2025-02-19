import './custom.css';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <div className='window'>
      <div className='portrait'>
        <Image src='/Edsger_Wybe_Dijkstra.jpg'
          width={100}
          height={400}
          alt='portrait'
        />
      </div>
      <div className='scrollable'>

        <p>
          Come one, come all to my corner of the internet!
        </p>
        <p>
          I'm a graduate student in CS at NYU, with a focus on Systems. Over the past years, I've worked on building
          scalable and resilient distributed systems. I'm deeply interested in the cloud, virtualization, web technologies and building
          data intensive applications which can leverage AI.
        </p>
        <p>
          Take a look at my recent <Link href="/projects">Projects</Link>, or check me out on <a href="https://github.com/stupendoussuperpowers">Github</a>.
        </p>
        <p>
          [2024-Pres] <b>New York University</b>, MS Computer Science <br />

          [2022-2024] <b>Commvault Systems</b>, Virtual Server Agent team. <br />

          [2021-2021] <b>LegalAI</b>, Fullstack Web & DevOps Intern. <br />

          [2018-2022] <b>Manipal Institute of Technology</b>, B.Tech (IT)</p>

      </div>
    </div >
  );
}
