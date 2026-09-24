import { getPatternData, getSortedPatternsData } from '@/lib/markdown';
import TemplateViewer from '@/components/TemplateViewer';

export async function generateStaticParams() {
  const patterns = getSortedPatternsData();
  return patterns.map((pattern) => ({
    pattern: pattern.id,
  }));
}

export async function generateMetadata({ params }) {
  const { pattern } = await params;
  const patternData = await getPatternData(pattern);
  return {
    title: `${patternData.title} - DSA Vault`,
  };
}

export default async function PatternPage({ params }) {
  const { pattern } = await params;
  const patternData = await getPatternData(pattern);
  
  return <TemplateViewer patternData={patternData} />;
}
