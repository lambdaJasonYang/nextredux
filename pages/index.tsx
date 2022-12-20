import Head from "next/head";
import Image from "next/image";
import Counter from "../components/specific/counter/Counter";
import {
  NavBar,
  NavLogo,
  NavItem,
  NavDropDown,
  NavDropDownItem,
  NavDropDownDivider,
  NavSearch,
} from "../components/Navbar";
import { Button } from "../components/Button";
import { List, ListItem, ListLink } from "../components/List";

// import NavDropDownItem from '../components/NavBar/NavDropDownItem'
// import Alert from '../components/Alert'
import { useState } from "react";
// import styles from '../styles/Home.module.css'

const range = (start: number, stop: number): number[] =>
  [...Array(stop).keys()].slice(start);

export default function Playground(): any {
  const [getGHname, setGHname] = useState("");
  const [getPages, setPages] = useState<any[]>([]);
  const [getProfile, setProfile] = useState<any>(null);
  const GETPROFILE = async (): Promise<void> => {
    await fetch(`https://api.github.com/users/${getGHname}`)
      .then(async (response) => await response.json())
      .then((profile) => setProfile(() => profile));
  };
  const getPagePromise = async (
    user: string,
    pageindex: number = 1
  ): Promise<any[]> => {
    return await fetch(
      `https://api.github.com/users/${user}/repos?per_page=100&page=${pageindex}`
    )
      .then(async (response) => await response.json())
      .then((pages) => pages)
      .catch((e) => console.log(e));
  };

  const GETSOME = async (): Promise<void> => {
    const myprofile = await fetch(
      `https://api.github.com/users/${getGHname}`
    ).then(async (response) => await response.json());
    const iters = await Math.ceil(myprofile.public_repos / 100);
    const promiselist = range(1, iters + 1).map(
      async (pageindex) => await getPagePromise(getGHname, pageindex)
    );
    const nestedOutput = await Promise.all(promiselist);
    // const mypages: any[] = await getPagePromise(getGHname,3);
    setPages(nestedOutput.flat());
    // await fetch(`https://api.github.com/users/${getGHname}/repos?per_page=100`)
    //   .then(async (response) => await response.json())
    //   .then((pages) => setPages((old) => pages));
  };
  const onchangetxt = (event: any): void => {
    setGHname((old) => event.target.value);
  };

  return (
    <>
      <NavBar
        logo={
          <NavLogo
            src="https://dev.w3.org/SVG/tools/svgweb/samples/svg-files/atom.svg"
            label="HI"
          />
        }
      >
        <NavItem label="BootStrapPlayground" link="/playground" />
        <NavItem label="NetworkScanner" link="/networkscan" />
        <NavDropDown label="DropDown" link="#">
          <NavDropDownItem href="/gridplayground" label={"gridplayground"} />
          <NavDropDownDivider />
          <NavDropDownItem href="/gridplayground" label={"again"} />
          <NavDropDownItem href={""} label={"Too Much Stuff"} />
        </NavDropDown>
        <NavSearch />
      </NavBar>

      <div className="container">
        <Head>
          <title>Create Next App</title>
          <meta name="description" content="Generated by create next app" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <main className="main">
          <div className="container">
            <Counter />
            <div className="row">
              <div className="col">
                <input type="text" onChange={onchangetxt}></input>
              </div>
              <div className="col">
                <button className="border border-primary" onClick={GETSOME}>
                  GET ALL REPOS and GHPAGES
                </button>
              </div>
              <Button
                onClick={(x: any) => console.log(getPages)}
                label="Log to Console"
              />
              <button onClick={GETPROFILE}>GET PROFILE REPO COUNT</button>
            </div>
            <div className="row">
              <div>{getProfile?.public_repos}</div>
              <List>
                {getPages.map((page) => (
                  <ListItem key={page.id} label={page.html_url} />
                ))}
              </List>
              <div>
                Stuff with pages list
                <List>
                  {getPages
                    .filter((x: any) => x.has_pages === true)
                    .map((page) => {
                      const link: string = `https://${
                        page.owner.login as string
                      }.github.io/${page.name as string}`;
                      return (
                        <ListLink
                          key={page.id}
                          href={link}
                          label={page.html_url as string}
                        />
                      );
                    })}
                </List>
              </div>
            </div>
          </div>
        </main>

        <footer className="footer">
          <a
            href="https://userjy.github.io"
            target="_blank"
            rel="noopener noreferrer"
          >
            Powered by{"Something"}
            <span className="logo">
              <Image
                src="/vercel.svg"
                alt="Vercel Logo"
                width={72}
                height={16}
              />
            </span>
          </a>
        </footer>
      </div>
    </>
  );
}