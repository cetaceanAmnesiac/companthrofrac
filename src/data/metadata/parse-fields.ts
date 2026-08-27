import { MetadatumDto } from '@/data/metadata/metadata.model';

type MetadataFields = Pick<
  MetadatumDto,
  'date' | 'tumblrPostId' | 'tags' | 'description'
>;

const parseSection = (body: string): MetadataFields => {
  const lines = body.split(/\r?\n/);

  let date: string | null = null;
  let tumblrPostId: string | null = null;
  const tags: string[] = [];
  let inTags = false;
  let freetextStart: number | null = null;
  let description: string | null = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line === '') {
      inTags = false;
      continue;
    }

    if (line.startsWith('    - ')) {
      if (inTags) tags.push(line.slice(6));
      continue;
    }

    if (line.startsWith('- ')) {
      inTags = false;
      const content = line.slice(2);
      if (content === 'tags') {
        inTags = true;
        continue;
      }
      const tumblrMatch = content.match(/^tumblrPostId :: (\d{18})$/);
      if (tumblrMatch) {
        tumblrPostId = tumblrMatch[1];
        continue;
      }
      if (!date) {
        date = content;
        continue;
      }
    }

    // first non-bullet, non-empty line = start of freetext
    freetextStart = i;
    break;
  }

  if (freetextStart !== null) {
    const freetextLines = lines.slice(freetextStart);
    const first = freetextLines[0].replace(/^DESCRIPTION:\s*/i, '').trim();
    const rest = freetextLines.slice(1).join('\n').trim();
    const text = [first, rest].filter(Boolean).join('\n');
    description = text || null;
  }

  if (!date) throw new Error('Missing date');
  return { date, tumblrPostId, tags, description };
};

export const parse = (content: string): Record<number, MetadataFields> => {
  const parts = content.split(/^### (\d+)\s*$/m);
  // parts: ['', '1', body1, '2', body2, ...]
  const result: Record<number, MetadataFields> = {};

  for (let i = 1; i < parts.length; i += 2) {
    const index = parseInt(parts[i], 10);
    const body = parts[i + 1] ?? '';
    result[index] = parseSection(body);
  }

  return result;
};
