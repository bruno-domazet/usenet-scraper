import { NntpConnection } from "nntp-fast";

async function main() {
  const conn = new NntpConnection();
  await conn.connect("news.php.net", 119);

  // get date from server
  console.log(await conn.date());

  // switch to group php.general
  await conn.group("php.general");

  // get article
  const article = await conn.article(23131);
  console.log(article.headers);
  console.log(article.body.toString());

  await conn.runCommand("QUIT");
}

async function secure() {
  const conn = new NntpConnection({ dotUnstuffing: false });
  await conn
    .connect("news.eweka.nl", 563, true)
    .then((resp) => console.log(resp));

  // auth
  await conn
    .runCommand(`AUTHINFO USER ${process.env.AUTH_USER}`)
    .then((resp) => console.log(resp));
  await conn
    .runCommand(`AUTHINFO PASS ${process.env.AUTH_PASS}`)
    .then((resp) => console.log(resp));

  console.log(await conn.date());

  await conn.group("alt.binaries.dvd").then((resp) => console.log(resp));
  const latest = await conn.next().then((resp) => {
    console.log(resp);
    return resp;
  });
  await conn.body(latest.articleNumber).then((resp) => console.log(resp));

  conn.runCommand("QUIT").then((resp) => console.log(resp));
  return;
  //   // get date from server
  //   console.log(await conn.date());

  //   // get body as stream
  //   const r = await conn.bodyStream(
  //     "<uQ8vBCAo$st$uyOmdX$ZKLpHez9@iu6bkwQcawtRbODe>"
  //   );

  //   r.stream.on("data", (data: any) => console.log(data.length));
  //   r.stream.on("end", () => conn.runCommand("QUIT"));
}

secure().catch((err) => console.log(err));
