import { type Component } from 'svelte';
import DefaultBody from '𝕮⁂𝕮/colormarks/DefaultBody.svelte';
import NavigatrixBody from '𝕮⁂𝕮/colormarks/NavigatrixBody.svelte';
import SightingsBody from '𝕮⁂𝕮/colormarks/SightingsBody.svelte';
import {
  type Colorword,
  type SparseColormap,
} from '𝕮⁂𝕮/colormarks/colormarks.model';
import ComicMap from '𝕮⁂𝕮/marks-facet/ComicMap.svelte';

export type BodyProps = {
  word: Colorword;
};

const BODY_REGISTRY: SparseColormap<Component<BodyProps>> = {
  anthrofolia: ComicMap,
  navigatrix: NavigatrixBody,
  sightings: SightingsBody,
};

export const getBody = (word: Colorword): Component<BodyProps> =>
  BODY_REGISTRY[word] ?? DefaultBody;
