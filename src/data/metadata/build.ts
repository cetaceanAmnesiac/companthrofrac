import { type MetadatumDto } from '@/data/metadata';
import { readFileSync, writeFileSync } from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import { parse as parseChoices } from './parse-choices';
import { parse as parseMetadata } from './parse-fields';

const IN_CHOICES = './panel-choices.mdto';
const IN_FIELDS = './metadata-fields.md';
const OUTPUT = './_output.dto.json';

const main = () => {
  const __dirname = dirname(fileURLToPath(import.meta.url));
  const getPath = (filename: string) => resolve(__dirname, filename);

  const choicesPath = getPath(IN_CHOICES);
  const fieldsPath = getPath(IN_FIELDS);
  const outputPath = getPath(OUTPUT);

  const fieldsData = parseMetadata(readFileSync(fieldsPath, 'utf-8'));
  const choicesData = parseChoices(readFileSync(choicesPath, 'utf-8'));

  const metadata = choicesData.map<MetadatumDto>(panel => {
    const meta = fieldsData[panel.index];
    if (!meta) throw new Error(`No metadata for panel ${panel.index}`);
    return {
      index: panel.index,
      date: meta.date,
      nomianiColor: panel.nomianiColor,
      choices: panel.choices,
      resolution: panel.resolution,
      metadata: panel.metadata,
      tags: meta.tags,
      description: meta.description,
      tumblrPostId: meta.tumblrPostId,
    };
  });

  const missing = choicesData
    .filter(p => !fieldsData[p.index])
    .map(p => p.index);
  if (missing.length)
    console.warn(`No metadata for panels: ${missing.join(', ')}`);

  const output = JSON.stringify(metadata, null, 2);

  writeFileSync(outputPath, output);
  console.log(`Wrote ${metadata.length} panels to ${outputPath}`);
};

main();
