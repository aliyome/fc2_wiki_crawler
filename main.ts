import { QUIZ_2022_LINKS } from './data.ts';

export function parseQuiz(text: string) {
  return /user_body">(.*?)<hr/gms.exec(text)?.[1] ?? '';
}

export function parseAnswer(text: string) {
  return /region_div".*?>(.*?)<\/div>/gms.exec(text)?.[1] ?? '';
}

// FIXME: this includes quiz and answer
export function parseCommentary(text: string) {
  return /(<div>.*?【解説】.*?<\/div>)/gms.exec(text)?.[1] ?? '';
}

// Learn more at https://deno.land/manual/examples/module_metadata#concepts
if (import.meta.main) {
  for (const { title, href } of QUIZ_2022_LINKS) {
    const res = await fetch(href);
    const text = await res.text();
    const quiz = parseQuiz(text);
    const answer = parseAnswer(text);
    const commentary = parseCommentary(text);
    Deno.writeTextFileSync(`./quiz/${title}_quiz.txt`, quiz);
    Deno.writeTextFileSync(`./answer/${title}_answer.txt`, answer);
    Deno.writeTextFileSync(`./commentary/${title}_commentary.txt`, commentary);
  }
}
