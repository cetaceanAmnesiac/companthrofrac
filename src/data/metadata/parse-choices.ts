import { type MetadatumDto } from '@/data/metadata/metadata.model';
import {
  type ActionCode,
  type Choice,
  type ChoiceCode,
  type Resolution,
  type TagResolution,
  type WRBYG,
} from '𝕮⁂𝕮/anthrofractal/choices';

type BaseMatch = { [Key in keyof any]?: string };

const createMatcher =
  <Match extends BaseMatch>(regex: RegExp) =>
  (value: string) =>
    (value.match(regex)?.groups as Match | undefined) ?? null;

type ParsedLine = ParsedPanelLine | ParsedChoiceLine;

type ParsedPanelLine = {
  type: 'panel';
  index: number;
  nomianiColor: string | null;
  valenceCode: string | null;
  metadata: string | null;
};

type ParsedChoiceLine = {
  type: 'choice';
  choiceCode: ChoiceCode;
  action: ActionCode;
  text: string;
};

type PanelWithChoices = {
  panel: ParsedPanelLine;
  choices: Choice[];
};

type ChoiceFields = Pick<
  MetadatumDto,
  'index' | 'nomianiColor' | 'choices' | 'resolution' | 'metadata'
>;

export const parse = (content: string): ChoiceFields[] =>
  content
    .trimEnd()
    .split(/\r?\n/)
    .reduce<PanelWithChoices[]>((groupedLines, line, index) => {
      const parsedLine = parseLine(line, index + 1);
      if (!parsedLine) throw new Error(`Line ${index + 1} invalid:\n"${line}"`);

      switch (parsedLine.type) {
        case 'panel':
          groupedLines.push({
            panel: parsedLine,
            choices: [],
          });
          break;

        case 'choice':
          if (groupedLines.length === 0)
            throw new Error(`Orphaned choice at line ${index + 1}:\n"${line}"`);
          groupedLines[groupedLines.length - 1].choices.push(
            createChoice(parsedLine),
          );
          break;
      }

      return groupedLines;
    }, [])
    .map(finalizePanel);

const LINE_REGEX = /^(?<indentation> *)- (?<content>.+)$/;
const matchLine = createMatcher<LineMatch>(LINE_REGEX);
type LineMatch = {
  indentation: string;
  content: string;
};

const parseLine = (line: string, lineNumber: number): ParsedLine | null => {
  if (line.trim() === '') return null;

  const match = matchLine(line);
  if (!match) throw new Error(`Line ${lineNumber} invalid:\n"${line}"`);

  const {
    indentation: { length: spaces },
    content,
  } = match;

  switch (spaces) {
    case 0:
      return parsePanelLine(content);
    case 4:
      return parseChoiceLine(content);
    default:
      throw new Error(
        `Line ${lineNumber} indentation invalid (${spaces} spaces):\n"${line}"`,
      );
  }
};

// ^- (\d+) :: (?:(N=[WRBYG]+) ::)?(.+?) ::(?: (. .*))?$
const PANEL_LINE_REGEX =
  /^(?<index>\d+) :: (?:N=(?<nomianiColor>[WRBYG]+) :: )?(?<valenceCode>.+?) ::(?: (?<metadata>. .*))?$/;
const matchPanelLine = createMatcher<PanelLineMatch>(PANEL_LINE_REGEX);
type PanelLineMatch = {
  index: string;
  nomianiColor?: string;
  valenceCode: string;
  metadata?: string;
};

const parsePanelLine = (content: string): ParsedPanelLine => {
  const match = matchPanelLine(content);
  if (!match) throw new Error(`Invalid panel format:\n"${content}"`);

  const { index, nomianiColor, valenceCode, metadata } = match;

  return {
    type: 'panel',
    index: parseInt(index, 10),
    nomianiColor: nomianiColor ?? null,
    valenceCode: valenceCode === '----' ? null : valenceCode,
    metadata: metadata ?? null,
  };
};

const VALENCE_REGEX = /^(?<choicesCode>[WRBYG]{1,4}) -> (?<resolutionCode>.+)$/;
const matchValence = createMatcher<ValenceMatch>(VALENCE_REGEX);
type ValenceMatch = {
  choicesCode: string;
  resolutionCode: string;
};

const RESOLUTION_REGEX =
  /^(?:(?<tag><\w+>)|(?<realizedChoices>[1-4]-[WRBYG](?:,[1-4]-[WRBYG])*))$/;
const matchResolution = createMatcher<ResolutionMatch>(RESOLUTION_REGEX);
type ResolutionMatch =
  | { tag: string; realizedChoices: never }
  | { tag: never; realizedChoices: string };

const CHOICE_LINE_REGEX =
  /^(?<choiceCode>[1-4]-[WRBYG]) :: (?<action>[*">-]) (?<text>.+)$/;
const matchChoiceLine = createMatcher<ChoiceLineMatch>(CHOICE_LINE_REGEX);
type ChoiceLineMatch = {
  choiceCode: ChoiceCode;
  action: ActionCode;
  text: string;
};

const parseChoiceLine = (content: string): ParsedChoiceLine => {
  const match = matchChoiceLine(content);
  if (!match) throw new Error(`Invalid choice format: "${content}"`);
  const { choiceCode, action, text } = match;

  return {
    type: 'choice',
    choiceCode,
    action,
    text,
  };
};

const createChoice = ({
  choiceCode,
  action,
  text,
}: ParsedChoiceLine): Choice => [
  choiceCode.split('-')[1] as WRBYG,
  action,
  text,
];

const finalizePanel = ({
  panel: { index, nomianiColor, valenceCode, metadata },
  choices,
}: PanelWithChoices): ChoiceFields => {
  let resolution: Resolution | null = null;
  if (valenceCode) {
    const valenceMatch = matchValence(valenceCode);
    if (!valenceMatch) throw new Error(`Invalid valenceCode "${valenceCode}"`);
    const { choicesCode, resolutionCode } = valenceMatch;

    if (choices.reduce((code, [color]) => code + color, '') !== choicesCode)
      throw new Error(
        `choicesCode mismatch (expected "${choicesCode},${index}")`,
      );

    const resolutionMatch = matchResolution(resolutionCode);
    if (!resolutionMatch)
      throw new Error(`Invalid resolutionCode "${resolutionCode}"`);

    resolution =
      (resolutionMatch.tag as TagResolution) ??
      choices.reduce<number[]>((acc, [color], choiceIndex) => {
        if (resolutionCode.includes(`${choiceIndex + 1}-${color}`))
          acc.push(choiceIndex);
        return acc;
      }, []);

    if (Array.isArray(resolution) && resolution.length === 0)
      throw new Error(`Resolution is empty for panel ${index}`);
  }

  return {
    index,
    nomianiColor,
    choices: choices.length === 0 ? null : choices,
    resolution,
    metadata,
  };
};
