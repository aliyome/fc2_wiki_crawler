import { QUIZ_2019_LINKS, QUIZ_2021_LINKS, QUIZ_2022_LINKS } from './data.ts';

function parseQuiz(text: string) {
  return /user_body">(.*?)<hr/gms.exec(text)?.[1] ?? '';
}

function parseAnswer(text: string) {
  return /region_div".*?>(.*?)<\/div>/gms.exec(text)?.[1] ?? '';
}

// FIXME: this includes quiz and answer
function parseCommentary(text: string) {
  return /(<div>.*?【解説】.*?<\/div>)/gms.exec(text)?.[1] ?? '';
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function scrape(href: string, _title: string) {
  const res = await fetch(href);
  const text = await res.text();
  const quiz = parseQuiz(text);
  const answer = parseAnswer(text);
  const commentary = parseCommentary(text);
  return { quiz, answer, commentary };
}

function save(
  dirName: string,
  title: string,
  quiz: string,
  answer: string,
  commentary: string
) {
  try {
    Deno.mkdirSync(`./quiz/${dirName}`, { recursive: true });
  } catch {
    // ignore error if directory already exists
  }
  Deno.writeTextFileSync(`./quiz/${title}_quiz.txt`, quiz);
  Deno.writeTextFileSync(`./quiz/${title}_answer.txt`, answer);
  Deno.writeTextFileSync(`./quiz/${title}_commentary.txt`, commentary);
}

async function crawl(dirPrefix: string, data: typeof QUIZ_2022_LINKS) {
  for (const [category, links] of Object.entries(data)) {
    console.log(`scraping ${category}`);
    for (const { title, href } of links) {
      const { quiz, answer, commentary } = await scrape(href, title);
      save(`${dirPrefix}_${category}`, title, quiz, answer, commentary);
      await sleep(100);
    }
  }
}

if (import.meta.main) {
  await crawl('2022', QUIZ_2022_LINKS);
  // await crawl(QUIZ_2021_LINKS);
  // await crawl(QUIZ_2019_LINKS);
}
