import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

const patternsDirectory = path.join(process.cwd(), 'content/patterns');

export function getSortedPatternsData() {
  // Get file names under /content/patterns
  const fileNames = fs.readdirSync(patternsDirectory);
  const allPatternsData = fileNames
    .filter(fileName => fileName.endsWith('.md') || fileName.endsWith('.mdx'))
    .map(fileName => {
      // Remove ".md" from file name to get id
      const id = fileName.replace(/\.mdx?$/, '');

      // Read markdown file as string
      const fullPath = path.join(patternsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');

      // Use gray-matter to parse the post metadata section
      const matterResult = matter(fileContents);

      // Combine the data with the id
      return {
        id,
        ...(matterResult.data)
      };
    });
  
  // Sort patterns by title (or you could add an 'order' field in frontmatter)
  return allPatternsData.sort((a, b) => {
    if (a.title < b.title) {
      return -1;
    } else if (a.title > b.title) {
      return 1;
    } else {
      return 0;
    }
  });
}

export async function getPatternData(id) {
  const fullPath = path.join(patternsDirectory, `${id}.md`);
  let fileContents;
  try {
    fileContents = fs.readFileSync(fullPath, 'utf8');
  } catch (e) {
    // If .md fails, try .mdx
    const mdxPath = path.join(patternsDirectory, `${id}.mdx`);
    fileContents = fs.readFileSync(mdxPath, 'utf8');
  }

  // Use gray-matter to parse the post metadata section
  const matterResult = matter(fileContents);

  // Use remark to convert markdown into HTML string
  const processedContent = await remark()
    .use(html)
    .process(matterResult.content);
  const contentHtml = processedContent.toString();

  // Combine the data with the id and contentHtml
  return {
    id,
    contentHtml,
    ...(matterResult.data)
  };
}
