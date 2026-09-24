import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import remarkGfm from 'remark-gfm';

const patternsDirectory = path.join(process.cwd(), 'content/patterns');

function getAllFiles(dirPath, arrayOfFiles) {
  const files = fs.readdirSync(dirPath);
  arrayOfFiles = arrayOfFiles || [];

  files.forEach(function(file) {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
    } else {
      if (file.endsWith('.md') || file.endsWith('.mdx')) {
        arrayOfFiles.push(path.join(dirPath, file));
      }
    }
  });

  return arrayOfFiles;
}

export function getSortedPatternsData() {
  const allFiles = getAllFiles(patternsDirectory);
  
  const allPatternsData = allFiles.map(fullPath => {
    // Make path relative to patternsDirectory
    const relativePath = path.relative(patternsDirectory, fullPath);
    // Replace Windows slashes with forward slashes
    const normalizedPath = relativePath.replace(/\\/g, '/');
    const id = normalizedPath.replace(/\.mdx?$/, '');
    
    // Extract chapter from folder name (if any), otherwise 'General'
    const parts = id.split('/');
    const chapter = parts.length > 1 ? parts[0] : 'General';
    
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const matterResult = matter(fileContents);
    
    return {
      id,
      chapter,
      ...(matterResult.data)
    };
  });
  
  return allPatternsData.sort((a, b) => {
    if (a.chapter !== b.chapter) {
      if (a.chapter === 'General') return -1;
      if (b.chapter === 'General') return 1;
      return a.chapter.localeCompare(b.chapter);
    }
    return a.title.localeCompare(b.title);
  });
}

export async function getPatternData(id) {
  // id could be an array of path segments if coming from catch-all route, or a string
  const idPath = Array.isArray(id) ? id.join('/') : id;
  const fullPath = path.join(patternsDirectory, `${idPath}.md`);
  let fileContents;
  try {
    fileContents = fs.readFileSync(fullPath, 'utf8');
  } catch (e) {
    const mdxPath = path.join(patternsDirectory, `${idPath}.mdx`);
    fileContents = fs.readFileSync(mdxPath, 'utf8');
  }

  const matterResult = matter(fileContents);
  const processedContent = await remark()
    .use(remarkGfm)
    .use(html)
    .process(matterResult.content);
  const contentHtml = processedContent.toString();
  
  const parts = idPath.split('/');
  const chapter = parts.length > 1 ? parts[0] : 'General';

  return {
    id: idPath,
    chapter,
    contentHtml,
    ...(matterResult.data)
  };
}
